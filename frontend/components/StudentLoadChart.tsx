"use client";

import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

export interface StudentLoadStats {
  assignmentsCount: number;
  examsCount: number;
  resultsCount: number;
  attendancePercent: number | null;
}

const COLORS = ["#C3EBFA", "#FAE27C", "#86cb92"];

interface StudentLoadChartProps {
  stats: StudentLoadStats | null;
}

const StudentLoadChart = ({ stats }: StudentLoadChartProps) => {
  const assignments = stats?.assignmentsCount ?? 0;
  const exams = stats?.examsCount ?? 0;
  const results = stats?.resultsCount ?? 0;

  const data = [
    { name: "Assignments", value: assignments, fill: COLORS[0] },
    { name: "Exams", value: exams, fill: COLORS[1] },
    { name: "Results", value: results, fill: COLORS[2] },
  ].filter((d) => d.value > 0);

  const total = assignments + exams + results;
  const hasData = data.length > 0;
  const attendance = stats?.attendancePercent;

  return (
    <div className="bg-white p-4 rounded-md h-100 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Student load</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height="75%">
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={data[index].fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value ?? 0, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-bold">{total}</span>
            <p className="text-xs text-gray-400">total</p>
          </div>
          {attendance != null && (
            <div className="text-center pt-2">
              <span className="text-sm font-medium text-gray-600">Attendance </span>
              <span className="text-sm font-bold">{attendance}%</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-gray-400">
          <p className="text-sm">No data to display.</p>
          <p className="text-xs mt-1">Assignments, exams and results will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default StudentLoadChart;
