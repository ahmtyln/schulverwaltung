'use client';
import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import StudentLoadChart from "@/components/StudentLoadChart";
import { useRole } from "@/lib/auth";
import Image from "next/image";
import {
  fetchStudentById,
  fetchStudentSchedule,
  fetchAttendances,
  fetchAssignments,
  fetchExams,
  fetchResults,
} from "@/lib/api";
import type { StudentDetail } from "@/lib/api";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from 'react';

const SingleStudentPage = () => {
  const params = useParams();
  const role = useRole();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [examsCount, setExamsCount] = useState(0);
  const [resultsCount, setResultsCount] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState<number | null>(null);

  const studentId = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(studentId) || studentId <= 0) return;

    fetchStudentById(studentId)
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Student fetch error:", error);
        notFound();
      });

    fetchStudentSchedule(studentId)
      .then(data => {
        const events = data.map((lesson: any) => ({
          id: lesson.lessonId,
          title: `${lesson.subjectName} - ${lesson.className}`,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
          backgroundColor: '#3b82f6'
        }));
        setScheduleEvents(events);
      })
      .catch(console.error);

    Promise.all([
      fetchAttendances({ studentId }),
      fetchAssignments({ studentId }),
      fetchExams({ studentId }),
      fetchResults({ studentId }),
    ]).then(([attendances, assignments, exams, results]) => {
      setAssignmentsCount(Array.isArray(assignments) ? assignments.length : 0);
      setExamsCount(Array.isArray(exams) ? exams.length : 0);
      setResultsCount(Array.isArray(results) ? results.length : 0);
      if (Array.isArray(attendances) && attendances.length > 0) {
        const present = attendances.filter((a: { present?: boolean }) => a.present).length;
        setAttendancePercent(Math.round((present / attendances.length) * 100));
      } else {
        setAttendancePercent(null);
      }
    }).catch(console.error);
  }, [studentId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!student) return <div>Student not found!</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT - TeacherPage AYNEN! */}
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-sky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.photo || "/noAvatar.png"}  // ← Student photo
                alt={student.fullName}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{student.fullName}</h1>
                {role === "ADMIN" && (
                  <FormModal
                    table="student"
                    type="update"
                    data={{
                      id: student.id,
                      firstName: student.fullName.split(' ')[0],
                      lastName: student.fullName.split(' ').slice(1).join(' '),
                      email: student.email,
                      phone: student.phone,
                      address: student.address,
                      bloodType: student.bloodType
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">{student.address}</p>

              {/* INFO CARDS - Student'a özel */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType || "A+"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/class.png" alt="" width={14} height={14} />
                  <span>{student.className || "10A"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS - Student stats (dynamic) */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{attendancePercent != null ? `${attendancePercent}%` : "—"}</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{assignmentsCount}</h1>
                <span className="text-sm text-gray-400">Assignments</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{examsCount}</h1>
                <span className="text-sm text-gray-400">Exams</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{resultsCount}</h1>
                <span className="text-sm text-gray-400">Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student's Schedule</h1>
          <BigCalendar events={scheduleEvents} />
        </div>
      </div>

      {/* RIGHT - Student load chart + Announcements */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <StudentLoadChart
          stats={{
            assignmentsCount,
            examsCount,
            resultsCount,
            attendancePercent,
          }}
        />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
