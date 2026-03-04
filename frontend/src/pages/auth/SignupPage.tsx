import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/schemas";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/partials/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProfilePhotoSelector from "@/components/ui/ProfilePhotoSelector";
import { toast } from "@/libraries/sweetalert2";
import { authService } from "@/services";
import { buildFormDataStrict } from "@/utils/formParser";
import { useAuth } from "@/hooks/api/useAuth";
import axios from "axios";

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
      "profile-img": undefined,
    },
    resolver: zodResolver(signupSchema),
  });

  const { updateUser } = useAuth();

  // Handle signup
  const handleSignup: SubmitHandler<SignupSchema> = async (data) => {
    const formData = buildFormDataStrict(data);
    console.log(formData.get("profile-img"));

    try {
      // Test for disposable emails
      const str = `https://open.kickbox.com/v1/disposable/${data.email}`;
      const res = await axios.get(str)
      if (res.data.disposable) {
        throw new Error("We only accept trusted emails")
      }

      const { data: user, message } = await authService.signupReq(formData);

      toast.success(message);
      updateUser(user);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <AuthLayout side="right">
      <div className="lg:w-full h-auto md:h-full mt-5 flex flex-col justify-center">
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
