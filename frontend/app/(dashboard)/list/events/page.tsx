'use client';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch'
import { fetchEvents, fetchMe, getStudentDisplayName, type EventListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: 'Title', accessor: 'title' },
  { header: 'Class', accessor: 'class' },
  { header: 'Date', accessor: 'date', className: 'hidden md:table-cell' },
  { header: 'Price', accessor: 'price', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'action' },
];

const ITEMS_PER_PAGE = 10;

type SortOrder = 'asc' | 'desc' | null;

const EventListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const isStudent = role === 'STUDENT';
  const isParent = role === 'PARENT';
  const isTeacher = role === 'TEACHER';
  const studentIds = me?.studentIds ?? [];
  const stableStudentIds = me?.studentIds;
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    if (isStudent || isParent || isTeacher) fetchMe().then(setMe).catch(() => {});
  }, [isStudent, isParent, isTeacher]);

  useEffect(() => {
    if (isParent && Array.isArray(stableStudentIds) && stableStudentIds.length > 0 && selectedChildId === null) setSelectedChildId(stableStudentIds[0]);
  }, [isParent, selectedChildId, stableStudentIds]);

  useEffect(() => {
    if (isStudent) {
      if (me?.studentId == null && me?.classId == null) {
        setLoading(false);
        setEvents([]);
        return;
      }
      const params = me?.classId != null ? { classId: me.classId } : { studentId: me!.studentId };
      fetchEvents(params)
        .then(setEvents)
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
      return;
    }
    if (isParent) {
      if (selectedChildId == null) {
        setLoading(false);
        setEvents([]);
        return;
      }
      const summary = me?.studentSummaries?.find((s) => s.id === selectedChildId);
      const params = summary?.classId != null ? { classId: summary.classId } : { studentId: selectedChildId };
      fetchEvents(params)
        .then(setEvents)
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
      return;
    }
    if (isTeacher && me?.teacherId != null) {
      fetchEvents({ teacherId: me.teacherId })
        .then(setEvents)
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
      return;
    }
    if (isTeacher) {
      if (me != null && me.teacherId == null) {
        setLoading(false);
        setEvents([]);
      } else if (me?.teacherId != null) {
        // already handled above
      }
      return;
    }
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [isStudent, isParent, isTeacher, me?.studentId, me?.classId, me?.teacherId, me?.studentSummaries, selectedChildId]);

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return d;
    }
  };

  const filtered = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    const aKey = (a.title || a.className || '').toLowerCase();
    const bKey = (b.title || b.className || '').toLowerCase();
    const cmp = aKey.localeCompare(bKey);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setCurrentPage(1);
  };

  const renderRow = (item: EventListItem) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <span className="font-medium">{item.title}</span>
      </td>
      <td>{item.className || '—'}</td>
      <td className="hidden md:table-cell">{formatDate(item.date)}</td>
      <td className="hidden md:table-cell">
        {item.price != null ? `€${item.price.toFixed(2)}` : '—'}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {isParent && (
            <button
              type="button"
              className="px-3 py-1 rounded-full text-xs bg-purple text-white hover:cursor-pointer"
            >
              Pay
            </button>
          )}
          {(role === 'ADMIN' || role === 'TEACHER') && (
            <>
              <FormModal table="event" type="update" data={item} />
              <FormModal table="event" type="delete" id={item.id} />
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
    <div className='bg-white p-4 rounded-md flex-1'>
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
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          {isStudent ? 'My Events' : isParent ? (selectedChildId ? `Events (${getStudentDisplayName(me, selectedChildId)})` : 'Events') : 'All Events'}
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch onSearch={setSearchTerm} />
          <div className='flex items-center gap-4 self-end'>
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? 'ring-2 ring-blue-400' : ''}`}
              title={sortOrder === null ? 'Sort by title' : sortOrder === 'asc' ? 'A→Z (click for Z→A)' : 'Z→A (click to clear)'}
            >
              <Image src="/sort.png" alt="Sort" width={20} height={20} />
            </button>
            {(role === 'ADMIN' || role === 'TEACHER') && <FormModal table="event" type="create" />}
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
  )
}

export default EventListPage