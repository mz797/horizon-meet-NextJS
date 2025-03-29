"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import SubmitButton from "src/components/form/SubmitButton";
import { login } from "src/lib/auth";
import { loginSchema, loginSchemaType } from "src/lib/zod-schemas";

function LoginPage() {
  const router = useRouter();

  const [serverErrors, setServerErrors] = useState<{
    email?: string[];
    password?: string[];
    general?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginSchemaType) => {
    const result = await login(data);
    if (result.errors) {
      setServerErrors(result.errors);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="px-4 md:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center h-screen "
      >
        <h1 className="text-5xl mb-8">Login in</h1>
        <div className="max-w-xl  w-full md:min-w-xl md:px-8">
          <div className="form-container">
            <label
              htmlFor="email"
              className={
                errors.email || serverErrors?.email ? "label-invalid" : "label"
              }
            >
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`input ${
                errors.email || serverErrors?.email ? "invalid-input" : ""
              }`}
            />
            {(errors.email || serverErrors?.email) && (
              <p className="error-message">
                {errors.email?.message || serverErrors?.email?.[0]}
              </p>
            )}
          </div>
          <div className="form-container">
            <label
              htmlFor="password"
              className={
                errors.password || serverErrors?.password
                  ? "label-invalid"
                  : "label"
              }
            >
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className={`input ${
                errors.password || serverErrors?.password ? "invalid-input" : ""
              }`}
            />
            {(errors.password || serverErrors?.password) && (
              <p className="error-message">
                {errors.password?.message || serverErrors?.password?.[0]}
              </p>
            )}
          </div>
          {serverErrors.general && (
            <p className="error-message">{serverErrors.general}</p>
          )}
          <SubmitButton>Submit</SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
