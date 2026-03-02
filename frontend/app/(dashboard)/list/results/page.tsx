'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchResults, fetchMe, getStudentDisplayName, type ResultListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: "Subject Name", accessor: "name" },
  { header: "Student", accessor: "student" },
  { header: "Score", accessor: "score", className: "hidden md:table-cell" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

const ResultListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [results, setResults] = useState<ResultListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const studentIds = me?.studentIds ?? [];
  const isParent = role === 'PARENT';
  const isStudent = role === 'STUDENT';

  useEffect(() => {
    if (isParent || isStudent) {
      fetchMe().then(setMe).catch(() => {});
    }
  }, [isParent, isStudent]);

  useEffect(() => {
    if (isParent && studentIds.length > 0 && selectedChildId === null) {
      setSelectedChildId(studentIds[0]);
    }
  }, [isParent, studentIds, selectedChildId]);

  useEffect(() => {
    if (isStudent) {
      if (me?.studentId == null) {
        setLoading(false);
        setResults([]);
        return;
      }
      fetchResults({ studentId: me.studentId })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
      return;
    }
    if (isParent && selectedChildId == null) {
      setLoading(false);
      return;
    }
    const params = isParent && selectedChildId != null ? { studentId: selectedChildId } : undefined;
    fetchResults(params)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [isParent, isStudent, selectedChildId, me?.studentId]);

  const filtered = results.filter(
    (r) =>
      r.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: ResultListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.subjectName}</td>
      <td>{item.studentName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">{item.date || ""}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === 'ADMIN' || role === 'TEACHER') && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
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
          {isStudent ? 'My Results' : isParent ? (selectedChildId ? `Results (${getStudentDisplayName(me, selectedChildId)})` : 'Results') : 'All Results'}
        </h1>
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
              <FormModal table="result" type="create" />
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

export default ResultListPage;
