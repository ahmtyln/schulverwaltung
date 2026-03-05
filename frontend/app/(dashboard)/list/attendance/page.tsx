'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchAttendances, fetchMe, getStudentDisplayName, type AttendanceListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: 'Student', accessor: 'student' },
  { header: 'Lesson', accessor: 'lesson' },
  { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
  { header: 'Present', accessor: 'present' },
];

const ITEMS_PER_PAGE = 10;

type SortOrder = 'asc' | 'desc' | null;

const AttendanceListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [items, setItems] = useState<AttendanceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const studentIds = me?.studentIds ?? [];
  const isParent = role === 'PARENT';
  const isStudent = role === 'STUDENT';
  const isTeacher = role === 'TEACHER';
  const canCreateAttendance = role === 'ADMIN' || role === 'TEACHER';

  useEffect(() => {
    if (isParent || isStudent || isTeacher) fetchMe().then(setMe).catch(() => {});
  }, [isParent, isStudent, isTeacher]);

  useEffect(() => {
    if (isParent && studentIds.length > 0 && selectedChildId === null) setSelectedChildId(studentIds[0]);
  }, [isParent, studentIds, selectedChildId]);

  useEffect(() => {
    if (isStudent) {
      if (me?.studentId == null) {
        setLoading(false);
        setItems([]);
        return;
      }
      fetchAttendances({ studentId: me.studentId }).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
      return;
    }
    if (isParent) {
      if (selectedChildId != null) {
        fetchAttendances({ studentId: selectedChildId }).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
      return;
    }
    if (isTeacher) {
      if (me?.teacherId == null) {
        setLoading(false);
        setItems([]);
        return;
      }
      fetchAttendances({ teacherId: me.teacherId }).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
      return;
    }
    fetchAttendances().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, [isParent, isStudent, isTeacher, selectedChildId, me?.studentId, me?.teacherId]);

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString();
    } catch {
      return d;
    }
  };

  const filtered = items.filter(
    (a) =>
      a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.lessonName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    // Önce öğrenci adına, eşitse derse göre sırala
    const aKey = `${a.studentName ?? ''} ${a.lessonName ?? ''}`.toLowerCase();
    const bKey = `${b.studentName ?? ''} ${b.lessonName ?? ''}`.toLowerCase();
    const cmp = aKey.localeCompare(bKey);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setCurrentPage(1);
  };

  const renderRow = (item: AttendanceListItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.studentName || '—'}</td>
      <td>{item.lessonName || '—'}</td>
      <td className="hidden md:table-cell">{formatDate(item.date)}</td>
      <td>{item.present ? 'Yes' : 'No'}</td>
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
      {isParent && studentIds.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {studentIds.map((id) => (
            <button
              key={id}
              onClick={() => setSelectedChildId(id)}
              className={`px-3 py-1 rounded-md text-sm ${selectedChildId === id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              {getStudentDisplayName(me, id)}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {isStudent
            ? 'My Attendance'
            : isParent
            ? (selectedChildId ? `Attendance (${getStudentDisplayName(me, selectedChildId)})` : 'Attendance')
            : isTeacher
            ? 'My Attendance'
            : 'Attendance'}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? 'ring-2 ring-blue-400' : ''}`}
              title={
                sortOrder === null
                  ? 'Sort by student/lesson'
                  : sortOrder === 'asc'
                  ? 'A→Z (click for Z→A)'
                  : 'Z→A (click to clear)'
              }
            >
              <Image src="/sort.png" alt="" width={20} height={20} />
            </button>
            {canCreateAttendance && (
              <FormModal table="attendance" type="create" />
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

export default AttendanceListPage;
