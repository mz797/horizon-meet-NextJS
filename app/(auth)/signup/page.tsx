"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "src/components/form/SubmitButton";
import { signUp } from "src/lib/auth";
import { signUpSchema, type signUpSchemaType } from "src/lib/zod-schemas";

function SignUpPage() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: signUpSchemaType) => {
    const result = await signUp(data);
    if (result.errors) {
      setServerErrors(result.errors);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="px-4 md:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center h-screen "
      >
        <h1 className="text-5xl mb-8">Sign in</h1>
        <div className="max-w-xl  w-full md:min-w-xl md:px-8">
          <div className="form-container">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input {...register("name")} id="name" className="input" />
            {(errors.name || serverErrors?.name) && (
              <p className="error-message">
                {errors.name?.message || serverErrors?.name?.[0]}
              </p>
            )}
          </div>
          <div className="form-container">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="input"
            />
            {(errors.email || serverErrors?.email) && (
              <p className="error-message">
                {errors.email?.message || serverErrors?.email?.[0]}
              </p>
            )}
          </div>
          <div className="form-container">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="input"
            />
            {(errors.password || serverErrors?.password) && (
              <p className="error-message">
                {errors.password?.message || serverErrors?.password?.[0]}
              </p>
            )}
          </div>
          <SubmitButton>Submit</SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
