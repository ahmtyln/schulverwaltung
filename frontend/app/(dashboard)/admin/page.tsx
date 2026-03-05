'use client';

import Announcement from '@/components/Announcement';
import AttendanceChart, { type DayAttendance } from '@/components/AttendanceChart';
import CountChart from '@/components/CountChart';
import EventCalendar from '@/components/EventCalendar';
import FinanceChart from '@/components/FinanceChart';
import UserCard from '@/components/UserCard';
import {
  fetchAnnouncements,
  fetchAttendances,
  fetchEvents,
  fetchParents,
  fetchStudents,
  fetchTeachers,
  type AnnouncementListItem,
  type AttendanceListItem,
  type EventListItem,
  type Student,
} from '@/lib/api';
import { useEffect, useState } from 'react';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/** For each weekday: absent = distinct students with at least one absent record; present = totalStudents - absent. */
function aggregateAttendanceByWeekday(
  items: AttendanceListItem[],
  totalStudents: number
): DayAttendance[] {
  const byDay: Record<number, Set<number>> = {
    0: new Set(),
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
  };
  items.forEach((a) => {
    try {
      if (a.present || a.studentId == null) return;
      const d = new Date(a.date);
      const dayIndex = d.getDay();
      const weekday = dayIndex === 0 ? 6 : dayIndex - 1;
      if (weekday >= 0 && weekday <= 4) byDay[weekday].add(a.studentId);
    } catch {
      // skip invalid date
    }
  });
  return DAY_NAMES.map((name, i) => {
    const absent = byDay[i].size;
    const present = Math.max(0, totalStudents - absent);
    return { name, present, absent };
  });
}

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<DayAttendance[]>([]);
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetchStudents(),
      fetchTeachers(),
      fetchParents(),
      fetchAttendances(),
      fetchEvents(),
      fetchAnnouncements(),
    ])
      .then(([studentsList, teachersList, parentsList, attendances, eventsList, announcementsList]) => {
        setStudents(Array.isArray(studentsList) ? studentsList : []);
        setStudentCount(Array.isArray(studentsList) ? studentsList.length : 0);
        setTeacherCount(Array.isArray(teachersList) ? teachersList.length : 0);
        setParentCount(Array.isArray(parentsList) ? parentsList.length : 0);
        const total = Array.isArray(studentsList) ? studentsList.length : 0;
        setAttendanceData(aggregateAttendanceByWeekday(Array.isArray(attendances) ? attendances : [], total));
        setEvents(Array.isArray(eventsList) ? eventsList : []);
        setAnnouncements(Array.isArray(announcementsList) ? announcementsList : []);
      })
      .catch(() => {
        setStudents([]);
        setAttendanceData([]);
        setEvents([]);
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const boys = students.filter((s) => (s.sex || '').toUpperCase() === 'MALE').length;
  const girls = students.filter((s) => (s.sex || '').toUpperCase() === 'FEMALE').length;
  const totalStudents = students.length;

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[300px]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" count={studentCount} />
          <UserCard type="teacher" count={teacherCount} />
          <UserCard type="parent" count={parentCount} />
          {/*<UserCard type="staff" count={0} /> */}
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-112.5">
            <CountChart total={totalStudents} boys={boys} girls={girls} />
          </div>
          <div className="w-full lg:w-2/3 h-112.5">
            <AttendanceChart data={attendanceData} />
          </div>
        </div>
        {/*<div className="w-full h-125">
          <FinanceChart />
        </div>*/}
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar events={events} />
        <Announcement items={announcements} />
      </div>
    </div>
  );
};

export default AdminPage;
