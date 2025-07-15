import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "./session";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // @ts-expect-error
  if (!session?.user?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    // @ts-expect-error
    userId: session.user.userId,
    // @ts-expect-error
    userName: session.user.name,
  };
});

export const isAuth = async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return false;

  const session = await decrypt(cookie);

  // @ts-expect-error
  if (!session?.user?.userId) {
    return false;
  }

  return true;
};
