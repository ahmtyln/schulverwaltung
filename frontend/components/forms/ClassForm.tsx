"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  createClass,
  updateClass,
  fetchGrades,
  fetchTeachers,
  type GradeListItem,
  type Teacher,
} from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  name: z.string().optional(),
  capacity: z.coerce.number().optional(),
  gradeId: z.coerce.number().min(1, "Select a grade"),
  teacherId: z.coerce.number().optional(),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [grades, setGrades] = useState<GradeListItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchGrades(), fetchTeachers()])
      .then(([g, t]) => {
        setGrades(Array.isArray(g) ? g : []);
        setTeachers(Array.isArray(t) ? t : []);
      })
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? "",
      capacity: data?.capacity ?? undefined,
      gradeId: data?.gradeId ?? data?.gradeLevel ?? 0,
      teacherId: data?.teacherId ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (type === "create") {
        await createClass({
          name: formData.name || undefined,
          capacity: formData.capacity,
          gradeId: formData.gradeId,
          teacherId: formData.teacherId && formData.teacherId > 0 ? formData.teacherId : null,
        });
        alert("Class created.");
      } else {
        await updateClass(data.id, {
          name: formData.name || undefined,
          capacity: formData.capacity,
          gradeId: formData.gradeId,
          teacherId: formData.teacherId && formData.teacherId > 0 ? formData.teacherId : null,
        });
        alert("Class updated.");
      }
      setOpen?.(false);
      window.location.reload();
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create Class" : "Update Class"}
      </h2>
      <InputField
        label="Class name"
        name="name"
        register={register}
        error={errors.name}
      />
      <InputField
        label="Capacity"
        name="capacity"
        type="number"
        register={register}
        error={errors.capacity}
      />
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Grade *</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("gradeId")}
        >
          <option value={0}>— Select grade —</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              Level {g.level}
            </option>
          ))}
        </select>
        {errors.gradeId && (
          <p className="text-xs text-red-400">{errors.gradeId.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Supervisor (teacher, optional)</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("teacherId")}
        >
          <option value={0}>— None —</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
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

export default ClassForm;
