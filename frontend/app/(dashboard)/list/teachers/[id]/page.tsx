'use client';
import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { fetchTeacherById, fetchTeacherSchedule } from "@/lib/api";
import type { Teacher } from "@/lib/api";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from 'react';



const SingleTeacherPage = () => {
  const isAdmin = role?.toString().toUpperCase() === 'ADMIN';
  const params = useParams(); 
  const [teacher, setTeacher] = useState<Teacher | null>(null);  // ← State
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const teacherId = Number(params.id);


  useEffect(() => {
     if (Number.isNaN(teacherId) || teacherId <= 0) return;

    // Teacher fetch
    fetchTeacherById(teacherId)
      .then((data) => {
        setTeacher(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Teacher fetch error:", error);
        notFound();
      });

    fetchTeacherSchedule(teacherId)
      .then(data => {
        const events = data.map((lesson: any) => ({
          id: lesson.lessonId,
          title: `${lesson.subjectName || 'Lesson'} - ${lesson.className || 'Class'}`,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
          backgroundColor: '#3b82f6'
        }));
        setScheduleEvents(events);
      })
      .catch(console.error);
  }, [teacherId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!teacher) return <div>Teacher is not found</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-sky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={teacher.photo}
                alt={teacher.name}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{teacher.name}</h1>
                {isAdmin && (
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{
                      id: teacher.id,
                      name: teacher.name.split(' ')[0],
                      surname: teacher.name.split(' ').slice(1).join(' '),
                      phone: teacher.phone,
                      email: teacher.email,
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">{teacher.address}</p>

              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{teacher.createdAt?.slice(0, 10) || "2026-01-01"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS - Dinamik */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher.subjects?.length || 2}</h1>
                <span className="text-sm text-gray-400">Subjects</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher.lessonIds?.length || 6}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{teacher.classes?.length || 6}</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar events = {scheduleEvents}/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        
        <Performance
          teacherStats={{
            subjectsCount: teacher.subjects?.length ?? 0,
            classesCount: teacher.classes?.length ?? 0,
            lessonsCount: teacher.lessonIds?.length ?? 0,
          }}
        />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;