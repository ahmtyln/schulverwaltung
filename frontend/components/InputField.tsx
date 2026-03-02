import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string | number;
  error?: FieldError;
  options?: string[]; // select için
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  options,
  inputProps,
}: InputFieldProps) => {
  // select için options varsa
  if (options && options.length > 0) {
    return (
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">{label}</label>
        <select
          {...register(name)}
          defaultValue={defaultValue || ""}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error?.message && (
          <p className="text-xs text-red-400">{error.message.toString()}</p>
        )}
      </div>
    );
  }

  // normal input
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        defaultValue={defaultValue}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;