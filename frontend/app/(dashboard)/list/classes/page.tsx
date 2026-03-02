'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchClasses, type ClassListItem } from '@/lib/api';
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

const ClassListPage = () => {
  const role = useRole();
  const [items, setItems] = useState<ClassListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchClasses()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (c) =>
      (c.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.supervisorName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: ClassListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity ?? '—'}</td>
      <td className="hidden md:table-cell">{item.gradeLevel ?? '—'}</td>
      <td className="hidden md:table-cell">{item.supervisorName ?? '—'}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === 'ADMIN' || role === 'TEACHER') && (
            <>
              <FormModal table="class" type="update" data={item} />
              <FormModal table="class" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
              <FormModal table="class" type="create" />
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

export default ClassListPage;
