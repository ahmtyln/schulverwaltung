'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchExams, fetchMe, getStudentDisplayName, type ExamListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ExamRow = ExamListItem & { date: string };

const columns = [
  { header: "Subject Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

const ExamListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isStudent = role === 'STUDENT';
  const isParent = role === 'PARENT';
  const studentIds = me?.studentIds ?? [];
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    if (isStudent || isParent) fetchMe().then(setMe).catch(() => {});
  }, [isStudent, isParent]);

  useEffect(() => {
    if (isParent && studentIds.length > 0 && selectedChildId === null) setSelectedChildId(studentIds[0]);
  }, [isParent, studentIds, selectedChildId]);

  useEffect(() => {
    if (isStudent) {
      if (me?.studentId == null) {
        setLoading(false);
        setExams([]);
        return;
      }
      fetchExams({ studentId: me.studentId })
        .then((data) => setExams(data as ExamRow[]))
        .catch(() => setExams([]))
        .finally(() => setLoading(false));
      return;
    }
    if (isParent) {
      if (selectedChildId == null) {
        setLoading(false);
        setExams([]);
        return;
      }
      fetchExams({ studentId: selectedChildId })
        .then((data) => setExams(data as ExamRow[]))
        .catch(() => setExams([]))
        .finally(() => setLoading(false));
      return;
    }
    fetchExams()
      .then((data) => setExams(data as ExamRow[]))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [isStudent, isParent, me?.studentId, selectedChildId]);

  const filtered = exams.filter(
    (e) =>
      e.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: ExamRow) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.subjectName}</td>
      <td>{item.className}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === 'ADMIN' || role === 'TEACHER') && (
            <>
              <FormModal table="exam" type="update" data={item} />
              <FormModal table="exam" type="delete" id={item.id} />
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
          {isStudent ? 'My Exams' : isParent ? (selectedChildId ? `Exams (${getStudentDisplayName(me, selectedChildId)})` : 'Exams') : 'All Exams'}
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
            {(role === 'ADMIN' || role === 'TEACHER') && <FormModal table="exam" type="create" />}
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

export default ExamListPage;
