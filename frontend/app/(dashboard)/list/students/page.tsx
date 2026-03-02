"use client";
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch'
import { fetchStudents, Student } from '@/lib/api';
import { useRole } from '@/lib/auth';
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';



const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
const StudentListPage = () => {
  const role = useRole();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;
  const isAdmin = role === 'ADMIN' || role === 'TEACHER';

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error('Students load error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // EKLE → search + sort değişince page=1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);


  const handleSort = (key: keyof Student) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const name = (student.fullName || student.name || '').toLowerCase();  // ← SAFE!
    const email = (student.email || '').toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const sortedStudents = filteredStudents.slice().sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = String(a[sortConfig.key] || '');
    const bVal = String(b[sortConfig.key] || '');
    return sortConfig.direction === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);

  const renderRow = (item: Student) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>
      <td className='flex items-center gap-4 p-4'>
        <Image src={item.photo || "/noAvatar.png"} alt='' width={40} height={40} className='md:hidden xl:block w-10 h-10 rounded-full object-cover' />
        <div className='flex flex-col'>
          <h3 className='font-semibold'>{item.fullName || item.name || 'N/A'}</h3>
          <p className='text-xs text-gray-500'>ClassName:{item.className || item.class || 'N/A'}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>{item.studentId}</td>
      <td className='hidden md:table-cell'>{item.grade}</td>
      <td className='hidden lg:table-cell'>{item.phone}</td>
      <td className='hidden lg:table-cell'>{item.address}</td>
      <td>
        <div className="flex items-center gap-2">

          <Link href={`/list/students/${item.id}`}>
            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
              <Image src="/view.png" alt='view' width={16} height={16} />
            </button>
          </Link>

          {isAdmin && <FormModal table='student' type='delete' id={item.id} />}
        </div>
      </td>
    </tr>

  )

  if (students.length === 0) {
    return (
      <div className="bg-white p-12 rounded-md text-center flex flex-col items-center gap-6">
        <div className="text-4xl">👨‍🎓</div>
        <h1 className="text-2xl font-semibold">There are no students yet.</h1>
        <p className="text-gray-500 max-w-md">Start by adding the first student...</p>
        {isAdmin && <FormModal table="student" type="create" />}
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className='bg-white p-4 rounded-md flex-1'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Students</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch onSearch={setSearchTerm} />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src="/filter.png" alt='' width={20} height={20} />
            </button>
            <button onClick={() => handleSort('fullName')} className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src="/sort.png" alt='' width={20} height={20} />
            </button>
            {isAdmin && (<FormModal table='student' type='create' />)}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={currentStudents} />
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredStudents.length / studentsPerPage)}
        onPageChange={setCurrentPage} />

    </div>
  )
}

export default StudentListPage