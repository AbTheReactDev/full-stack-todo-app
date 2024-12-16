import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email and password are required');
                    }

                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email.toLowerCase() });

                    if (!user) {
                        throw new Error('No user found');
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error('Invalid credentials');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await dbConnect();
            if (account?.provider === 'google') {
                const isUserExists = await User.findOne({ email: user.email });
                if (!isUserExists) {
                    await User.create({
                        email: user.email,
                        name: user.name,
                        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                    });
                    return true;
                }
                return true;
            } else if (account?.provider === 'github') {
                const isUserExists = await User.findOne({ email: user.email });
                if (!isUserExists) {
                    await User.create({
                        email: user.email,
                        name: user.name,
                        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                    });
                    return true;
                }
                return true;
            }
            return true;
        },

    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin'
    }
};