"use client";

import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import {
  fetchMe,
  fetchResults,
  fetchStudentSchedule,
  fetchAssignments,
  fetchAttendances,
  fetchAnnouncements,
  getStudentDisplayName,
  type MeDto,
  type ResultListItem,
  type AssignmentListItem,
  type AttendanceListItem,
  type AnnouncementListItem,
} from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString(undefined, { dateStyle: "short" });
  } catch {
    return d;
  }
};

const ParentPage = () => {
  const [me, setMe] = useState<MeDto | null>(null);
  const [results, setResults] = useState<ResultListItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [attendances, setAttendances] = useState<AttendanceListItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const studentIds = me?.studentIds ?? [];
  const firstChildId = studentIds[0] ?? null;

  useEffect(() => {
    setSelectedChildId(firstChildId);
  }, [firstChildId]);

  useEffect(() => {
    Promise.all([fetchMe(), fetchAnnouncements()])
      .then(([meData, ann]) => {
        setMe(meData ?? null);
        setAnnouncements(Array.isArray(ann) ? ann : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedChildId == null) return;
    Promise.all([
      fetchResults({ studentId: selectedChildId }),
      fetchStudentSchedule(selectedChildId),
      fetchAssignments({ studentId: selectedChildId }),
      fetchAttendances({ studentId: selectedChildId }),
    ])
      .then(([r, s, a, att]) => {
        setResults(Array.isArray(r) ? r : []);
        setAssignments(Array.isArray(a) ? a : []);
        setAttendances(Array.isArray(att) ? att : []);
        const events = (s || []).map((lesson: any) => ({
          id: lesson.lessonId,
          title: `${lesson.subjectName || ""} - ${lesson.className || ""}`,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
          backgroundColor: "#3b82f6",
        }));
        setScheduleEvents(events);
      })
      .catch(() => {});
  }, [selectedChildId]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (studentIds.length === 0) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">My children</h1>
          <p className="text-gray-500 mt-2">
            No students linked to your account. Ask the school admin to link your child(ren) to your parent account.
          </p>
        </div>
        <div className="w-full lg:w-1/3">
          <Announcement items={announcements} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {studentIds.length > 1 && (
          <div className="bg-white p-2 rounded-md flex gap-2 flex-wrap">
            {studentIds.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedChildId(id)}
                className={`px-3 py-1 rounded-md text-sm ${selectedChildId === id ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              >
                {getStudentDisplayName(me, id)}
              </button>
            ))}
          </div>
        )}
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule {selectedChildId ? `(${getStudentDisplayName(me, selectedChildId)})` : ""}
          </h1>
          <BigCalendar events={scheduleEvents} />
        </div>
        {results.length > 0 && (
          <div className="bg-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">My child&apos;s grades (Results)</h2>
              <Link href="/list/results" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <ul className="space-y-2 text-sm">
              {results.slice(0, 8).map((r) => (
                <li key={r.id} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{r.title || r.subjectName} – {r.studentName}</span>
                  <span className="font-medium">{r.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {assignments.length > 0 && (
          <div className="bg-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">My child&apos;s assignments</h2>
              <Link href="/list/assignments" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <ul className="space-y-2 text-sm">
              {assignments.slice(0, 8).map((a) => (
                <li key={a.id} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{a.title || a.subjectName} – {a.className}</span>
                  <span className="text-gray-500 text-xs">{a.endTime ? formatDate(a.endTime) : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {attendances.length > 0 && (
          <div className="bg-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">My child&apos;s attendance</h2>
              <Link href="/list/attendance" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <ul className="space-y-2 text-sm">
              {attendances.slice(0, 10).map((a) => (
                <li key={a.id} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{a.lessonName} – {formatDate(a.date)}</span>
                  <span className={a.present ? "text-green-600 font-medium" : "text-red-600"}>
                    {a.present ? "Present" : "Absent"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcement items={announcements} />
      </div>
    </div>
  );
};

export default ParentPage;
