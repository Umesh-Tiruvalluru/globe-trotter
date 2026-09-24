import { describe, expect, it, jest } from '@jest/globals';

process.env.BETTER_AUTH_SECRET = 'test-secret';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';
process.env.GOOGLE_CLIENT_ID = '__test_google_client_id__';
process.env.GOOGLE_CLIENT_SECRET = '__test_google_client_secret__';

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
      clientId: '__test_google_client_id__',
      clientSecret: '__test_google_client_secret__',
    });
    expect(auth.options.account?.accountLinking).toEqual({ enabled: true });
  });
});
