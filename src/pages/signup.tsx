import { useState } from 'react';
import Head from 'next/head';
import { Button, Form, Header, Icon, Input, Loader } from "semantic-ui-react";
//import { Link } from "react-router-dom";

//import { User } from '../types';

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import { useMessage } from '../hooks/message';
import { getErrorMessage } from '../lib/error';
import signupService from '../services/signup';

import Error from "../components/Error";


type Props = {
    setError: (title: string, text: string) => void;
    setSuccess: (title: string, text: string) => void;
};

const SignupPage = ({ setError, setSuccess }: Props) => {
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
            await signupService.signup({
                username, password,
            });

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setSuccess('User registration successful', 'You can now login.');
            //history.push('/login');
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


    return (
        <Layout>
            <Head>
                <title>{`Sign up | ${SITE_TITLE}`}</title>
            </Head>

            <Header as="header">
                <h1>Sign up</h1>
            </Header>
            <section>
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

                    <Button type='submit'>Submit</Button>

                </Form>
            </section>
        </Layout>
    );
};

export default SignupPage;
