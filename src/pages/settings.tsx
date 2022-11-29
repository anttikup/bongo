import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Checkbox, Dropdown, Form, Header, Input, Segment, Transition } from 'semantic-ui-react';

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import { useMessage } from '../hooks/message';
import userService from '../services/user';
import { setUser, useStateValue, setUserSettings } from '../state';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/overview.module.css';

import type { NotenamePreference } from '../types';


const notenameOptions = [
    {
        key: 'English',
        text: 'English (b♭, b)',
        value: 'b',
        //image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
        key: 'German',
        text: 'German (b, h)',
        value: 'h',
        //image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
        key: 'Romance',
        text: 'Romance (si♭, si)',
        value: 'si',
        //image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
]

type Props = {

};

const SettingsPage = (props: Props) => {
    const [{ user, userSettings }, dispatch] = useStateValue();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [audioExercisesEnabled, setAudioExercisesEnabled] = useState(false);
    const [imageExercisesEnabled, setImageExercisesEnabled] = useState(false);
    const [microphoneExercisesEnabled, setMicrophoneExercisesEnabled] = useState(false);
    const [notenamePreference, setNotenamePreference] = useState<NotenamePreference>('b');
    const [_, setMessage] = useMessage();

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const userSettingsFromApi = await userService.getUserSettings();
                dispatch(setUserSettings(userSettingsFromApi));
                setUsername(userSettingsFromApi.username || "");
                setEmail(userSettingsFromApi.email || "");
                setNotenamePreference(userSettingsFromApi.notenamePreference || 'b');
                setReminderEnabled(!!userSettingsFromApi.reminderEnabled);
                setAudioExercisesEnabled(!userSettingsFromApi.noAudioExercises);
                setImageExercisesEnabled(!userSettingsFromApi.noImageExercises);
                setMicrophoneExercisesEnabled(!userSettingsFromApi.noMicrophoneExercises);
            } catch (e) {
                console.error(e);
                setMessage({ type: 'error', title: "Error fetching user settings", text: e.message });
                setUserSettings({});
            } finally {
                setLoading(false);
            }
        };

        void fetchUserSettings();
    }, []);

    const handleSaveClicked = async (event) => {
        const data = {
            username,
            email,
            notenamePreference: notenamePreference === 'b' ? undefined : notenamePreference as NotenamePreference,
            noAudioExercises: !audioExercisesEnabled,
            noImageExercises: !imageExercisesEnabled,
            noMicrophoneExercises: !microphoneExercisesEnabled,
        };

        Object.keys(data).forEach(
            key => !data[key] && delete data[key]
        );

        try {
            const newUserSettings = await userService.updateUserSettings(data);
            console.log("updated user:", newUserSettings);
            setMessage({ type: 'success', title: 'Saved', text: 'Saved settings successfully' });
            setUserSettings(newUserSettings);
        } catch ( err ) {
            console.error(err);
            setMessage({ type: 'error', title: 'Error updating settings', text: err.message });
        }

        if ( username ) {
            dispatch(setUser({ ...user, username }));
        }
    };


    return (
        <Layout>
            <Head>
                <title>{`Settings | ${SITE_TITLE}`}</title>
            </Head>

            <Header as="h1">Settings</Header>
            <Form onSubmit={handleSaveClicked}>
                <Segment>
                    <Form.Field>
                        <label>User name </label>
                        <Input style={{ float: 'right' }} value={username} onChange={(e) => setUsername(e.target.value)} />
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
                            checked={reminderEnabled}
                            onChange={(e, data) => setReminderEnabled(data.checked)}
                        />
                    </Form.Field>
                    <Transition.Group animation="slide down" duration={200}>
                        {reminderEnabled && (
                            <Form.Field>
                                <label>Email address </label>
                                <Input
                                    type="email"
                                    style={{ float: 'right' }}
                                    value={email}
                                    onChange={(e, data) => setEmail(data.value)}
                                />
                            </Form.Field>
                        )}
                    </Transition.Group>
                    <p>Enable and enter an email address to get reminders to your email.</p>
                </Segment>


                <Header as="h2">Exercises</Header>

                <Segment>
                    <Form.Field>
                        <label>Note names </label>
                        <Dropdown
                            inline
                            options={notenameOptions}
                            style={{ float: 'right' }}
                            value={notenamePreference}
                            onChange={(e, data) => setNotenamePreference(data.value as NotenamePreference)}
                        />
                    </Form.Field>
                    <p>Select the standard to use for note names.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Audio</label>
                        <Checkbox
                            toggle
                            id="enable-audio"
                            style={{ float: 'right' }}
                            checked={audioExercisesEnabled}
                            onChange={(e, data) => setAudioExercisesEnabled(data.checked)}
                        />
                    </Form.Field>
                    <p>Disable this, if you don't want to do any exercises with audio.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Images</label>
                        <Checkbox
                            toggle
                            id="enable-images"
                            style={{ float: 'right' }}
                            checked={imageExercisesEnabled}
                            onChange={(e, data) => setImageExercisesEnabled(data.checked)}
                        />
                    </Form.Field>
                    <p>Disable this, if you don't want to do any exercises with images.</p>
                </Segment>

                <Segment>
                    <Form.Field>
                        <label>Microphone</label>
                        <Checkbox
                            toggle
                            id="enable-mic"
                            style={{ float: 'right' }}
                            checked={microphoneExercisesEnabled}
                            onChange={(e, data) => setMicrophoneExercisesEnabled(data.checked)}
                        />
                    </Form.Field>
                    <p>Disable this, if you don't want to do any exercises that uses microphone.</p>
                </Segment>
                <Button type="submit">Save</Button>
            </Form>
        </Layout>
    );
};

export default SettingsPage;
