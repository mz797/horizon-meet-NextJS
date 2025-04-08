"use server";

import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import cloudinary from "cloudinary";
import { prisma } from "./prisma";
import { verifySession } from "./dal";

export const getEvents = async (payload: {
  pageNumber: number;
  rows: number;
}) => {
  const [events, count] = await prisma.$transaction([
    prisma.event.findMany({
      skip: payload.pageNumber * 10,
      take: payload.rows,
    }),
    prisma.event.count(),
  ]);

  return { events, count: Math.ceil(count / 10) };
};
export const getEventById = async (id: string) => {
  return await prisma.event.findFirst({
    where: { id },
    include: {
      organizer: { select: { name: true, id: true } },
      registration: { select: { id: true, userId: true } },
    },
  });
};

export const createEvent = async (event: any) => {
  const { userId } = await verifySession();

  if (!userId) throw new Error("Not authenticated");

  if (!event.image) throw new Error("No image picked");

  const formData = new FormData();
  formData.append("file", event.image);
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  formData.append("upload_preset", preset as string); // Your Cloudinary upload preset

  // Send the FormData to Cloudinary (using fetch or axios)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log(data);
  event.image = data.secure_url;

  await prisma.event.create({
    data: { ...event, date: new Date(event.date), organizerId: userId },
  });

  return { success: true };
};

export const editEvent = async (updatedEvent: any, eventId: string) => {
  try {
    const { userId } = await verifySession();

    if (!userId) new Error("Not authenticated");

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      new Error("This event doesen't exist");
      return;
    }

    cloudinary.v2.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Jeśli istnieje stare zdjęcie, usuń je z Cloudinary
    if (event.image && updatedEvent.image) {
      // Sprawdzamy, czy zdjęcie zostało zmienione
      const oldImagePublicId = event?.image?.split("/")?.pop()?.split(".")[0]; // Uzyskujemy public_id z URL
      if (oldImagePublicId)
        await cloudinary.v2.uploader.destroy(oldImagePublicId); // Usuwamy stare zdjęcie z Cloudinary
    }

    const formData = new FormData();
    formData.append("file", updatedEvent.image);
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    formData.append("upload_preset", preset as string); // Your Cloudinary upload preset

    // Send the FormData to Cloudinary (using fetch or axios)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    updatedEvent.image = data.secure_url;

    await prisma.event.update({
      where: { id: eventId },
      data: {
        ...updatedEvent,
        date: new Date(updatedEvent.date),
      },
    });
    return { success: true };
  } catch (err) {
    throw err;
  }
};

export const deleteEventById = async (eventId: string) => {
  console.log("Deleting event:", eventId);

  if (!eventId) {
    throw new Error("Invalid event ID");
  }

  try {
    const session = await verifySession();
    console.log("SESSION:", session);

    if (!session || !session.userId) {
      throw new Error("Not authenticated");
    }

    const { userId } = session;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    console.log("EVENT:", event);

    if (!event) {
      throw new Error("Event doesn't exist");
    }
    if (!event.organizerId) {
      throw new Error("Invalid event data");
    }
    if (event.organizerId !== userId) {
      throw new Error("Not authorized");
    }

    await prisma.registration.deleteMany({
      where: { eventId },
    });

    await prisma.event.delete({
      where: { id: eventId },
    });

    return { success: true };
  } catch (err) {
    console.error("deleteEventById Error:", err);
    throw err;
  }
};

export const registerToEvent = async (eventId: string, userId: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!user || !event) new Error("Event or user doesn't exist");

    await prisma.registration.create({
      data: {
        userId,
        eventId,
      },
    });
  } catch (err: any) {
    console.log(err);

    if (err.code === "P2002") {
      console.log("User already registered for this event");
    }
  }
};

export const deleteRegistration = async (id: string) => {
  try {
    await prisma.registration.delete({ where: { id } });
  } catch (err) {
    console.log(err);
  }
};
