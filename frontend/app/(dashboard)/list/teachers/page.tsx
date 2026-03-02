"use client";
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch'
import { role } from '@/lib/data';
import { fetchTeachers, Teacher } from '@/lib/api';
import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from "react";


const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
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
const TeacherListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTeachers();
        setTeachers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);


  // 1. Wenn es ein fehler gibt
  if (error) {
    return (
      <div className="bg-white p-8 rounded-md flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold text-red-600">Connection Error</h1>
        <p className="text-gray-500">{error}</p>
        <p className="text-sm text-gray-400">
          Is the Spring Boot backend working? (localhost:8080/api/teachers)
        </p>
      </div>
    );
  }

  if (loading || teachers.length === 0) {
    return (
      <div className="bg-white p-12 rounded-md text-center flex flex-col items-center gap-6">
        <div className="text-4xl">👨‍🏫</div>
        <h1 className="text-2xl font-semibold">There are no teachers yet.</h1>
        <p className="text-gray-500 max-w-md">
          Start by adding the first teacher. The form will automatically save the information to the backend database.
        </p>
        {role === "admin" && <FormModal table="teacher" type="create" />}
      </div>
    );
  }

  const filteredData = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => setSearchTerm(value);
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedTeachers = filteredData.slice().sort((a, b) => {
    if (!sortConfig) return 0;

    const aVal = a[sortConfig.key as keyof Teacher];
    const bVal = b[sortConfig.key as keyof Teacher];

    if (sortConfig.key === "teacherId") {
      const aNum = Number(String(aVal).replace(/\D/g, ""));
      const bNum = Number(String(bVal).replace(/\D/g, ""));
      return sortConfig.direction === "asc"
        ? aNum - bNum
        : bNum - aNum;
    }

    const aString = Array.isArray(aVal) ? aVal.join(",") : String(aVal ?? "");
    const bString = Array.isArray(bVal) ? bVal.join(",") : String(bVal ?? "");

    const result = aString.localeCompare(bString);

    return sortConfig.direction === "asc" ? result : -result;
  });

  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = sortedTeachers.slice(indexOfFirst, indexOfLast);


  const renderRow = (item: Teacher) => (
    <tr key={item.id} className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'>

      <td className='flex items-center gap-4 p-4'>
        <Image src={item.photo} alt='' width={40} height={40} className='md:hidden xl:block w-10 h-10 rounded-full object-cover' />
        <div className='flex flex-col'>
          <h3 className='font-semibold'>{item.name}</h3>
          <p className='text-xs text-gray-500'>{item?.email}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>{item.teacherId}</td>
      <td className='hidden md:table-cell'>{item.subjects.join(",")}</td>
      <td className='hidden md:table-cell'>{item.classes.join(",")}</td>
      <td className='hidden lg:table-cell'>{item.phone}</td>
      <td className='hidden lg:table-cell'>{item.address}</td>
      <td>
        <div className="flex items-center gap-2">

          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky hover:cursor-pointer">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>

          {role === "admin" && (<FormModal table='teacher' type='delete' id={item.id} />)}
        </div>
      </td>

    </tr>
  )
  return (
    <div className='bg-white p-4 rounded-md flex-1'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Teachers</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch onSearch={handleSearch} />
          <div className='flex items-center gap-4 self-end'>
            <button onClick={() => handleSort("teacherId")} className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow hover:cursor-pointer'>
              <Image src="/filter.png" alt='' width={20} height={20} />
            </button>
            <button onClick={() => handleSort("subjects")} className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow hover:cursor-pointer'>
              <Image src="/sort.png" alt='' width={20} height={20} />
            </button>
            {role === "admin" && (
              <FormModal table='teacher' type='create' />)}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={currentTeachers} />
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedTeachers.length / teachersPerPage)}
        onPageChange={setCurrentPage}
      />

    </div>
  )
}

export default TeacherListPage