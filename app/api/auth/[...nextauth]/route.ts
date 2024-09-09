import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error('No user found');
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
  },
} as NextAuthOptions;

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
