import type { Task } from "@/services/task.service";
import type { UserWithTaskCounts } from "@/services/user.service";
import { motion } from "framer-motion";

interface Props {
  user: UserWithTaskCounts;
  delta: number;
}

const UserCard = ({ user, delta }: Props) => {
  return (
    <motion.div
      className="user-card p-2"
      initial={{ opacity: 0, y: 20 }} // start slightly below
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: delta * 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.profileImageUrl}
            alt="Avatar"
            className="w-12 h-1/2 rounded-full border-2 border-white"
          />

          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={user.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={user.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={user.completedTasks || 0}
          status="Completed"
        />
      </div>
    </motion.div>
  );
};

export default UserCard;

interface StatCardProps {
  label: Task["status"];
  count: number;
  status: Task["status"];
}

const StatCard = ({ label, count, status }: StatCardProps) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";

      case "Completed":
        return "text-indigo-500 bg-gray-50";

      case "Pending":
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> {label}
    </div>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div className="user-card p-2 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200" />

          {/* Name + Email */}
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-end gap-3 mt-5">
        <div className="flex-1 h-8 bg-gray-200 rounded" />
        <div className="flex-1 h-8 bg-gray-200 rounded" />
        <div className="flex-1 h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
