'use client';

import Image from 'next/image';

const schoolYear = () => {
  const d = new Date();
  const y = d.getFullYear();
  const next = y + 1;
  return `${y}/${String(next).slice(-2)}`;
};

const UserCard = ({ type, count = 0 }: { type: string; count?: number }) => {
  return (
    <div className="rounded-2xl odd:bg-purple even:bg-yellow p-4 flex-1 min-w-32.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {schoolYear()}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-600">{type}</h2>
    </div>
  );
};

export default UserCard;
