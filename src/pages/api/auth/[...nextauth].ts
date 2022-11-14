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
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            //idToken: true,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
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
    },
    callbacks: {
        async jwt({ token, _user, _account, profile, _isNewUser }) {
            console.log("JWT CALLBACK: token", token, ", user:", _user, ", account:", _account, ", profile:", profile, ", isNewUser:", _isNewUser);
            if ( profile ) {
                token.userId = profile.id.toString() || profile.sub; // TODO onko ok? Id:tä ei ole aina googlella.
            }

            return token
        },
        async session({ session, token, user }) {
            console.log("SESSION CALLBACK: session:", session, ", token:", token, ", user:", user);

            console.assert(token.userId, "No token id");
            session.user.id = token.userId;


            return session
        }
    },
}

export default NextAuth(authOptions);
