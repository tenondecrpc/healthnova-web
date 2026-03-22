import { z } from "zod";

const envSchema = z.object({
  HOST: z.string().url(),
});

export const env = envSchema.parse({
  HOST: process.env.HOST,
});
