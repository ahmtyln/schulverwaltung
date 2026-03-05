'use client';

import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import { fetchAnnouncements, fetchEvents, fetchMe, type AnnouncementListItem, type EventListItem } from "@/lib/api";
import { useRole } from "@/lib/auth";
import { useEffect, useState } from "react";

function toCalendarEvents(list: EventListItem[]): Array<{ start: Date; end: Date; title: string }> {
  return (list || []).map((e) => {
    const start = e.date ? new Date(e.date) : new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return { start, end, title: e.title || "Event" };
  });
}

const TeacherPage = () => {
  const role = useRole();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([]);

  useEffect(() => {
    if (role !== "TEACHER") return;
    fetchMe()
      .then((me) => {
        if (me?.teacherId == null) return;
        return Promise.all([
          fetchEvents({ teacherId: me.teacherId }),
          fetchAnnouncements({ teacherId: me.teacherId }),
        ]);
      })
      .then((result) => {
        if (result) {
          setEvents(result[0] ?? []);
          setAnnouncements(result[1] ?? []);
        }
      })
      .catch(() => {});
  }, [role]);

  const calendarEvents = toCalendarEvents(events);

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendar events={calendarEvents} />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcement items={announcements} />
      </div>
    </div>
  );
};

export default TeacherPage;