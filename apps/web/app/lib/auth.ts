import NextAuth, { type NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const result = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

    })
  ],
});

export const handlers: NextAuthResult['handlers'] = result.handlers;
export const auth: NextAuthResult['auth'] = result.auth;
export const signIn: NextAuthResult['signIn'] = result.signIn;
export const signOut: NextAuthResult['signOut'] = result.signOut;

// Been getting an error when destructuring handlers, signIn, signOut, auth from NextAuth, copied the solution below for a workaround.
// Seems to only happen in case of using next-auth inside a monorepo, doesn't give an error in a normal application without a monorepo.
// https://github.com/nextauthjs/next-auth/discussions/9950#discussioncomment-11546915
