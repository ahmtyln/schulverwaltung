'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface CalendarEvent {
  id: number;
  title: string;
  className?: string;
  date: string;
  description?: string;
}

interface EventCalendarProps {
  events?: CalendarEvent[];
}

const formatEventTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const formatEventDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
};

const EventCalendar = ({ events = [] }: EventCalendarProps) => {
  const [value, onChange] = useState<Value>(new Date());

  const selectedDate = Array.isArray(value) ? value[0] : value;
  const selectedKey = selectedDate ? selectedDate.toDateString() : '';

  const eventsOnSelectedDay = useMemo(() => {
    if (!selectedDate || !events.length) return [];
    return events.filter((e) => {
      try {
        const d = new Date(e.date);
        return d.toDateString() === selectedKey;
      } catch {
        return false;
      }
    });
  }, [events, selectedKey]);

  const displayEvents = eventsOnSelectedDay.length > 0 ? eventsOnSelectedDay : events.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {displayEvents.length === 0 ? (
          <p className="text-sm text-gray-400">No events</p>
        ) : (
          displayEvents.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-purple"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
                  {formatEventDate(event.date)} {formatEventTime(event.date) ? `· ${formatEventTime(event.date)}` : ''}
                </span>
              </div>
              {event.description && (
                <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
              )}
              {event.className && (
                <p className="mt-1 text-xs text-gray-400">Class: {event.className}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
