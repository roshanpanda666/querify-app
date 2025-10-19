import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { USER } from "@/app/lib/model/schema";
import mongoose from "mongoose";
import { connectionSRT } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Connect to MongoDB
        await mongoose.connect(connectionSRT);

        const { username, password } = credentials;

        // Find user by username
        const user = await USER.findOne({ username });
        if (!user) {
          throw new Error("No user found with this username");
        }

        // Compare hashed password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return the user object (NextAuth stores this in the JWT)
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET, // make sure this env is set
  pages: {
    signIn: "/login", // custom sign-in page
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
