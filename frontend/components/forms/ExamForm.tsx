"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createExam, updateExam, fetchLessons, fetchMe, type LessonListItem, type MeDto } from "@/lib/api";
import { useRole } from "@/lib/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  lessonId: z.coerce.number().min(1, "Select a lesson"),
});

type Inputs = z.infer<typeof schema>;

const ExamForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Teacher ise sadece kendi derslerini getir, diğer roller için tüm dersler
    const load = async () => {
      try {
        if (role === "TEACHER") {
          const meData = me ?? await fetchMe().catch(() => null);
          if (meData?.teacherId != null) {
            setMe(meData);
            const list = await fetchLessons({ teacherId: meData.teacherId });
            setLessons(list);
            return;
          }
        }
        const all = await fetchLessons();
        setLessons(all);
      } catch {
        setLessons([]);
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
      title: data?.title ?? "",
      startTime: data?.startTime ? data.startTime.slice(0, 16) : "",
      endTime: data?.endTime ? data.endTime.slice(0, 16) : "",
      lessonId: data?.lessonId ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const start = formData.startTime.length === 16 ? formData.startTime + ":00" : formData.startTime;
      const end = formData.endTime.length === 16 ? formData.endTime + ":00" : formData.endTime;
      const payload = { title: formData.title, startTime: start, endTime: end, lessonId: formData.lessonId };
      if (type === "update" && data?.id) {
        await updateExam(data.id, payload);
        alert("Exam updated.");
      } else {
        await createExam(payload);
        alert("Exam added.");
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
      <h2 className="text-lg font-semibold">{type === "create" ? "New exam" : "Update exam"}</h2>
      <InputField label="Title" name="title" register={register} error={errors.title} />
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
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Lesson</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("lessonId")}
        >
          <option value={0}>Select...</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.subjectName} – {l.className})
            </option>
          ))}
        </select>
        {errors.lessonId && (
          <p className="text-xs text-red-400">{errors.lessonId.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : type === "create" ? "Add" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
