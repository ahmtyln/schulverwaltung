"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTeacher, updateTeacher, fetchTeacherById, fetchLessons, type LessonListItem } from "@/lib/api";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Min 8 characters").optional().or(z.literal("")),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  phone: z.string().min(10, "Phone min 10 digits"),
  address: z.string().optional(),
  lessonIds: z.array(z.number()).optional(),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const nameParts = data?.name?.split(" ") ?? [];
  const defaultName = nameParts[0] ?? "";
  const defaultSurname = nameParts.slice(1).join(" ") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ? defaultName : "",
      surname: data?.surname ?? data?.lastName ?? defaultSurname,
      email: data?.email ?? data?.user?.email ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      lessonIds: data?.lessonIds ?? [],
    },
  });

  const selectedLessonIds = watch("lessonIds") ?? [];

  useEffect(() => {
    fetchLessons()
      .then(setLessons)
      .catch(() => setLessons([]));
  }, []);

  useEffect(() => {
    if (type === "update" && data?.id && !initialLoaded) {
      setInitialLoaded(true);
      fetchTeacherById(data.id)
        .then((t) => {
          const parts = (t.name || "").split(" ");
          reset({
            name: parts[0] ?? "",
            surname: parts.slice(1).join(" ") ?? "",
            email: t.email ?? "",
            phone: t.phone ?? "",
            address: t.address ?? "",
            lessonIds: t.lessonIds ?? [],
          });
        })
        .catch(() => {});
    }
  }, [type, data?.id, initialLoaded, reset]);

  const toggleLesson = (lessonId: number) => {
    const current = selectedLessonIds as number[];
    const next = current.includes(lessonId)
      ? current.filter((id) => id !== lessonId)
      : [...current, lessonId];
    setValue("lessonIds", next);
  };

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        email: formData.email,
        address: formData.address ?? "",
        lessonIds: formData.lessonIds ?? [],
      };

      if (type === "update" && data?.id) {
        await updateTeacher(data.id, payload);
        alert("Teacher updated.");
      } else {
        const pwd = formData.password?.trim() || "";
        if (pwd.length < 8) {
          alert("Password must be at least 8 characters.");
          setLoading(false);
          return;
        }
        await createTeacher({
          ...payload,
          password: pwd,
        });
        alert("Teacher created.");
      }

      setOpen?.(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: " + (error?.message ?? "Unknown"));
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create new teacher" : "Update teacher"}
      </h1>

      {/* Authentication */}
      <span className="text-xs text-gray-400 font-medium">Authentication</span>
      <div className="flex justify-between flex-wrap gap-4">
        {/*<InputField label="Username" name="username" register={register} error={errors.username} />*/}
        <InputField label="Email" name="email" register={register} error={errors.email} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
      </div>

      {/* Personal Info */}
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="Name" name="name" register={register} error={errors.name} />
          <InputField label="Surname" name="surname" register={register} error={errors.surname} />
          <InputField label="Phone" name="phone" register={register} error={errors.phone} />
        </div>
        <InputField label="Address" name="address" register={register} error={errors.address} />
      </div>

      {/* Lessons (assigns teacher to lessons → shows as Subjects/Classes in list) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400 font-medium">Lessons (optional)</span>
        <p className="text-xs text-gray-500">Select lessons to assign this teacher. Subjects and classes are derived from lessons.</p>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
          {lessons.length === 0 && <p className="text-xs text-gray-500">Loading lessons...</p>}
          {lessons.map((l) => (
            <label key={l.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedLessonIds.includes(l.id)}
                onChange={() => toggleLesson(l.id)}
                className="rounded"
              />
              <span className="text-sm">{l.name} ({l.subjectName} – {l.className})</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 disabled:opacity-50 hover:cursor-pointer"
      >
        {loading ? "Creating..." : (type === "create" ? "Create Teacher" : "Update Teacher")}
      </button>
    </form>
  );
};

export default TeacherForm;
