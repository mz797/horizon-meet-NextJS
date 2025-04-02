"use server";

import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
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

    const slug = slugify(updatedEvent.title, { lower: true });
    const extention = updatedEvent.image.name.split(".").pop();
    const fileName = `${slug}-${Math.random() * 100}.${extention}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await updatedEvent.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (err) => {
      if (err) {
        throw new Error("Saving image failed");
      }
    });

    const imagePath = path.join(
      process.cwd(),
      "public",
      "images",
      path.basename(event.image)
    );

    console.log("imagePath", imagePath);

    fs.unlink(imagePath, function (err) {
      console.log(2, err);
      new Error("Can not remove previous image");
    });

    updatedEvent.image = `/images/${fileName}`;

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
