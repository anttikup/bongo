import { useState } from 'react';
import { signIn, useSession } from "next-auth/react"
import Link from 'next/link';
import Router from 'next/router'
import { Button, Form, Header, Icon, Input, Loader } from "semantic-ui-react";

//import { User } from '../../types';

//import loginService from '../../services/login';
//import userService from '../../services/user';

import { setUser, useStateValue } from "../state";
import Error from "../components/Error";

type Props = {
    setError: (title: string, text: string) => void;
};

const LoginPage = ({ setError }: Props) => {

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const user = await loginService.login({
                username, password,
            });

            window.localStorage.setItem('user', JSON.stringify(user));
            userService.setToken(user.token);
            setUsername('');
            setPassword('');
            dispatch(setUser(user));
            Rotuer.push('/overview');
        } catch (exception) {
            setError('Wrong credentials', (exception as Error).message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <main>
            <Header as="h2">
                Login
            </Header>
            <section>
                { loading && <Loader active /> }

                <Form id="login-form" onSubmit={handleLogin}>

                    <p id="no-account-box">
                        <span>
                            No account? <Link href="/signup">Sign up</Link> <i className="bang">!</i>
                        </span>
                    </p>

                    <Form.Field>
                        <label>User name: </label>
                        <Input minLength={1} placeholder="" onChange={({ target }) => setUsername(target.value)}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Password: </label>
                        <Input
                            type={showPassword ? "text" : "password" }
                            icon={
                                <Icon
                                    name="eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                          color={showPassword ? "teal" : "grey"}
                                          link
                                />
                            }
                            onChange={({ target }) => setPassword(target.value)}
                            value={password}
                        />
                    </Form.Field>

                    <Button type='submit'>Submit</Button>

                </Form>
            </section>
        </main>
    );
};

export default LoginPage;
