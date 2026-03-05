"use client";

import { deleteAssignment, deleteExam, deleteResult, deleteStudent, deleteTeacher, deleteParent, deleteSubject, deleteClass, deleteEvent, deleteAnnouncement, deleteLesson } from "@/lib/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useState } from "react";

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any, setOpen?: Dispatch<SetStateAction<boolean>>) => JSX.Element;
} = {
  teacher: (type, data, setOpen) => <TeacherForm type={type} data={data} setOpen={setOpen} />,
  student: (type, data, setOpen) => <StudentForm type={type} data={data} setOpen={setOpen} />,
  exam: (type, data, setOpen) => <ExamForm type={type} data={data} setOpen={setOpen} />,
  assignment: (type, data, setOpen) => <AssignmentForm type={type} data={data} setOpen={setOpen} />,
  result: (type, data, setOpen) => <ResultForm type={type} data={data} setOpen={setOpen} />,
  parent: (type, data, setOpen) => <ParentForm type={type} data={data} setOpen={setOpen} />,
  event: (type, data, setOpen) => <EventForm type={type} data={data} setOpen={setOpen} />,
  announcement: (type, data, setOpen) => <AnnouncementForm type={type} data={data} setOpen={setOpen} />,
  lesson: (type, data, setOpen) => <LessonForm type={type} data={data} setOpen={setOpen} />,
  attendance: (type, data, setOpen) => <AttendanceForm type={type} data={data} setOpen={setOpen} />,
  subject: (type, data, setOpen) => <SubjectForm type={type} data={data} setOpen={setOpen} />,
  class: (type, data, setOpen) => <ClassForm type={type} data={data} setOpen={setOpen} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-yellow"
      : type === "update"
      ? "bg-sky"
      : "bg-purple";

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      let deleteFn;
      
      switch(table) {
        case 'teacher': deleteFn = deleteTeacher; break;
        case 'student': deleteFn = deleteStudent; break;
        case 'parent': deleteFn = deleteParent; break;
        case 'subject': deleteFn = deleteSubject; break;
        case 'class': deleteFn = deleteClass; break;
        case 'exam': deleteFn = deleteExam; break;
        case 'assignment': deleteFn = deleteAssignment; break;
        case 'result': deleteFn = deleteResult; break;
        case 'event': deleteFn = deleteEvent; break;
        case 'announcement': deleteFn = deleteAnnouncement; break;
        case 'lesson': deleteFn = deleteLesson; break;
        default: throw new Error('Delete function not found');
      }
      
      await deleteFn(id);
      alert(`✅ ${table} deleted.`);
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button onClick={handleDelete} className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center hover:cursor-pointer">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? forms[table](type, data, setOpen) : "Form not found!"
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full hover:cursor-pointer ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;