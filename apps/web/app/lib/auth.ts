import NextAuth, { type NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt'
import db from "@repo/db/client"

const result = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: { label: 'Phone number', type: 'text', placeholder: 'Enter you phone number', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials: any) { //FIX: Check what type credentials are.
        //TODO: Do a zod validation of the user inputs and OTP validation logic here.

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone
          }
        })

        // Logic to check if the user is an existingUser, if yes return the existingUser details otherwise return null
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number
            }
          }
          else return null
        }

        // Logic to insert new user into the database since the user is not an existingUser

        try {
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword
            }
          })
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number
          }
        }
        catch (e) {
          console.error(e);
        }
        return null

      }
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    //TODO: Fix the type here. Using any is bad.
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    }
  }
});

export const handlers: NextAuthResult['handlers'] = result.handlers;
export const auth: NextAuthResult['auth'] = result.auth;
export const signIn: NextAuthResult['signIn'] = result.signIn;
export const signOut: NextAuthResult['signOut'] = result.signOut;

// Been getting an error when destructuring handlers, signIn, signOut, auth from NextAuth, copied the solution below for a workaround.
// Seems to only happen in case of using next-auth inside a monorepo, doesn't give an error in a normal application without a monorepo.
// https://github.com/nextauthjs/next-auth/discussions/9950#discussioncomment-11546915
