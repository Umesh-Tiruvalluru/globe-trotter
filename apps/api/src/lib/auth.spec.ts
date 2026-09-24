import { describe, expect, it, jest } from '@jest/globals';

process.env.BETTER_AUTH_SECRET = 'test-secret';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';
process.env.GOOGLE_CLIENT_ID = 'google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'google-client-secret';

jest.unstable_mockModule('better-auth/minimal', () => ({
  betterAuth: jest.fn((options) => ({ options })),
}));
jest.unstable_mockModule('@repo/database', () => ({ db: {} }));
jest.unstable_mockModule('@better-auth/drizzle-adapter', () => ({
  drizzleAdapter: jest.fn(() => ({})),
}));

describe('Better Auth social sign-in configuration', () => {
  it('registers Google and keeps same-email account linking enabled', async () => {
    const { auth } = await import('./auth');

    expect(auth.options.socialProviders?.google).toEqual({
      clientId: 'google-client-id',
      clientSecret: 'google-client-secret',
    });
    expect(auth.options.account?.accountLinking).toEqual({ enabled: true });
  });
});
