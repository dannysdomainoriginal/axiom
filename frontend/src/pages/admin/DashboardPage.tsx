import DashboardLayout from "@/components/partials/DashboardLayout";
import { useAuth } from "@/hooks/api/useAuth";
import { taskService } from "@/services";
import type { TaskDashboardStats } from "@/services/task.service";
import React from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "@/components/ui/InfoCard";
import { addThousandsSeparator } from "@/utils";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "@/components/ui/TaskListTable";
import moment from "moment"
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/utilities/useDebounce";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery<TaskDashboardStats>({
    queryKey: ["auth", user?._id, "dashboard" ],
    queryFn: async () => {
      const { data } = await taskService.getDashboardData();
      return data;
    },
    enabled: !!user
  });

  const loading = useDebounce(isLoading, 2000)

  return (
    <DashboardLayout>
      <div className="card my-5">
        {/* Greeting */}
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              Good Morning, {user?.name.split(" ")[0]}!
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>

            <div className="card mt-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </>
        ) : isError ? (
          <div className="mt-6 text-red-500 text-sm">
            Failed to load dashboard data.
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.All || 0,
                )}
                color="bg-primary"
              />

              <InfoCard
                label="Pending Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Pending || 0,
                )}
                color="bg-violet-500"
              />

              <InfoCard
                label="In Progress"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.InProgress || 0,
                )}
                color="bg-cyan-500"
              />

              <InfoCard
                label="Completed Tasks"
                value={addThousandsSeparator(
                  dashboardData?.charts?.taskDistribution?.Completed || 0,
                )}
                color="bg-lime-500"
              />
            </div>

            {/* Recent Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
              <div className="md:col-span-2">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg">Recent Tasks</h5>

                    <button
                      className="card-btn"
                      onClick={() => navigate("/admin/tasks")}
                    >
                      See All <LuArrowRight className="text-base" />
                    </button>
                  </div>

                  <TaskListTable tableData={dashboardData?.recentTasks || []} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
