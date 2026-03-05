'use client';

import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { fetchAssignments, fetchMe, getStudentDisplayName, type AssignmentListItem, type MeDto } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const columns = [
  { header: "Subject Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

type SortOrder = "asc" | "desc" | null;

const AssignmentListPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const studentIds = me?.studentIds ?? [];
  const isParent = role === "PARENT";
  const isStudent = role === "STUDENT";
  const isTeacher = role === "TEACHER";

  useEffect(() => {
    if (isParent || isStudent || isTeacher) fetchMe().then(setMe).catch(() => {});
  }, [isParent, isStudent, isTeacher]);

  const stableStudentIds = me?.studentIds;
  useEffect(() => {
    if (isParent && Array.isArray(stableStudentIds) && stableStudentIds.length > 0 && selectedChildId === null) {
      setSelectedChildId(stableStudentIds[0]);
    }
  }, [isParent, selectedChildId, stableStudentIds]);

  useEffect(() => {
    if (isStudent) {
      if (me?.studentId == null) {
        setLoading(false);
        setAssignments([]);
        return;
      }
      fetchAssignments({ studentId: me.studentId }).then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
      return;
    }
    if (isTeacher) {
      if (me?.teacherId == null) {
        setLoading(false);
        setAssignments([]);
        return;
      }
      fetchAssignments({ teacherId: me.teacherId }).then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
      return;
    }
    if (isParent) {
      const ids = me?.studentIds;
      const childId = selectedChildId ?? (Array.isArray(ids) && ids.length > 0 ? ids[0] : null);
      if (childId != null) {
        fetchAssignments({ studentId: childId }).then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
      } else {
        setAssignments([]);
        setLoading(false);
      }
      return;
    }
    fetchAssignments().then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
  }, [isParent, isStudent, isTeacher, selectedChildId, me]);

  const filtered = assignments.filter(
    (a) =>
      a.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === null) return 0;
    const aKey = (a.subjectName || a.className || a.title || "").toLowerCase();
    const bKey = (b.subjectName || b.className || b.title || "").toLowerCase();
    const cmp = aKey.localeCompare(bKey);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
    setCurrentPage(1);
  };

  const renderRow = (item: AssignmentListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.subjectName}</td>
      <td>{item.className}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">
        {item.endTime ? item.endTime.toString().slice(0, 10) : ""}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === 'ADMIN' || role === 'TEACHER') && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
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
          {isStudent ? "My Assignments" : isTeacher ? "My Assignments" : isParent ? (selectedChildId ? `Assignments (${getStudentDisplayName(me, selectedChildId)})` : "Assignments") : "All Assignments"}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              onClick={toggleSort}
              className={`w-8 h-8 flex items-center justify-center rounded-full bg-yellow ${sortOrder ? "ring-2 ring-blue-400" : ""}`}
              title={
                sortOrder === null
                  ? "Sort by subject"
                  : sortOrder === "asc"
                  ? "A→Z (click for Z→A)"
                  : "Z→A (click to clear)"
              }
            >
              <Image src="/sort.png" alt="Sort" width={20} height={20} />
            </button>
            {(role === 'ADMIN' || role === 'TEACHER') && (
              <FormModal table="assignment" type="create" />
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

export default AssignmentListPage;
