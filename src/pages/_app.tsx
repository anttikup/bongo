import { SessionProvider } from "next-auth/react";

import SiteHeader from '../components/SiteHeader';
import { setExperience, setUser, setUserProgress, useStateValue } from "../state";

import type { Session } from "next-auth";
import { User, Message, isString, isUser } from '../types';
//import userService from '../services/user';

import 'semantic-ui-css/semantic.min.css';
import '../styles/global.css';

import type { AppProps } from 'next/app';
import type { Session } from "next-auth";



export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {

    return (
        <SessionProvider session={session}>
            <SiteHeader />
            <Component {...pageProps} />;
        </SessionProvider>
    );
};
