"use client";

import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

export interface TeacherPerformanceStats {
  subjectsCount: number;
  classesCount: number;
  lessonsCount: number;
}

const COLORS = ["#C3EBFA", "#FAE27C", "#86cb92"];

interface PerformanceProps {
  /** On single teacher page: pass stats to show teaching load (Subjects / Classes / Lessons). */
  teacherStats?: TeacherPerformanceStats | null;
}

const Performance = ({ teacherStats }: PerformanceProps) => {
  const subjects = teacherStats?.subjectsCount ?? 0;
  const classes = teacherStats?.classesCount ?? 0;
  const lessons = teacherStats?.lessonsCount ?? 0;
  const total = subjects + classes + lessons;

  const data = [
    { name: "Subjects", value: subjects, fill: COLORS[0] },
    { name: "Classes", value: classes, fill: COLORS[1] },
    { name: "Lessons", value: lessons, fill: COLORS[2] },
  ].filter((d) => d.value > 0);

  const hasData = data.length > 0;

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Teaching load</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-bold">{total}</span>
            <p className="text-xs text-gray-400">total</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-gray-400">
          <p className="text-sm">No data to display.</p>
          <p className="text-xs mt-1">Teaching load appears here when the teacher has subjects, classes and lessons.</p>
        </div>
      )}
    </div>
  );
};

export default Performance;
