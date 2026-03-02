'use client';

import Link from 'next/link';

export interface AnnouncementItem {
  id: number;
  title: string;
  className?: string;
  date: string;
  description?: string;
}

interface AnnouncementProps {
  items?: AnnouncementItem[];
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { dateStyle: 'short' });
  } catch {
    return dateStr;
  }
};

const bgClasses = ['bg-skyLight', 'bg-purpleLight', 'bg-yellowLight'];

const Announcement = ({ items = [] }: AnnouncementProps) => {
  const display = items.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Announcements</h1>
        <Link href="/list/announcements" className="text-xs text-gray-400 hover:underline">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {display.length === 0 ? (
          <p className="text-sm text-gray-400">No announcements</p>
        ) : (
          display.map((item, i) => (
            <div
              key={item.id}
              className={`${bgClasses[i % bgClasses.length]} rounded-md p-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{item.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {formatDate(item.date)}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement;
