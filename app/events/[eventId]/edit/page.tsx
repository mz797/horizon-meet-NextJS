"use server";
import React from "react";
import { getEventById } from "src/lib/events";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
const UpdateEventForm = dynamic(
	() => import("src/components/events/UpdateEventForm")
);

async function EditEventPage({
	params,
}: {
	params: Promise<{ eventId: string }>;
}) {
	const event = await getEventById((await params).eventId);

	if (!event) return notFound();

	const response = await fetch(`${event.image}`);
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
