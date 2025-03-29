"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

import SubmitButton from "src/components/form/SubmitButton";
import { createEvent } from "src/lib/events";
import { createEventSchema, createEventSchemaType } from "src/lib/zod-schemas";
import ImagePicker from "src/components/form/ImagePicker";

function CreateEventPage() {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<createEventSchemaType>({
    resolver: zodResolver(createEventSchema),
  });

  useEffect(() => {
    register("image", { required: "Image is required." });
  }, [register]);

  const onSubmit = async (data: createEventSchemaType) => {
    const res = await createEvent(data);
    if (res?.success) {
      redirect("/events");
    }
  };

  console.log(errors);
  console.log(watch("image"));

  return (
    <div className="px-4 md:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center h-screen "
      >
        <h1 className="text-5xl mb-8">Create event</h1>
        <div className="form-container">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input {...register("title")} id="title" className="input" />
          {errors.title && (
            <p className="error-message">{errors.title?.message}</p>
          )}
        </div>
        <div className="form-container">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            className="input"
          />
          {errors.title && (
            <p className="error-message">{errors.description?.message}</p>
          )}
        </div>
        <div className="form-container">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            {...register("date")}
            id="date"
            className="input"
            type="date"
          />
          {errors.date && (
            <p className="error-message">{errors.date?.message}</p>
          )}
        </div>
        <div className="form-container">
          <ImagePicker label="image" name="image" setValue={setValue} />
        </div>
        <SubmitButton>Create</SubmitButton>
      </form>
    </div>
  );
}

export default CreateEventPage;
