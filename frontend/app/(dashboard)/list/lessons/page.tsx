'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchLessons, type LessonListItem } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: "Subject / Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Day", accessor: "day", className: "hidden lg:table-cell" },
  { header: "Time", accessor: "time", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

const LessonListPage = () => {
  const role = useRole();
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLessons()
      .then(setLessons)
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (start?: string, end?: string) => {
    if (!start || !end) return "—";
    try {
      const s = new Date(start);
      const e = new Date(end);
      return `${s.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} – ${e.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return "—";
    }
  };

  const formatDay = (day?: string) => {
    if (!day) return "—";
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const filtered = lessons.filter(
    (l) =>
      l.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: LessonListItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subjectName || item.name}</td>
      <td>{item.className ?? "—"}</td>
      <td className="hidden md:table-cell">{item.teacherName ?? "—"}</td>
      <td className="hidden lg:table-cell">{formatDay(item.day)}</td>
      <td className="hidden lg:table-cell">{formatTime(item.startTime, item.endTime)}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "ADMIN" || role === "TEACHER") && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={20} height={20} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={20} height={20} />
            </button>
            {(role === 'ADMIN' || role === 'TEACHER') && (
              <FormModal table="lesson" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        renderRow={renderRow}
        data={filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LessonListPage;
