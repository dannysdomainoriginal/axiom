import Task from "@/models/Task";
import { RequestHandler } from "express";
import httpError from "http-errors";

/* -------------------------------------------------------------------------- */
/*                                GET ALL TASKS                               */
/* -------------------------------------------------------------------------- */
export const getTasks: RequestHandler = async (req, res) => {
  const { status } = req.query as Record<string, string>;
  const allowedStatuses = ["Pending", "In Progress", "Completed"];

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status: ${status}\nAllowed statuses are ${allowedStatuses.join(", ")}`,
      status: 400,
    });
  }

  const filter = status ? { status } : {};
  const isAdmin = req.user.roles.includes("admin");

  const baseTasks = isAdmin
    ? await Task.find(filter)
        .populate("assignedTo", "name email profileImageUrl")
        .lean({ versionKey: false })
    : await Task.find({ ...filter, assignedTo: req.user._id })
        .populate("assignedTo", "name email profileImageUrl")
        .lean({ versionKey: false });

  // Add completed todoChecklist count to each task
  const tasks = await Promise.all(
    baseTasks.map((task) => {
      const completedTodoCount = task.todoChecklist.filter(
        (i) => i.completed,
      ).length;

      return { ...task, completedTodoCount };
    }),
  );

  // Status summaries
  const countFilter = isAdmin ? {} : { assignedTo: req.user._id };

  /* ------------------- optimized summary code from chatgpt ------------------ */
  const summary = await Task.aggregate([
    { $match: countFilter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  console.log(summary);

  const summaryMap: Record<string, number> = summary.reduce((acc, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});

  res.status(201).json({
    success: true,
    count: tasks.length,
    data: {
      tasks,
      statusSummary: {
        all: Object.values(summaryMap).reduce((a, b) => a + b, 0),
        pendingTasks: summaryMap["Pending"] || 0,
        inProgressTasks: summaryMap["In Progress"] || 0,
        completedTasks: summaryMap["Completed"] || 0,
      },
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                               GET TASK BY ID                               */
/* -------------------------------------------------------------------------- */
export const getTaskById: RequestHandler = async (req, res) => {
  const task = await Task.findById(req.params.taskId)
    .populate("assignedTo", "name email profileImageUrl")
    .lean({ versionKey: false });

  if (!task) {
    throw httpError[404]("Task was not found");
  }

  res.status(200).json({
    success: true,
    data: task,
  });
};

/* -------------------------------------------------------------------------- */
/*                                 CREATE TASK                                */
/* -------------------------------------------------------------------------- */
export const createTask: RequestHandler = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: await task.populate("assignedTo", "name email profileImageUrl"),
    message: "Task created successfully",
  });
};

/* -------------------------------------------------------------------------- */
/*                             UPDATE TASK DETAILS                            */
/* -------------------------------------------------------------------------- */
export const updateTask: RequestHandler = async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate(
    "assignedTo",
    "name email profileImageUrl",
  );

  if (!task) {
    throw httpError[404]("Task was not found");
  }

  Object.assign(task, req.body);
  await task.save();

  res.status(200).json({
    success: true,
    data: task.toObject({ versionKey: false }),
    message: "Task updated successfully",
  });
};

/* -------------------------------------------------------------------------- */
/*                                 DELETE TASK                                */
/* -------------------------------------------------------------------------- */
export const deleteTask: RequestHandler = async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate(
    "assignedTo",
    "name email profileImageUrl",
  );

  if (!task) {
    throw httpError[404]("Task was not found");
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task.toObject({ versionKey: false }),
  });
};

/* -------------------------------------------------------------------------- */
/*                             UPDATE TASK STATUS                             */
/* -------------------------------------------------------------------------- */
export const updateTaskStatus: RequestHandler = async (req, res) => {
  const { taskId } = req.params;
  const { status, todoChecklist } = req.body;

  const isAdmin = req.user.roles.includes("admin");

  /* -------------------- optimized update code by chatgpt -------------------- */
  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      ...(isAdmin ? {} : { assignedTo: req.user._id }),
    },
    [
      {
        $set: {
          todoChecklist: {
            $cond: {
              if: { $isArray: { $literal: todoChecklist } }, // Use JS variable directly
              then: { $literal: todoChecklist },
              else: "$todoChecklist",
            },
          },
          progress: {
            $cond: {
              if: { $isArray: { $literal: todoChecklist } },
              then: {
                $cond: {
                  if: { $gt: [{ $size: { $literal: todoChecklist } }, 0] },
                  then: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $size: {
                                  $filter: {
                                    input: { $literal: todoChecklist },
                                    as: "item",
                                    cond: { $eq: ["$$item.completed", true] },
                                  },
                                },
                              },
                              { $size: { $literal: todoChecklist } },
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                  else: 0,
                },
              },
              else: "$progress",
            },
          },
        },
      },
      {
        $set: {
          status: {
            $cond: {
              if: { $isArray: { $literal: todoChecklist } },
              then: {
                $cond: [
                  { $eq: ["$progress", 100] },
                  "Completed",
                  {
                    $cond: [
                      { $gt: ["$progress", 0] },
                      "In Progress",
                      "Pending",
                    ],
                  },
                ],
              },
              else: { $ifNull: [status, "$status"] }, // Use JS variable directly
            },
          },
        },
      },
    ],
    {
      new: true,
      runValidators: true,
      updatePipeline: true,
      populate: {
        path: "assignedTo",
        select: "name email profileImageUrl",
      },
    },
  );

  if (!task) {
    throw isAdmin
      ? httpError[404]("Task was not found")
      : httpError[404]("Task was not found or access denied");
  }

  res.status(200).json({
    success: true,
    data: task.toObject({ versionKey: false }),
    message: "Task updated successfully",
  });
};

/* -------------------------------------------------------------------------- */
/*                      GET DASHBOARD DATA ( ADMIN ONLY )                     */
/* -------------------------------------------------------------------------- */
export const getDashboardData: RequestHandler = async (req, res) => {
  const now = new Date();

  // Combine counts and distributions into one trip
  const [analytics, recentTasks] = await Promise.all([
    Task.aggregate([
      {
        $facet: {
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          priorityCounts: [
            { $group: { _id: "$priority", count: { $sum: 1 } } },
          ],
          overdueCount: [
            {
              $match: {
                status: { $ne: "Completed" },
                dueDate: { $lt: now },
              },
            },
            { $count: "count" },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]),
    Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt"),
  ]);

  const raw = analytics[0];

  // Helper to map results to your style
  const getCount = (arr: any[], id: string) =>
    arr.find((i) => i._id === id)?.count || 0;

  const taskDistribution = {
    Pending: getCount(raw.statusCounts, "Pending"),
    InProgress: getCount(raw.statusCounts, "In Progress"),
    Completed: getCount(raw.statusCounts, "Completed"),
    All: raw.totalCount[0]?.count || 0,
  };

  const taskPriorityLevels = {
    Low: getCount(raw.priorityCounts, "Low"),
    Medium: getCount(raw.priorityCounts, "Medium"),
    High: getCount(raw.priorityCounts, "High"),
  };

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalTasks: taskDistribution.All,
        pendingTasks: taskDistribution.Pending,
        completedTasks: taskDistribution.Completed,
        overdueTasks: raw.overdueCount[0]?.count || 0,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                    GET DASHBOARD DATA ( USER SPECIFIC )                    */
/* -------------------------------------------------------------------------- */
export const getUserDashboardData: RequestHandler = async (req, res) => {
  const assignedTo = req.user._id;
  const now = new Date();

  const [analytics, recentTasks] = await Promise.all([
    Task.aggregate([
      { $match: { assignedTo } }, // Filter for user once at the start
      {
        $facet: {
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          priorityCounts: [
            { $group: { _id: "$priority", count: { $sum: 1 } } },
          ],
          overdueCount: [
            {
              $match: {
                status: { $ne: "Completed" },
                dueDate: { $lt: now },
              },
            },
            { $count: "count" },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]),
    Task.find({ assignedTo })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt"),
  ]);

  const raw = analytics[0]; // Aggregate returns an array
  const getCount = (arr: any[], id: string) =>
    arr.find((i) => i._id === id)?.count || 0;

  const taskDistribution = {
    Pending: getCount(raw.statusCounts, "Pending"),
    InProgress: getCount(raw.statusCounts, "In Progress"),
    Completed: getCount(raw.statusCounts, "Completed"),
    All: raw.totalCount[0]?.count || 0,
  };

  const taskPriorityLevels = {
    Low: getCount(raw.priorityCounts, "Low"),
    Medium: getCount(raw.priorityCounts, "Medium"),
    High: getCount(raw.priorityCounts, "High"),
  };

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalTasks: taskDistribution.All,
        pendingTasks: taskDistribution.Pending,
        completedTasks: taskDistribution.Completed,
        overdueTasks: raw.overdueCount[0]?.count || 0,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    },
  });
};
