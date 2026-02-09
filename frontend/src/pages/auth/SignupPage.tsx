import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/schemas";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/partials/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import ProfilePhotoSelector from "@/components/ui/ProfilePhotoSelector";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      profilePic: undefined,
    },
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  // Handle signup
  const handleSignup: SubmitHandler<SignupSchema> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Successful");
    console.log(data)
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full my-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by signing up below
        </p>

        <form onSubmit={handleSubmit(handleSignup)}>
          <ProfilePhotoSelector control={control} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("name")}
              label="Full Name"
              placeholder="Charles Daniel"
              type="text"
              error={errors.name}
            />
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
              error={errors.password}
            />
            <Input
              {...register("adminInviteToken")}
              type="text"
              label="Admin Invite Token"
              placeholder="Invitation Code"
              error={errors.adminInviteToken}
            />
          </div>

          <Button
            type="submit"
            className="btn-primary"
            text="Sign up"
            loadingState={{
              message: "Signing up...",
              isLoading: isSubmitting,
            }}
            disabled={isSubmitting}
          />

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
