import { deleteFile } from "@/libraries/cloudflare";
import Task from "@/models/Task";
import User from "@/models/User";
import { RequestHandler } from "express";
import httpError from "http-errors";

/* -------------------------------------------------------------------------- */
/*                                  GET USERS                                 */
/* -------------------------------------------------------------------------- */
export const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find({ roles: { $nin: ["admin"] } })
    .select("-password")
    .lean({ versionKey: false });

  const usersWithTaskCounts = await Promise.all(
    users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Pending",
      });
      const inProgressTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "In Progress",
      });
      const completedTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      });

      return {
        ...user,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      };
    }),
  );

  res.status(200).json({
    success: true,
    data: usersWithTaskCounts,
  });
};

/* -------------------------------------------------------------------------- */
/*                               GET USER BY ID                               */
/* -------------------------------------------------------------------------- */
export const getUserById: RequestHandler = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw httpError[404]("User was not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

/* -------------------------------------------------------------------------- */
/*                                 DELETE USER                                */
/* -------------------------------------------------------------------------- */
export const deleteUser: RequestHandler = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw httpError[404]("User was not found");
  }

  const key = user.profileImageUrl.split(`${process.env.R2_PUBLIC_URL}/`)[1];
  
  const success = await deleteFile(key)
  if (!success) {
    throw httpError[500]("Internet connection required to delete this user")
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: `User: ${user.name} was successfully deleted`
  })
};
