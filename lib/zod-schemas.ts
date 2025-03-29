import { z } from "zod";

export const signUpSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters."),
		email: z.string().email("Invalid email."),
		password: z.string().min(8, "Password must be at least 8 characters."),
	})
	.required();

export type signUpSchemaType = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const createEventSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.string(),
	image:  z
		.custom<File>((file) => file instanceof File, {
			message: "Image is required.",
		}),
});

export type createEventSchemaType = z.infer<typeof createEventSchema>;
