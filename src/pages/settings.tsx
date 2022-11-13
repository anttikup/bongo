import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Checkbox, Dropdown, Form, Header, Input, Segment, Transition } from "semantic-ui-react";

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import { setUser, useStateValue } from "../state";

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/overview.module.css';

const notenameOptions = [
    {
        key: 'English',
        text: 'English (b♭, b)',
        value: 'English',
        //image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
        key: 'German',
        text: 'German (b, h)',
        value: 'German',
        //image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
        key: 'Romance',
        text: 'Romance (si)',
        value: 'Romance',
        //image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
]

type Props = {

};

const SettingsPage = (props: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <Layout home>
            <Head>
                <title>{`Settings | ${SITE_TITLE}`}</title>
            </Head>

            <Header as="h1">Settings</Header>
            <Form>
                <Segment>
                    <Form.Field>
                        <label>User name </label>
                        <Input style={{ float: 'right' }} />
                    </Form.Field>
                    <p>This user name is visible to other users.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Send notifications</label>
                        <Checkbox
                            toggle
                            style={{ float: 'right' }}
                            value="send notifications"
                            checked={visible}
                            onChange={(e, data) => setVisible(data.checked)}
                        />
                    </Form.Field>
                    <Transition.Group animation="slide down" duration={200}>
                        {visible && (
                            <Form.Field>
                                <label>Email address </label>
                                <Input style={{ float: 'right' }} />
                            </Form.Field>
                        )}
                    </Transition.Group>
                    <p>Enable to get notifications to your email.</p>
                </Segment>


                <Header as="h2">Exercises</Header>

                <Segment>
                    <Form.Field>
                        <label>Note names </label>
                        <Dropdown
                            inline
                            options={notenameOptions}
                            defaultValue={notenameOptions[0].value}
                            style={{ float: 'right' }}
                        />
                    </Form.Field>
                    <p>Select the standard to use for note names.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Audio</label>
                        <Checkbox toggle style={{ float: 'right' }} />
                    </Form.Field>
                    <p>Disable this, if you don't want to have any exercises with audio.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Images</label>
                        <Checkbox toggle style={{ float: 'right' }} />
                    </Form.Field>
                    <p>Disable this, if you don't want to have any exercises with images.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Microphone</label>
                        <Checkbox toggle style={{ float: 'right' }} />
                    </Form.Field>
                    <p>Disable this, if you don't want to have any exercises that uses microphone.</p>
                </Segment>
            </Form>
        </Layout>
    );
};

export default SettingsPage;
