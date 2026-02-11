import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/partials/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "@/libraries/sweetalert2";
import { authService } from "@/services";
import { useAuth } from "@/hooks/api/useAuth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { updateUser } = useAuth();

  // Handle login
  const handleLogin: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const { data: user, message } = await authService.loginReq(
        data.email,
        data.password,
      );

      toast.success(message);
      updateUser(user);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout side="left">
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Login to an existing account
        </p>

        <form onSubmit={handleSubmit(handleLogin)}>
          <Input
            {...register("email")}
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email}
          />
          <Input
            {...register("password")}
            type="password"
            label="Enter Your Password"
            placeholder="Min 8 Characters"
            error={errors.email ? undefined : errors.password}
          />

          <Button
            type="submit"
            className="btn-primary"
            text="Login"
            loadingState={{ message: "Logging in...", isLoading: isSubmitting }}
            disabled={isSubmitting}
          />

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
