import DashboardLayout from "@/components/partials/DashboardLayout";
import TabStatusTabs from "@/components/ui/TabStatusTabs";
import TaskCard, { TaskCardSkeleton } from "@/components/ui/TaskCard";
import { useTasks } from "@/hooks/api/useTasks";
import { toast } from "@/libraries/sweetalert2";
import { reportService, type taskService } from "@/services";
import React, { useMemo, useState } from "react";
import { LuFileSpreadsheet } from "react-icons/lu";
import { Link } from "react-router-dom";

const ManageTasksPage = () => {
  const [filter, setFilter] = useState<taskService.Task["status"] | "All">(
    "All",
  );

  const { data, isLoading, isError } = useTasks("get-tasks");

  const [allTasks, tabs] = useMemo(() => {
    if (!data) return [[], []];

    return [
      filter === "All"
        ? data?.tasks
        : data?.tasks.filter((task) => task.status === filter),
      [
        { label: "All", count: data.statusSummary.all },
        { label: "Pending", count: data.statusSummary.pendingTasks },
        { label: "In Progress", count: data.statusSummary.inProgressTasks },
        { label: "Completed", count: data.statusSummary.completedTasks },
      ] as { label: typeof filter; count: number }[],
    ];
  }, [data, filter]);

  const handleDownlodReport = async () => {
    try {
      await reportService.downloadTasksReport();
      toast.success("Your download has started");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="my-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center justify-between gap-3 w-full">
            <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>

            <button
              className="sm:flex hidden download-btn"
              onClick={handleDownlodReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {isLoading ? null : isError ? null : (
            <>
              {tabs[0].count > 0 && (
                <div className="flex items-center gap-3">
                  <TabStatusTabs
                    tabs={tabs}
                    activeTab={filter}
                    setActiveTab={setFilter}
                  />
                  <button
                    className="hidden md:flex download-btn"
                    onClick={handleDownlodReport}
                  >
                    <LuFileSpreadsheet className="text-lg" />
                    Download Report
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {isLoading ? (
            [1, 2, 3].map((_, idx) => <TaskCardSkeleton key={idx} />)
          ) : isError ? (
            <p className="mt-6 text-red-500 text-sm col-span-full">
              Failed to load your tasks.
            </p>
          ) : (
            allTasks.map((task, idx) => (
              <Link key={idx} to={`/tasks/${task._id}`}>
                <TaskCard task={task} delta={idx} />
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasksPage;
