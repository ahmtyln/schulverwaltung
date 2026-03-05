"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createParent,
  updateParent,
  fetchStudents,
  type CreateParentRequest,
  type UpdateParentRequest,
  type Student,
} from "@/lib/api";

const schema = z.object({
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().email({ message: "Invalid email!" }).optional().or(z.literal("")),
  password: z.string().optional().refine((val) => !val || val.length >= 6, { message: "Min 6 characters" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  useEffect(() => {
    if (data?.studentIds?.length) {
      setSelectedStudentIds(data.studentIds);
    }
  }, [data?.studentIds]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name ?? "",
      surname: data?.surname ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      password: "",
    },
  });

  const toggleStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const onSubmit = handleSubmit(async (formData) => {
    setSubmitError(null);
    try {
      if (type === "create") {
        if (!formData.email?.trim()) {
          setSubmitError("Email is required for new parent.");
          return;
        }
        const pass = formData.password && formData.password.length >= 6 ? formData.password : undefined;
        if (!pass) {
          setSubmitError("Password must be at least 6 characters for new parent.");
          return;
        }
        const payload: CreateParentRequest = {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: pass,
          phone: formData.phone,
          address: formData.address || undefined,
          studentIds: selectedStudentIds.length > 0 ? selectedStudentIds : undefined,
        };
        await createParent(payload);
      } else {
        const payload: UpdateParentRequest = {
          id: data.id,
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone,
          address: formData.address || undefined,
          studentIds: selectedStudentIds,
        };
        await updateParent(data.id, payload);
      }
      setOpen?.(false);
      window.location.reload();
    } catch (error: any) {
      setSubmitError(error?.message ?? "Failed to save parent.");
    }
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create new parent" : "Update parent"}
      </h1>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
        {type === "create" && (
          <>
            <InputField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500 font-medium">Students (link children to this parent)</label>
        <div className="border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto flex flex-col gap-2">
          {students.length === 0 ? (
            <p className="text-sm text-gray-400">No students in system.</p>
          ) : (
            students.map((s) => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(s.id)}
                  onChange={() => toggleStudent(s.id)}
                />
                <span>{s.fullName || [s.name, s.surname].filter(Boolean).join(" ")} (ID: {s.id})</span>
              </label>
            ))
          )}
        </div>
      </div>
      {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md hover:cursor-pointer w-max">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
