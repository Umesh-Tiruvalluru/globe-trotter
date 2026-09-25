import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from '@repo/database';

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET environment variable is required. The value can be generated using the bash cmd 'openssl rand -base64 32'.",
  );
}

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

function getGoogleProvider() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return undefined;
  }
  return { clientId, clientSecret };
}

const googleProvider = getGoogleProvider();

const trustedProviders: string[] = googleProvider ? ['google'] : [];

export const auth = betterAuth({
  secret,
  baseURL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: googleProvider ? { google: googleProvider } : undefined,
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders,
    },
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'learner', input: false },
    },
  },
  trustedOrigins: [baseURL],
});
