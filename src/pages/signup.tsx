import { useState, MouseEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Form, Header, Icon, Input, Loader } from "semantic-ui-react";
import { signIn } from "next-auth/react";

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import { useMessage } from '../hooks/message';
import { getErrorMessage } from '../lib/error';
import signupService from '../services/signup';

import { UIMessage } from '../types';
//import '../styles/signup.module.css';

type Props = {
};

const SignupPage = (props: Props) => {
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [_, setMessage] = useMessage();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await signIn('login', {
                username,
                password,
                signup: true,
                callbackUrl: 'http://localhost:3000/overview',
            });

            if ( !response ) {
                return;
            }

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            if ( response.ok ) {
                setMessage({
                    type: 'success',
                    title: 'User registration successful',
                    text: 'You can now login.'
                });
            } else {
                console.error(response.error);
                setMessage({
                    type: 'error',
                    title: 'Error signin up',
                    text: response.error
                } as UIMessage);
            }
        } catch (e) {
            setMessage({
                type: 'error',
                title: "Error signin up",
                text: getErrorMessage(e)
            });
        } finally {
            setLoading(false);
        }

    };

    const onPasswordChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(target.value);
    };

    const onConfirmPasswordChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(target.value);
    };


    const passwordsMatch = (password === confirmPassword);

    const handleSignin = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        signIn(undefined, {
            callbackUrl: 'http://localhost:3000/overview',
        });
    };

    return (
        <Layout>
            <Head>
                <title>{`Sign up | ${SITE_TITLE}`}</title>
            </Head>

            <Header as="header">
                <h1>Sign up</h1>
            </Header>
            <section style={{ position: 'relative' }}>
                <p>
                    <span>
                        You can also sign in with Google or GitHub account. <Link href="/login" onClick={handleSignin}>Log in</Link> <i className="bang">!</i>
                    </span>
                </p>

                { loading && <Loader active /> }

                <Form id="signup-form" onSubmit={handleSignup}>

                    <Form.Field>
                        <label>User name: </label>
                        <Input
                            placeholder=""
                            onChange={({ target }) => setUsername(target.value)}
                            value={username}
                        />
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
                            onChange={onPasswordChange}
                            value={password}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Confirm password: </label>
                        <Input
                            type={showPassword ? "text" : "password" }
                            icon={
                                <Icon
                                    name='check'
                                          color={passwordsMatch ? "green" : "grey"}
                                />
                            }
                            onChange={onConfirmPasswordChange}
                            value={confirmPassword}
                        />
                    </Form.Field>

                    <Button primary type='submit'>Submit</Button>

                </Form>
            </section>
        </Layout>
    );
};

export default SignupPage;
