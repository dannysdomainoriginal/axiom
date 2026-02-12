import DashboardLayout from "@/components/partials/DashboardLayout";
import { useAuth } from "@/hooks/api/useAuth";
import { taskService } from "@/services";
import type { Task, TaskDashboardStats } from "@/services/task.service";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "@/components/ui/InfoCard";
import { addThousandsSeparator } from "@/utils";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "@/components/ui/TaskListTable";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/utilities/useDebounce";
import CustomPieChart from "@/components/ui/CustomPieChart";
import CustomBarChart from "@/components/ui/CustomBarChart";
import { useTasks } from "@/hooks/api/useTasks";

type StatusDistribution = { status: Task["status"]; count: number }[];
type PriorityDistribution = { priority: Task["priority"]; count: number }[];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useTasks("dashboard");

  const loading = useDebounce(isLoading, 2000);

  const pieChartData: StatusDistribution = dashboardData
    ? [
        {
          status: "Pending",
          count: dashboardData.charts.taskDistribution?.Pending || 0,
        },
        {
          status: "In Progress",
          count: dashboardData.charts.taskDistribution?.InProgress || 0,
        },
        {
          status: "Completed",
          count: dashboardData.charts.taskDistribution?.Completed || 0,
        },
      ]
    : [];

  const barChartData: PriorityDistribution = dashboardData
    ? [
        {
          priority: "Low",
          count: dashboardData.charts.taskPriorityLevels?.Low || 0,
        },
        {
          priority: "Medium",
          count: dashboardData.charts.taskPriorityLevels?.Medium || 0,
        },
        {
          priority: "High",
          count: dashboardData.charts.taskPriorityLevels?.High || 0,
        },
      ]
    : [];


  return (
    <DashboardLayout>
      <div className="card-wrapper my-5">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
              {/* Pie Chart */}
              <div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Task Distribution</h5>
                  </div>

                  <CustomPieChart data={pieChartData} />
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Priority Distribution</h5>
                  </div>

                  <CustomBarChart data={barChartData} />
                </div>
              </div>

              {/* Recent Tasks */}
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
