'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchClasses, fetchMe, type ClassListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: 'Class Name', accessor: 'name' },
  { header: 'Capacity', accessor: 'capacity', className: 'hidden md:table-cell' },
  { header: 'Grade', accessor: 'grade', className: 'hidden md:table-cell' },
  { header: 'Supervisor', accessor: 'supervisor', className: 'hidden md:table-cell' },
  { header: 'Actions', accessor: 'action' },
];

const ITEMS_PER_PAGE = 10;

type SortOrder = 'asc' | 'desc' | null;

const ClassListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [items, setItems] = useState<ClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const isTeacher = role === 'TEACHER';

  useEffect(() => {
    if (isTeacher) fetchMe().then(setMe).catch(() => {});
  }, [isTeacher]);

  useEffect(() => {
    if (isTeacher && me == null) return;
    const params = isTeacher && me?.teacherId != null ? { teacherId: me.teacherId } : undefined;
    fetchClasses(params)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isTeacher, me?.teacherId]);

  const filtered = items.filter(
    (c) =>
      (c.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.supervisorName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    const nameA = (a.name ?? '').toLowerCase();
    const nameB = (b.name ?? '').toLowerCase();
    const cmp = nameA.localeCompare(nameB);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setCurrentPage(1);
  };

  const renderRow = (item: ClassListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity ?? '—'}</td>
      <td className="hidden md:table-cell">{item.gradeLevel ?? '—'}</td>
      <td className="hidden md:table-cell">{item.supervisorName ?? '—'}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === 'ADMIN' && (
            <>
              <FormModal table="class" type="update" data={item} />
              <FormModal table="class" type="delete" id={item.id ?? item.classId} />
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
        <h1 className="hidden md:block text-lg font-semibold">{isTeacher ? 'My Classes' : 'All Classes'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? 'ring-2 ring-blue-400' : ''}`}
              title={sortOrder === null ? 'Sort by name' : sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
            >
              <Image src="/sort.png" alt="Sort" width={20} height={20} />
            </button>
            {role === 'ADMIN' && (
              <FormModal table="class" type="create" />
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

export default ClassListPage;
