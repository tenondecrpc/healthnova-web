import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_COGNITO_REGION: z.string().min(1),
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: z.string().min(1),
  NEXT_PUBLIC_COGNITO_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
