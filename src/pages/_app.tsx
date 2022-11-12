import { SessionProvider } from "next-auth/react";
import { Container } from "semantic-ui-react";

import MessageDisplay from '../components/MessageDisplay';
import SiteHeader from '../components/SiteHeader';
import { reducer, StateProvider } from "../state";

import type { Session } from "next-auth";
import type { User, Message, isString, isUser } from '../types';

import 'semantic-ui-css/semantic.min.css';
import '../styles/global.css';

import type { AppProps } from 'next/app';
import type { Session } from "next-auth";



export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={session}>
            <StateProvider reducer={reducer}>
                <Container>
                    <SiteHeader />
                    <MessageDisplay />
                    <Component {...pageProps} />
                </Container>
            </StateProvider>
        </SessionProvider>
    );
};
