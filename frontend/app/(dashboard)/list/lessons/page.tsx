'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchLessons, fetchMe, type LessonListItem, type MeDto } from '@/lib/api';
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

type SortOrder = 'asc' | 'desc' | null;

const LessonListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isTeacher = role === 'TEACHER';
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  useEffect(() => {
    if (isTeacher) fetchMe().then(setMe).catch(() => {});
  }, [isTeacher]);

  useEffect(() => {
    if (isTeacher && me == null) return;
    const params = isTeacher && me?.teacherId != null ? { teacherId: me.teacherId } : undefined;
    fetchLessons(params)
      .then(setLessons)
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, [isTeacher, me?.teacherId]);

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

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    const aKey = `${a.subjectName || a.name || ''} ${a.className || ''}`.toLowerCase();
    const bKey = `${b.subjectName || b.name || ''} ${b.className || ''}`.toLowerCase();
    const cmp = aKey.localeCompare(bKey);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder(prev => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setCurrentPage(1);
  };

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
          {role === "ADMIN" && (
              <FormModal table="lesson" type="delete" id={item.id} />
            )}
            {(role === "ADMIN" || role === "TEACHER") && (
              <FormModal table="lesson" type="update" data={item} />
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
        <h1 className="hidden md:block text-lg font-semibold">{isTeacher ? 'My Lessons' : 'All Lessons'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? 'ring-2 ring-blue-400' : ''}`}
              title={
                sortOrder === null
                  ? 'Sort by subject/class'
                  : sortOrder === 'asc'
                  ? 'A→Z (click for Z→A)'
                  : 'Z→A (click to clear)'
              }
            >
              <Image src="/sort.png" alt="Sort" width={20} height={20} />
            </button>
            {role === 'ADMIN' && (
              <FormModal table="lesson" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        renderRow={renderRow}
        data={sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE))}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LessonListPage;
