import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
//import TwitterProvider from "next-auth/providers/twitter"
//import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
//import EmailProvider from "next-auth/providers/email"

import CredentialsProvider from "next-auth/providers/credentials";

import * as auth from '../../../lib/auth';
import { getErrorMessage } from '../../../lib/error';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        /*EmailProvider({
           server: process.env.EMAIL_SERVER,
           from: process.env.EMAIL_FROM,
           }),*/
        // Temporarily removing the Apple provider from the demo site as the
        // callback URL for it needs updating due to Vercel changing domains
        /* Providers.Apple({
         *     clientId: process.env.APPLE_ID,
         *     clientSecret: {
         *         appleId: process.env.APPLE_ID,
         *         teamId: process.env.APPLE_TEAM_ID,
         *         privateKey: process.env.APPLE_PRIVATE_KEY,
         *         keyId: process.env.APPLE_KEY_ID,
         *     },
         * }), */

        /* FacebookProvider({
         *     clientId: process.env.FACEBOOK_ID,
         *     clientSecret: process.env.FACEBOOK_SECRET,
         * }), */
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            //idToken: true,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
            idToken: true,
        }),
        /* TwitterProvider({
         *     clientId: process.env.TWITTER_ID,
         *     clientSecret: process.env.TWITTER_SECRET,
         * }),
         * Auth0Provider({
         *     clientId: process.env.AUTH0_ID,
         *     clientSecret: process.env.AUTH0_SECRET,
         *     issuer: process.env.AUTH0_ISSUER,
         * }), */
        CredentialsProvider({
            id: "login",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "example" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if ( !credentials ) {
                    throw new Error("credentials empty");
                }

                try {
                    return await auth.loginOrSignup(credentials);
                } catch (error) {
                    console.error(error);
                    throw new Error(getErrorMessage(error));
                }
            },
        }),
    ],
    theme: {
        colorScheme: "light",
        brandColor: "#dd5522",
        logo: "/images/icons/687-musical-score.svg",
        buttonText: "#2255dd",
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {

            return token
        },
        async session({ session, token, user }) {
            console.assert(token.sub, "No token id");
            // first call
            if ( !session.user.id ) {
                console.log("SESSION CALLBACK:\n  session:", session, "\n  token:", token, "\n  user:", user);
                session.user.id = token.sub || "";
            }

            return session
        }
    },
}

export default NextAuth(authOptions);
