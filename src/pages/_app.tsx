import { SessionProvider } from "next-auth/react";
import { Container } from "semantic-ui-react";

import MessageDisplay from '../components/MessageDisplay';
import Main from '../components/Main';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { reducer, StateProvider } from "../state";

import 'semantic-ui-css/semantic.min.css';
import '../styles/global.css';

import type { User, UIMessage, isString, isUser } from '../types';
import type { AppProps } from 'next/app';
import type { Session } from "next-auth";



export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={session}>
            <StateProvider reducer={reducer}>
                <Main>
                    <Component {...pageProps} />
                </Main>
            </StateProvider>
        </SessionProvider>
    );
};
