"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createStudent, updateStudent, fetchClasses, type ClassListItem } from "@/lib/api";

const schema = z.object({
  id: z.number().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, { message: "Password must be at least 3 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  className: z.string().min(1, { message: "Class is required!" }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses()
      .then(setClasses)
      .catch(() => setClasses([]));
  }, []);

  const firstClassName = classes[0]?.name ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data?.id || 0,
      firstName: data?.firstName ?? data?.fullName?.split(" ")[0] ?? "",
      lastName: data?.lastName ?? data?.fullName?.split(" ").slice(1).join(" ") ?? "",
      username: data?.username ?? data?.email ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      bloodType: data?.bloodType ?? "",
      className: data?.className ?? firstClassName,
      password: "",
    },
  });

  useEffect(() => {
    if (classes.length > 0 && !data?.className) {
      setValue("className", firstClassName);
    }
  }, [classes, firstClassName, data?.className, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    setSubmitError(null);
    const className = formData.className || firstClassName;
    if (!className && type === "create") {
      setSubmitError("No class available. Please create a class first (Classes menu).");
      return;
    }
    try {
      const passwordCreate =
        formData.password && formData.password.length >= 8 ? formData.password : undefined;
      if (type === "create") {
        if (!passwordCreate) {
          setSubmitError("Password must be at least 8 characters for new students.");
          return;
        }
      }
      const studentData: Record<string, unknown> = {
        name: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bloodType: formData.bloodType,
        className: className || firstClassName,
        gradeLevel: 1,
      };
      if (type === "create") {
        studentData.password = passwordCreate;
      } else if (formData.password && formData.password.length >= 8) {
        studentData.password = formData.password;
      }

      if (type === "update" && formData.id) {
        await updateStudent(formData.id, studentData as Parameters<typeof updateStudent>[1]);
      } else {
        await createStudent(studentData as Parameters<typeof createStudent>[0]);
      }

      setOpen?.(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error:", error);
      setSubmitError(error?.message ?? "Failed to save student.");
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create new student" : "Update student"}
      </h1>
      {type === "create" && (
        <>
          <span className="text-xs text-gray-400 font-medium">
            Authentication Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <InputField
              label="Username"
              name="username"
              defaultValue={data?.username}
              register={register}
              error={errors?.username}
            />
            <InputField
              label="Email"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              defaultValue={data?.password}
              register={register}
              error={errors?.password}
            />
          </div>
        </>
      )}
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("className")}
          >
            {classes.length === 0 ? (
              <option value="">No classes — create one first</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </select>
          {errors.className?.message && (
            <p className="text-xs text-red-400">{errors.className.message}</p>
          )}
        </div>
        {/*<div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>*/}
        {/*<div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>*/}
      </div>
      {submitError && (
        <p className="text-sm text-red-500">{submitError}</p>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md hover:cursor-pointer">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;