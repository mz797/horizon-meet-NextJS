import { prisma } from "src/lib/prisma";

export const getRegistrationByUserId = async (userId: string) => {
  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: {
      event: true,
    },
  });

  const events = registrations.map((reg) => reg.event);
  return events;
};
