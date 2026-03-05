"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  createAbsentAttendance,
  fetchLessons,
  fetchStudents,
  fetchMe,
  type AddAttendanceRequest,
  type LessonListItem,
  type Student,
  type MeDto,
} from "@/lib/api";
import { useRole } from "@/lib/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  lessonId: z.coerce.number().min(1, "Select a lesson"),
  studentIds: z.string().optional(), // comma-separated IDs or we use array
});

type Inputs = z.infer<typeof schema>;

const AttendanceForm = ({
  type,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (role === "TEACHER") {
          const meData = me ?? await fetchMe().catch(() => null);
          if (meData?.teacherId != null) {
            setMe(meData);
            const list = await fetchLessons({ teacherId: meData.teacherId });
            setLessons(list);
          } else {
            const allLessons = await fetchLessons();
            setLessons(allLessons);
          }
        } else {
          const allLessons = await fetchLessons();
          setLessons(allLessons);
        }
        const allStudents = await fetchStudents();
        setStudents(allStudents);
      } catch {
        setLessons([]);
        setStudents([]);
      }
    };
    load();
  }, [role, me?.teacherId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      lessonId: 0,
    },
  });

  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (selectedIds.length === 0) {
      alert("Select at least one student who was absent.");
      return;
    }
    setLoading(true);
    try {
      const dateStr =
        formData.date.length >= 16 ? formData.date + ":00" : formData.date + "T00:00:00";
      const payload: AddAttendanceRequest = {
        date: new Date(dateStr).toISOString(),
        lessonId: formData.lessonId,
        studentIds: selectedIds,
      };
      await createAbsentAttendance(payload);
      alert("Absent students added.");
      setOpen?.(false);
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e?.message ?? "Unknown"));
    } finally {
      setLoading(false);
    }
  });

  if (type !== "create") {
    return (
      <p className="text-gray-500">
        Use Create to add absent students for a date and lesson. Update/delete are not available for attendance.
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold">Add absent students</h2>
      <p className="text-sm text-gray-600">
        Select the date, lesson, and students who were absent. Only absent records will be added.
      </p>
      <InputField
        label="Date & time"
        name="date"
        type="datetime-local"
        register={register}
        error={errors.date}
      />
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs text-gray-500">Lesson</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("lessonId")}
        >
          <option value={0}>Select lesson...</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} {l.subjectName ? `— ${l.subjectName}` : ""} {l.className ? `/ ${l.className}` : ""}
            </option>
          ))}
        </select>
        {errors.lessonId && (
          <p className="text-xs text-red-400">{errors.lessonId.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label className="text-xs text-gray-500">Students absent (select all that apply)</label>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
          {students.map((s) => (
            <label key={s.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedIds.includes(s.id)}
                onChange={() => toggleStudent(s.id)}
              />
              <span className="text-sm">
                {s.fullName || s.name || `Student #${s.id}`}
              </span>
            </label>
          ))}
        </div>
        {selectedIds.length === 0 && (
          <p className="text-xs text-amber-600">Select at least one student.</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || selectedIds.length === 0}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add absent"}
      </button>
    </form>
  );
};

export default AttendanceForm;
