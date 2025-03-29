"use server";

import fs from "node:fs";
import slugify from "slugify";
import { prisma } from "./prisma";
import { verifySession } from "./dal";

export const getEvents = async () => {
  return await prisma.event.findMany();
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

  const slug = slugify(event.title, { lower: true });
  const extention = event.image.name.split(".").pop();
  const fileName = `${slug}-${Math.random() * 100}.${extention}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await event.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (err) => {
    if (err) {
      throw new Error("Saving image failed");
    }
  });

  event.image = `/images/${fileName}`;

  await prisma.event.create({
    data: { ...event, date: new Date(event.date), organizerId: userId },
  });

  return { success: true };
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
