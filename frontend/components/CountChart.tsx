'use client';

import Image from 'next/image';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts';

interface CountChartProps {
  total?: number;
  boys?: number;
  girls?: number;
}

const CountChart = ({ total = 0, boys = 0, girls = 0 }: CountChartProps) => {
  const totalCount = total || boys + girls || 1;
  const boysPct = totalCount ? Math.round((boys / totalCount) * 100) : 0;
  const girlsPct = totalCount ? Math.round((girls / totalCount) * 100) : 0;

  const data = [
    { name: 'Total', count: 100, fill: 'white' },
    { name: 'Girls', count: totalCount ? (girls / totalCount) * 100 : 0, fill: '#FAE27C' },
    { name: 'Boys', count: totalCount ? (boys / totalCount) * 100 : 0, fill: '#C3EBFA' },
  ].filter((d) => d.count > 0);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data.length ? data : [{ name: 'Total', count: 100, fill: '#e5e7eb' }]}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-sky rounded-full" />
          <h1 className="font-bold">{boys.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-400">Boys ({boysPct}%)</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-yellow rounded-full" />
          <h1 className="font-bold">{girls.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-400">Girls ({girlsPct}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
