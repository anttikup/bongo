import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Container } from "semantic-ui-react";

import { setUser, useStateValue } from '../state';

import MessageDisplay from '../components/MessageDisplay';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import userService from '../services/user';
import { useErrorMessage } from '../hooks/errorMessage';
import { getErrorMessage } from '../lib/error';

import styles from '../styles/Main.module.css';


type Props = {
    children: React.ReactNode;
};

const Main = ({ children }: Props) => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [setError] = useErrorMessage();
    const [{ }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userFromApi = await userService.getUser();
                dispatch(setUser(userFromApi));
            } catch (e) {
                console.error(e);
                setError('Error fetching user', getErrorMessage(e));
            } finally {
                setLoading(false);
            }
        };

        if ( session ) {
            void fetchUser();
        }
    }, [session]);

    return (
        <Container className="main">
            <SiteHeader />
            <MessageDisplay />
            { children }
            <SiteFooter />
        </Container>
    );
};

export default Main;
