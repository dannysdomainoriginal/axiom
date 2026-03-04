import type { Task } from "@/services/task.service";
import AvatarGroup from "./AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import { motion } from "framer-motion";
import React from "react";
import moment from "moment";

interface Props {
  task: Task;
  delta: number;
}

export const TaskCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 h-full border border-gray-200/50 animate-pulse">
      {/* Status + Priority */}
      <div className="flex items-end gap-3 px-4">
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>

      {/* Main Content */}
      <div className="px-4 border-l-[3px] border-gray-200">
        <div className="h-4 w-3/4 bg-gray-200 rounded mt-4" />
        <div className="h-3 w-full bg-gray-200 rounded mt-2" />
        <div className="h-3 w-5/6 bg-gray-200 rounded mt-1" />

        <div className="h-3 w-1/2 bg-gray-200 rounded mt-3 mb-2" />

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-gray-300 h-1.5 rounded-full w-2/3" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4">
        <div className="flex items-center justify-between my-3">
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Avatar circles */}
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white"
              />
            ))}
          </div>

          {/* Attachment badge */}
          <div className="h-7 w-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, delta }: Props) => {
  const getStatusTagColor = () => {
    switch (task.status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (task.priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  const ProgressBar = () => {
    const getColor = () => {
      switch (task.status) {
        case "In Progress":
          return "bg-cyan-500 border border-cyan-500/10";
        case "Completed":
          return "bg-indigo-500 border border-indigo-500/10";
        default:
          return "bg-violet-500 border border-violet-500/10";
      }
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`${getColor()} transition-all duration-300 h-1.5 rounded-full text-center text-xs font-medium`}
          style={{ width: `${task.progress}%` }}
        />
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 h-full border border-gray-200/50 cursor-pointer"
      initial={{ opacity: 0, y: 20 }} // start slightly below
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: delta * 0.2 }}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {task.status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {task.priority} Priority
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] ${
          task.status === "In Progress"
            ? "border-cyan-500"
            : task.status === "Completed"
              ? "border-indigo-500"
              : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {task.title}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-4.5">
          {task.description}
        </p>
        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-4.5">
          Task Done{" "}
          <span className="font-semibold text-gray-700">
            {task.todoChecklist.filter((i) => i.completed).length} /{" "}
            {task.todoChecklist.length}
          </span>
        </p>

        <ProgressBar />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Created At</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(task.createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(task.dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup
            avatars={task.assignedTo.map((u) => u.profileImageUrl)}
            maxVisible={5}
          />

          {task.attachments.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />
              <span className="text-xs text-gray-900">
                {task.attachments.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
