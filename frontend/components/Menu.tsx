"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRole } from "@/lib/auth";
import { fetchAnnouncements, fetchMe, fetchParentMessages, fetchTeacherMessages, type MeDto } from "@/lib/api";
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ['ADMIN'],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ['ADMIN' , 'TEACHER'],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ['ADMIN' , 'TEACHER'],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ['ADMIN'],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ['ADMIN' , 'TEACHER'],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ['ADMIN' , 'TEACHER'],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ['ADMIN' , 'TEACHER' , 'STUDENT' , 'PARENT'],
      },
    ],
  },
];


const Menu = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);

  // Me for role-based announcement count (TEACHER, STUDENT, PARENT)
  useEffect(() => {
    if (!role || role === "ADMIN") return;
    fetchMe().then(setMe).catch(() => setMe(null));
  }, [role]);

  const refreshMessageCount = async () => {
    if (!role) return;
    try {
      if (role === "TEACHER") {
        const msgs = await fetchTeacherMessages();
        setMessageCount(msgs.length);
      } else if (role === "PARENT") {
        const msgs = await fetchParentMessages();
        setMessageCount(msgs.length);
      } else {
        setMessageCount(0);
      }
    } catch {
      setMessageCount(0);
    }
  };

  useEffect(() => {
    if (!role) return;

    const load = async () => {
      // Announcements: role göre filtreli sayı (liste sayfasıyla aynı mantık)
      try {
        if (role === "ADMIN") {
          const anns = await fetchAnnouncements();
          setAnnouncementCount(anns.length);
        } else if (role === "TEACHER" && me?.teacherId != null) {
          const anns = await fetchAnnouncements({ teacherId: me.teacherId });
          setAnnouncementCount(anns.length);
        } else if (role === "STUDENT" && me != null) {
          if (me.classId != null) {
            const anns = await fetchAnnouncements({ classId: me.classId });
            setAnnouncementCount(anns.length);
          } else if (me.studentId != null) {
            const anns = await fetchAnnouncements({ studentId: me.studentId });
            setAnnouncementCount(anns.length);
          } else {
            setAnnouncementCount(0);
          }
        } else if (role === "PARENT" && me?.studentSummaries?.length) {
          const first = me.studentSummaries[0];
          const params = first.classId != null ? { classId: first.classId } : { studentId: first.id };
          const anns = await fetchAnnouncements(params);
          setAnnouncementCount(anns.length);
        } else if (role === "TEACHER" || role === "STUDENT" || role === "PARENT") {
          setAnnouncementCount(0);
        }
      } catch {
        setAnnouncementCount(0);
      }

      await refreshMessageCount();
    };

    load();
  }, [role, me?.teacherId, me?.studentId, me?.classId, me?.studentSummaries]);

  // Mesaj silindiğinde navbar sayacını güncelle
  useEffect(() => {
    const onMessagesUpdated = () => refreshMessageCount();
    window.addEventListener("messages-updated", onMessagesUpdated);
    return () => window.removeEventListener("messages-updated", onMessagesUpdated);
  }, [role]);

  return (
    <div className="text-sm">
      {menuItems.map((section) => (
        <div key={section.title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items
            .filter((item) => role && item.visible.includes(role))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-100 transition-all"
              >
                <div className="relative flex items-center">
                  <Image src={item.icon} alt="" width={20} height={20} />
                  {item.label === "Messages" && messageCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                      {messageCount > 9 ? "9+" : messageCount}
                    </span>
                  )}
                  {item.label === "Announcements" && announcementCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                      {announcementCount > 9 ? "9+" : announcementCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
        </div>
      ))}
      {role === null && (
        <p className="hidden lg:block text-gray-400 text-xs mt-4">Loading menu...</p>
      )}
    </div>
  );
};

export default Menu