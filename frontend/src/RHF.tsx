import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? "Required field"
        : "Please enter a valid email address",
  }),

  password: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Required field"
          : "Invalid input for password",
    })
    .min(8, "Password must be at least 8 characters"),
});

type FormFields = z.infer<typeof schema>;

const ReactHookForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const error = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (error) {
        throw { message: "Intentional error" };
      } else {
        console.log(data);
        toast.success("Data logged successfully");
      }
    } catch (err: any) {
      toast.error(err.message);
      setError("root", {
        message: err.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Sign In
        </h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email")}
            placeholder="someone@email.com"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder="password"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="text-red-500 text-center text-sm">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default ReactHookForm;
