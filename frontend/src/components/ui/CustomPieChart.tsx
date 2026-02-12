import type { Task } from '@/services/task.service';
import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

interface CustomPieChartProps {
  data: { status: Task["status"]; count: number }[]
}

const CustomPieChart = ({ data }: CustomPieChartProps) => {
  const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]
  
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                  <p className="text-xs font-semibold text-purple-800 mb-1">
                    {payload[0].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Count:{" "}
                    <span className="text-sm font-medium text-gray-900">
                      {payload[0].value}
                    </span>
                  </p>
                </div>
              );
            }

            return null;
          }}
        />
        <Legend content={({ payload }) => {
          if (payload) {
            return (
              <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
                {payload.map((entry, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs text-gray-700 font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          }
        }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart