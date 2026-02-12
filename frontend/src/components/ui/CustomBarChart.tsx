import type { Task } from "@/services/task.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

interface CustomBarChartProps {
  data: { priority: Task["priority"]; count: number }[];
}

const CustomBarChart = ({ data }: CustomBarChartProps) => {
  const COLORS: Record<Task["priority"], string> = {
    Low: "#22C55E",
    Medium: "#F59E0B",
    High: "#EF4444",
  };

  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          {/* Subtle horizontal grid only */}
          <CartesianGrid
            vertical={false}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="priority"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 13,
              fill: "#64748B",
              fontWeight: 500,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#94A3B8",
            }}
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { priority, count } = payload[0].payload;

                return (
                  <div className="bg-white shadow-xl border border-gray-200 rounded-xl px-4 py-2">
                    <p className="text-xs text-gray-500 mb-1">
                      {priority} Priority
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {count}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar
            dataKey="count"
            radius={[14, 14, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={entry.priority} fill={COLORS[entry.priority]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Custom Legend (Category-Based) */}
      <div className="flex justify-center gap-6 mt-4">
        {data.map((item) => (
          <div key={item.priority} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[item.priority] }}
            />
            <span className="text-xs font-medium text-gray-700">
              {item.priority}
            </span>
            <span className="text-xs text-gray-400">
              ({total === 0 ? 0 : Math.round((item.count / total) * 100)}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomBarChart;
