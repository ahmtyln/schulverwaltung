'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchParents, fetchMe, type ParentListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: 'Info', accessor: 'info' },
  { header: 'Student Names', accessor: 'students', className: 'hidden md:table-cell' },
  { header: 'Phone', accessor: 'phone', className: 'hidden lg:table-cell' },
  { header: 'Address', accessor: 'address', className: 'hidden lg:table-cell' },
  { header: 'Actions', accessor: 'action' },
];

const ITEMS_PER_PAGE = 8;

type SortOrder = 'asc' | 'desc' | null;

const ParentListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [items, setItems] = useState<ParentListItem[]>([]);
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
    fetchParents(params)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isTeacher, me?.teacherId]);

  const fullName = (item: ParentListItem) => [item.name, item.surname].filter(Boolean).join(' ').trim() || '—';
  const studentNames = (item: ParentListItem) => (item.studentNames || []).join(', ') || '—';

  const filtered = items.filter(
    (p) =>
      fullName(p).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentNames(p).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    const nameA = fullName(a).toLowerCase();
    const nameB = fullName(b).toLowerCase();
    const cmp = nameA.localeCompare(nameB);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setCurrentPage(1);
  };

  const renderRow = (item: ParentListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">
         <Image src={"/noAvatar.png"} alt='' width={40} height={40} className='md:hidden xl:block w-10 h-10 rounded-full object-cover' />
        <div className="flex flex-col">
          <h3 className="font-semibold">{fullName(item)}</h3>
          <p className="text-xs text-gray-500">{item.email ?? ''}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{studentNames(item)}</td>
      <td className="hidden lg:table-cell">{item.phone ?? '—'}</td>
      <td className="hidden lg:table-cell">{item.address ?? '—'}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === 'ADMIN' && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">{isTeacher ? "My Students' Parents" : 'All Parents'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? 'ring-2 ring-blue-400' : ''}`}
              title={sortOrder === null ? 'Sort by name' : sortOrder === 'asc' ? 'A→Z (click for Z→A)' : 'Z→A (click to clear)'}
            >
              <Image src="/sort.png" alt="Sort" width={20} height={20} />
            </button>
            {role === 'ADMIN' && (
              <FormModal table="parent" type="create" />
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

export default ParentListPage;
