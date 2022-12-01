import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
//import TwitterProvider from "next-auth/providers/twitter"
//import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
//import EmailProvider from "next-auth/providers/email"


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
    ],
    theme: {
        colorScheme: "light",
        brandColor: "#dd5522",
        logo: "/images/687-musical-score.svg",
        buttonText: "#2255dd",
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            // Can be called many times. If first call
            if ( !token.idToken ) {
                //console.log("JWT CALLBACK:\n  token:", token, "\n  user:", user, "\n  account:", account,
                //            "\n  profile:", profile, "\n  isNewUser:", isNewUser);
                // TODO onko ok? Id:tä ei ole aina googlella. Sub näyttää olevan sama arvo.
                token.idToken = (profile?.id || profile?.sub || token.sub || 0).toString();
            }

            return token
        },
        async session({ session, token, user }) {
            console.assert(token.idToken, "No token id");
            // first call
            if ( !session.user.id ) {
                //console.log("SESSION CALLBACK:\n  session:", session, "\n  token:", token, "\n  user:", user);
                session.user.id = token.idToken || "x";
            }

            return session
        }
    },
}

export default NextAuth(authOptions);
