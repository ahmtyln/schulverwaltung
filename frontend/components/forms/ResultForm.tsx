"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createResult, updateResult, fetchStudents, fetchExams, fetchAssignments, type Student, type ExamListItem, type AssignmentListItem } from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const schema = z.object({
  score: z.coerce.number().min(0).max(100),
  studentId: z.coerce.number().min(1, "Select a student"),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
}).refine((d) => (d.examId && d.examId > 0) || (d.assignmentId && d.assignmentId > 0), {
  message: "Select an exam or assignment",
  path: ["examId"],
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchStudents(), fetchExams(), fetchAssignments()])
      .then(([s, e, a]) => {
        setStudents(s);
        setExams(e);
        setAssignments(a);
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
      score: data?.score ?? 0,
      studentId: data?.studentId ?? 0,
      examId: data?.examId ?? 0,
      assignmentId: data?.assignmentId ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      if (type === "update" && data?.id) {
        await updateResult(data.id, { score: formData.score });
        alert("Result updated.");
      } else {
        const examId = formData.examId && formData.examId > 0 ? formData.examId : undefined;
        const assignmentId = formData.assignmentId && formData.assignmentId > 0 ? formData.assignmentId : undefined;
        await createResult({
          score: formData.score,
          studentId: formData.studentId,
          examId,
          assignmentId,
        });
        alert("Result added.");
      }
      setOpen?.(false);
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + (e?.message ?? "Unknown"));
    } finally {
      setLoading(false);
    }
  });

  if (type === "update") {
    return (
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <h2 className="text-lg font-semibold">Edit result</h2>
        {data?.subjectName && <p className="text-sm text-gray-600">{data.subjectName} – {data.studentName}</p>}
        <InputField
          label="Score (0–100)"
          name="score"
          type="number"
          register={register}
          error={errors.score}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update"}
        </button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-lg font-semibold">New result</h2>
      <InputField
        label="Score (0–100)"
        name="score"
        type="number"
        register={register}
        error={errors.score}
      />
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Student</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("studentId")}
        >
          <option value={0}>Select...</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName ?? s.name ?? s.id}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Exam (optional)</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("examId")}
        >
          <option value={0}>Select...</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.subjectName} – {e.className} ({e.date})
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Assignment (optional)</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("assignmentId")}
        >
          <option value={0}>Select...</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.subjectName} – {a.className}
            </option>
          ))}
        </select>
        {errors.examId && (
          <p className="text-xs text-red-400">{errors.examId.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add"}
      </button>
    </form>
  );
};

export default ResultForm;
