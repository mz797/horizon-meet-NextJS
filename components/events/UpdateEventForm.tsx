"use client";

import ImagePicker from "src/components/form/ImagePicker";
import SubmitButton from "src/components/form/SubmitButton";
import React, { useEffect } from "react";
import { editEvent } from "src/lib/events";
import { createEventSchema, createEventSchemaType } from "src/lib/zod-schemas";
import { redirect, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateEventForm = ({ event }: { event: createEventSchemaType }) => {
  const params = useParams<{ eventId: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<createEventSchemaType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: event,
  });
  console.log(3, event);

  useEffect(() => {
    register("image", { required: "Image is required." });
  }, [register]);

  useEffect(() => {
    if (event.image instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-expect-error
        setValue("image", reader.result, { shouldValidate: true });
      };
      reader.readAsDataURL(event.image);
    } else {
      setValue("image", event.image, { shouldValidate: true });
    }
  }, [event.image]);
  const onSubmit = async (data: createEventSchemaType) => {
    const res = await editEvent(data, params.eventId);
    if (res?.success) {
      redirect(`/events/${params.eventId}`);
    }
  };

  return (
    <div className="px-4 md:px-8 flex flex-col justify-center items-center">
      <h1 className="text-5xl mt-8 text-center">Create event</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center  max-w-lg  w-full md:min-w-lg md:px-8"
      >
        <div className="form-container w-full">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input {...register("title")} id="title" className="input w-full" />
          {errors.title && (
            <p className="error-message">{errors.title?.message}</p>
          )}
        </div>
        <div className="form-container w-full">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={7}
            className="input"
          />
          {errors.title && (
            <p className="error-message">{errors.description?.message}</p>
          )}
        </div>
        <div className="form-container w-full">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            {...register("date")}
            id="date"
            className="input"
            type="date"
            defaultValue={event.date}
          />
          {errors.date && (
            <p className="error-message">{errors.date?.message}</p>
          )}
        </div>
        <div className="form-container w-full">
          <ImagePicker label="image" name="image" setValue={setValue} />
        </div>
        <SubmitButton>Create</SubmitButton>
      </form>
    </div>
  );
};

export default UpdateEventForm;
