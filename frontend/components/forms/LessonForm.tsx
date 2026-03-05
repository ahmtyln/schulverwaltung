"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  createLesson,
  updateLesson,
  fetchSubjects,
  fetchClasses,
  fetchTeachers,
  type CreateLessonRequest,
  type UpdateLessonRequest,
  type SubjectListItem,
  type ClassListItem,
  type Teacher,
} from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  day: z.string().min(1, "Select a day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  subjectId: z.coerce.number().min(1, "Select a subject"),
  classId: z.coerce.number().min(1, "Select a class"),
  teacherId: z.coerce.number().min(1, "Select a teacher"),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [subjects, setSubjects] = useState<SubjectListItem[]>([]);
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchSubjects(), fetchClasses(), fetchTeachers()])
      .then(([s, c, t]) => {
        setSubjects(Array.isArray(s) ? s : []);
        setClasses(Array.isArray(c) ? c : []);
        setTeachers(Array.isArray(t) ? t : []);
      })
      .catch(() => {});
  }, []);

  const startVal = data?.startTime ? (typeof data.startTime === "string" && data.startTime.length >= 16 ? data.startTime.slice(0, 16) : "") : "";
  const endVal = data?.endTime ? (typeof data.endTime === "string" && data.endTime.length >= 16 ? data.endTime.slice(0, 16) : "") : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? "",
      day: data?.day ?? "",
      startTime: startVal,
      endTime: endVal,
      subjectId: data?.subjectId ?? 0,
      classId: data?.classId ?? 0,
      teacherId: data?.teacherId ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const startStr = formData.startTime.length === 16 ? formData.startTime + ":00" : formData.startTime;
      const endStr = formData.endTime.length === 16 ? formData.endTime + ":00" : formData.endTime;
      if (type === "update" && data?.id) {
        const payload: UpdateLessonRequest = {
          id: data.id,
          name: formData.name,
          day: formData.day,
          startTime: startStr,
          endTime: endStr,
          subjectId: formData.subjectId,
          classId: formData.classId,
          teacherId: formData.teacherId,
        };
        await updateLesson(data.id, payload);
        alert("Lesson updated.");
      } else {
        const payload: CreateLessonRequest = {
          name: formData.name,
          day: formData.day,
          startTime: startStr,
          endTime: endStr,
          subjectId: formData.subjectId,
          classId: formData.classId,
          teacherId: formData.teacherId,
        };
        await createLesson(payload);
        alert("Lesson created.");
      }
      setOpen?.(false);
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e?.message ?? "Unknown"));
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold">{type === "create" ? "New lesson" : "Update lesson"}</h2>
      <InputField label="Lesson name" name="name" register={register} error={errors.name} />
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-48">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
          >
            <option value="">Select...</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.day && <p className="text-xs text-red-400">{errors.day.message}</p>}
        </div>
        <InputField
          label="Start"
          name="startTime"
          type="datetime-local"
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End"
          name="endTime"
          type="datetime-local"
          register={register}
          error={errors.endTime}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-48">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
          >
            <option value={0}>Select...</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.subjectId && <p className="text-xs text-red-400">{errors.subjectId.message}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-48">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
          >
            <option value={0}>Select...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId && <p className="text-xs text-red-400">{errors.classId.message}</p>}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-48">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
          >
            <option value={0}>Select...</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.teacherId && <p className="text-xs text-red-400">{errors.teacherId.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
