"use client";

import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";
import {
  fetchMe,
  fetchResults,
  fetchExams,
  fetchEvents,
  fetchAnnouncements,
  fetchStudentSchedule,
  type MeDto,
  type ResultListItem,
  type ExamListItem,
  type EventListItem,
  type AnnouncementListItem,
} from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const StudentPage = () => {
  const [me, setMe] = useState<MeDto | null>(null);
  const [results, setResults] = useState<ResultListItem[]>([]);
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setMe(data);
        if (data?.studentId) {
          const eventParams = data.classId != null ? { classId: data.classId } : { studentId: data.studentId };
          const announcementParams = data.classId != null ? { classId: data.classId } : { studentId: data.studentId };
          return Promise.all([
            fetchResults({ studentId: data.studentId }),
            data.classId ? fetchExams({ classId: data.classId }) : fetchExams({ studentId: data.studentId }),
            fetchEvents(eventParams),
            fetchAnnouncements(announcementParams),
            fetchStudentSchedule(data.studentId),
          ]);
        }
        return [ [], [], [], [], [] ];
      })
      .then(([r, e, evts, anns, s]) => {
        setResults((r as ResultListItem[]) || []);
        setExams((e as ExamListItem[]) || []);
        setEvents((evts as EventListItem[]) || []);
        setAnnouncements((anns as AnnouncementListItem[]) || []);
        const schedule = (s || []) as Array<{ lessonId?: number; id?: number; subjectName?: string; className?: string; title?: string; startTime?: string; endTime?: string }>;
        const calendarEvents = schedule
          .filter((lesson) => lesson.startTime && lesson.endTime)
          .map((lesson) => ({
            id: lesson.lessonId ?? lesson.id ?? 0,
            title: lesson.subjectName || lesson.title || `${lesson.className || ""}`.trim() || "Lesson",
            start: new Date(lesson.startTime!),
            end: new Date(lesson.endTime!),
            backgroundColor: "#3b82f6",
          }));
        setScheduleEvents(calendarEvents);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">My schedule</h1>
          <BigCalendar events={scheduleEvents} />
        </div>
        {(results.length > 0 || exams.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.length > 0 && (
              <div className="bg-white p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">My latest grades</h2>
                  <Link href="/list/results" className="text-sm text-blue-600 hover:underline">
                    View all
                  </Link>
                </div>
                <ul className="space-y-2 text-sm">
                  {results.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex justify-between border-b border-gray-100 pb-1">
                      <span>{r.title || r.subjectName}</span>
                      <span className="font-medium">{r.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exams.length > 0 && (
              <div className="bg-white p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">My exams</h2>
                  <Link href="/list/exams" className="text-sm text-blue-600 hover:underline">
                    View all
                  </Link>
                </div>
                <ul className="space-y-2 text-sm">
                  {exams.slice(0, 5).map((e) => (
                    <li key={e.id} className="flex justify-between border-b border-gray-100 pb-1">
                      <span>{e.subjectName} – {e.className}</span>
                      <span>{e.date || (e.startTime ? e.startTime.slice(0, 10) : "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar events={events} />
        <Announcement items={announcements} />
      </div>
    </div>
  );
};

export default StudentPage;
