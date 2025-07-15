"use server";

import bcrypt from "bcrypt";

import { prisma } from "./prisma";
import {
  signUpSchema,
  loginSchema,
  type signUpSchemaType,
  type loginSchemaType,
} from "./zod-schemas";
import { createSession } from "./session";

export const signUp = async (values: signUpSchemaType) => {
  const validation = signUpSchema.safeParse(values);
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const hashedPassword = await bcrypt.hash(values.password, 10);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (!!user) {
      return { errors: { email: ["This email is taken."] } };
    }
  } catch (err) {
    console.log(6, err);
    throw new Error("Something went wrong");
  }

  try {
    await prisma.user.create({
      data: { ...values, password: hashedPassword },
    });
  } catch (err) {
    console.log(7, err);
    throw new Error("Something went wrong");
  }

  return { success: true };
};

export const login = async (values: loginSchemaType) => {
  const { email, password } = values;

  const validation = loginSchema.safeParse(values);
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) return { errors: { general: "Incorrect email or password" } };

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return { errors: { general: "Incorrect email or password" } };

  await createSession(user.id, user.role, user.name);

  return { success: true };
};
