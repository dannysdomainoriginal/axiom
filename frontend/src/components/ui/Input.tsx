import React, { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface InputProps extends UseFormRegisterReturn {
  type: "email" | "password" | "text";
  label: string;
  placeholder: string;
  error: FieldError | undefined;
}

const Input = ({ label, type, error, ...register }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        <input
          {...register}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className="w-full bg-transparent outline-none"
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 mb-1 text-red-500 text-[13px]">{error.message}</p>
      )}
    </div>
  );
};

export default Input;
