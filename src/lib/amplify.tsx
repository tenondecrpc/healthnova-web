"use client";

import { Amplify } from "aws-amplify";
import { env } from "./configAuth";
import { PropsWithChildren } from "react";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        userPoolClientId: env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      },
    },
    API: {
      REST: {
        HealthnovaApi: {
          endpoint: env.NEXT_PUBLIC_API_URL.replace(/\/$/, ""), // ensure no trailing slash
          region: env.NEXT_PUBLIC_COGNITO_REGION,
        },
      },
    },
  },
  { ssr: true },
);

export default function ConfigureAmplifyClientSide({ children }: PropsWithChildren) {
  return <>{children}</>;
}
