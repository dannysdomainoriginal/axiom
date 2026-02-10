import Task from "@/models/Task";
import User from "@/models/User";
import ExcelJS from "exceljs";
import { logger } from "@/libraries/logger";
import { RequestHandler } from "express";

/* -------------------------------------------------------------------------- */
/*                             EXPORT TASKS REPORT                            */
/* -------------------------------------------------------------------------- */
export const exportTasksReport: RequestHandler = async (req, res) => {
  try {
    const tasks = await Task.find()
      .select("_id title description priority status dueDate assignedTo")
      .populate("assignedTo", "name email")
      .lean({ versionKey: false });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    // 2. Strong column definitions with Native Excel Formatting
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      {
        header: "Due Date",
        key: "dueDate",
        width: 20,
        style: { numFmt: "yyyy-mm-dd" },
      },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    // 3. Robust row mapping
    tasks.forEach((task) => {
      const assignedTo = task.assignedTo?.length
        ? task.assignedTo.map((u: any) => `${u.name} (${u.email})`).join(", ")
        : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title || "Untitled",
        description: task.description || "",
        priority: task.priority || "Normal",
        status: task.status || "Pending",
        dueDate: task.dueDate ? new Date(task.dueDate) : null, // Pass as Date object
        assignedTo: assignedTo,
      });
    });

    // 4. Clean response delivery
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Axiom_Tasks_Report.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    logger.error("Export Error:", error);

    // Don't send status 500 if the download has already started
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Encountered an error generating your task report",
      });
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                             EXPORT USERS REPORT                            */
/* -------------------------------------------------------------------------- */
export const exportUsersReport: RequestHandler = async (req, res) => {
  try {
    const [users, userTasks] = await Promise.all([
      User.find().select("name email _id").lean({ versionKey: false }),
      Task.find({ assignedTo: { $exists: true, $not: { $size: 0 } } })
        .select("status assignedTo")
        .lean({ versionKey: false }),
    ]);

    type Item = {
      name: string;
      email: string;
      taskCount: number;
      pendingTasks: number;
      inProgressTasks: number;
      completedTasks: number;
    };

    const userTaskMap = new Map<string, Item>();
    users.forEach((user) => {
      const userId = user._id.toString();

      userTaskMap.set(userId, {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      });
    });

    userTasks.forEach((task) => {
      if (!task.assignedTo) return;

      task.assignedTo.forEach((assignedUser) => {
        const userId = assignedUser.toString();
        const item = userTaskMap.get(userId);

        if (item) {
          item.taskCount++;

          if (task.status === "Pending") item.pendingTasks++;
          else if (task.status === "In Progress") item.inProgressTasks++;
          else if (task.status === "Completed") item.completedTasks++;
        }
      });
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report Sheet");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    userTaskMap.forEach((user, key) => {
      worksheet.addRow(user);
    });

    // Set contentType
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Axiom_Users_Report.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    logger.error("Export Error:", error);

    // Don't send status 500 if the download has already started
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Encountered an error generating your users report",
      });
    }
  }
};
