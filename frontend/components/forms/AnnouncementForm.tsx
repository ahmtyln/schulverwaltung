"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import {
  createAnnouncement,
  updateAnnouncement,
  fetchClasses,
  type ClassListItem,
  type CreateAnnouncementRequest,
  type UpdateAnnouncementRequest,
} from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  classId: z.coerce.number().min(1, "Select a class"),
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses().then(setClasses).catch(() => setClasses([]));
  }, []);

  const dateValue = data?.date
    ? typeof data.date === "string" && data.date.length >= 16
      ? data.date.slice(0, 16)
      : ""
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      date: dateValue,
      classId: data?.classId ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const dateStr = formData.date.length === 16 ? formData.date + ":00" : formData.date;
      if (type === "update" && data?.id) {
        const payload: UpdateAnnouncementRequest = {
          id: data.id,
          title: formData.title,
          description: formData.description || undefined,
          date: dateStr,
          classId: formData.classId,
        };
        await updateAnnouncement(data.id, payload);
        alert("Announcement updated.");
      } else {
        const payload: CreateAnnouncementRequest = {
          title: formData.title,
          description: formData.description || undefined,
          date: dateStr,
          classId: formData.classId,
        };
        await createAnnouncement(payload);
        alert("Announcement created.");
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
      <h2 className="text-lg font-semibold">
        {type === "create" ? "New announcement" : "Update announcement"}
      </h2>
      <InputField label="Title" name="title" register={register} error={errors.title} />
      <InputField
        label="Description"
        name="description"
        register={register}
        error={errors.description}
      />
      <InputField
        label="Date & time"
        name="date"
        type="datetime-local"
        register={register}
        error={errors.date}
      />
      <div className="flex flex-col gap-2 w-full md:w-1/4">
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
        {errors.classId && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
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

export default AnnouncementForm;
