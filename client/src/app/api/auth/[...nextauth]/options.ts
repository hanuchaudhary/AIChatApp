import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SessionStrategy } from "next-auth";

export const authOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email or Username",
                    type: "text",
                    placeholder: "jsmith@example.com or jsmith"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        throw new Error("Both identifier and password are required.");
                    }

                    console.log("credentials", credentials);

                    const dbUser = await db.select()
                        .from(users)
                        .where(
                            or(eq(users.email, credentials.identifier), eq(users.username, credentials.identifier))
                        );

                    console.log("dbUser", dbUser);

                    if (dbUser.length === 0) {
                        throw new Error("User not found.");
                    }

                    const foundUser = {
                        ...dbUser[0],
                        username: dbUser[0].username ?? undefined,
                    };

                    // Verify password
                    const isValidPassword = bcrypt.compare(credentials.password, foundUser.password!);
                    if (!isValidPassword) {
                        throw new Error("Invalid credentials.");
                    }

                    return foundUser;
                } catch (error) {
                    throw new Error("Authentication failed.");
                }
            }
        })
    ],
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};
