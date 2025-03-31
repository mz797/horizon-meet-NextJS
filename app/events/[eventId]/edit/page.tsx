"use server";
import React from "react";
import { getEventById } from "src/lib/events";
import { notFound } from "next/navigation";
import UpdateEventForm from "src/components/events/UpdateEventForm";

async function EditEventPage({ params }: { params: { eventId: string } }) {
  const event = await getEventById((await params).eventId);

  if (!event) return notFound();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}${event.image}`
  );
  const blob = await response.blob();
  const file = new File([blob], "juwenalia.jpg", { type: blob.type });

  const eventToUpdate = {
    title: event.title,
    description: event.description,
    date: event.date.toISOString().split("T")[0],
    image: file,
  };

  return <UpdateEventForm event={eventToUpdate} />;
}

export default EditEventPage;
