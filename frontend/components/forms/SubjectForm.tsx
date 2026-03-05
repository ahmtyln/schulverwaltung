"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  createSubject,
  updateSubject,
  fetchTeachers,
  type Teacher,
} from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Subject name is required"),
  teacherId: z.coerce.number().optional(),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers()
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? "",
      teacherId: data?.teacherId ?? undefined,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (type === "create") {
        await createSubject({
          name: formData.name,
          teacherId: formData.teacherId && formData.teacherId > 0 ? formData.teacherId : undefined,
        });
        alert("Subject created.");
      } else {
        await updateSubject(data.id, {
          name: formData.name,
          teacherId: formData.teacherId && formData.teacherId > 0 ? formData.teacherId : null,
        });
        alert("Subject updated.");
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
        {type === "create" ? "Create Subject" : "Update Subject"}
      </h2>
      <InputField
        label="Subject name"
        name="name"
        register={register}
        error={errors.name}
      />
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Teacher (optional)</label>
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

export default SubjectForm;
