import { useEffect } from 'react';
import Router from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import { setUser, useStateValue } from "../state";

/* type Props = {
 *     setError: (title: string, text: string) => void;
 * };
 *  */
const LogoutPage = (/*{ setError }: Props*/) => {
    const [, dispatch] = useStateValue();

    useEffect(() => {
        dispatch(setUser(null));
        localStorage.removeItem('user');
        Router.push("/");

    }, []);

    return (
        <main>
            <Header as="header">
                <h2>
                    Logout
                </h2>
            </Header>
            <section>
                <Loader active />;
            </section>
        </main>
    );
};

export default LogoutPage;
