import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Checkbox, Dropdown, Form, Header, Input, Segment, Transition } from 'semantic-ui-react';

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import { useMessage } from '../hooks/message';
import { getErrorMessage } from '../lib/error';
import userService from '../services/user';
import { setUser, useStateValue, setUserSettings } from '../state';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/settings.module.css';

import type { MouseEvent, FormEvent } from 'react';
import type { NotenamePreference, User } from '../types';


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
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [sendReminders, setSendReminders] = useState(false);
    const [audioExercisesEnabled, setAudioExercisesEnabled] = useState(false);
    const [imageExercisesEnabled, setImageExercisesEnabled] = useState(false);
    const [microphoneExercisesEnabled, setMicrophoneExercisesEnabled] = useState(false);
    const [notenamePreference, setNotenamePreference] = useState<NotenamePreference>('b');
    const [_, setMessage] = useMessage();

    useEffect(() => {
        const fetchUserSettings = async () => {
            setLoading(true);
            try {
                const userSettingsFromApi = await userService.getSettings();
                dispatch(setUserSettings(userSettingsFromApi));
                setUsername(userSettingsFromApi.username || "");
                setEmail(userSettingsFromApi.email || "");
                setNotenamePreference(userSettingsFromApi.notenamePreference || 'b');
                setSendReminders(!!userSettingsFromApi.sendReminders);
                setAudioExercisesEnabled(!userSettingsFromApi.noAudioExercises);
                setImageExercisesEnabled(!userSettingsFromApi.noImageExercises);
                setMicrophoneExercisesEnabled(!userSettingsFromApi.noMicrophoneExercises);
            } catch (e) {
                console.error(e);
                setMessage({
                    type: 'error',
                    title: "Error fetching user settings",
                    text: getErrorMessage(e)
                });
                setUserSettings({});
            } finally {
                setLoading(false);
            }
        };

        if ( user ) {
            void fetchUserSettings();
        }
    }, []);

    const handleSaveClicked = async (event: FormEvent<HTMLFormElement>) => {
        const data = {
            username,
            email,
            sendReminders: sendReminders,
            notenamePreference: notenamePreference === 'b' ? undefined : notenamePreference as NotenamePreference,
            noAudioExercises: !audioExercisesEnabled,
            noImageExercises: !imageExercisesEnabled,
            noMicrophoneExercises: !microphoneExercisesEnabled,
        } as Record<string, unknown>;

        type key = keyof typeof data;

        Object.keys(data).forEach(
            (key: key) => !data[key] && delete data[key]
        );

        try {
            const newUserSettings = await userService.updateSettings(data);
            console.log("updated user:", newUserSettings);
            setMessage({ type: 'success', title: 'Saved', text: 'Saved settings successfully' });
            setUserSettings(newUserSettings);
        } catch ( err ) {
            console.error(err);
            setMessage({
                type: 'error',
                title: 'Error updating settings',
                text: getErrorMessage(err)
            });
        }

        if ( username ) {
            dispatch(setUser({ ...user, username } as User));
        }
    };


    return (
        <Layout>
            <Head>
                <title>{`Settings | ${SITE_TITLE}`}</title>
            </Head>

            <Header as="header">
                <h1>Settings</h1>
            </Header>
            <Form onSubmit={handleSaveClicked}>
                <Segment>
                    <Form.Field>
                        <label>User name </label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Field>
                    <p className={styles.infoText}>This user name is visible to other users.</p>
                </Segment>

                <Segment>
                    <Form.Field className={styles.sameLine}>
                        <label className={styles.label}>Send reminders</label>
                        <Checkbox
                            toggle
                            value="send reminders"
                            checked={sendReminders}
                            onChange={(e, data) => setSendReminders(data.checked || false)}
                        />
                    </Form.Field>
                    <Transition.Group animation="slide down" duration={200}>
                        {sendReminders && (
                            <Form.Field className={styles.sameLine}>
                                <label>Email address </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e, data) => setEmail(data.value)}
                                />
                            </Form.Field>
                        )}
                    </Transition.Group>
                    <p className={styles.infoText}>Enable and enter an email address to get reminders to your email.</p>
                </Segment>


                <Header as="h2">Exercises</Header>

                <Segment>
                    <Form.Field className={styles.sameLine}>
                        <label className={styles.label}>Note names </label>
                        <Dropdown
                            inline
                            options={notenameOptions}
                            value={notenamePreference}
                            onChange={(e, data) => setNotenamePreference(data.value as NotenamePreference)}
                        />
                    </Form.Field>
                    <p className={styles.infoText}>Select the convention to use for note names.</p>
                </Segment>

                <Segment>
                    <Form.Field className={styles.sameLine}>
                        <label className={styles.label}>Audio</label>
                        <Checkbox
                            toggle
                            id="enable-audio"
                            checked={audioExercisesEnabled}
                            onChange={(e, data) => setAudioExercisesEnabled(data.checked || false)}
                        />
                    </Form.Field>
                    <p className={styles.infoText}>Disable this, if you don't want to do any exercises with audio.</p>
                </Segment>

                <Segment>
                    <Form.Field className={styles.sameLine}>
                        <label className={styles.label}>Images</label>
                        <Checkbox
                            toggle
                            id="enable-images"
                            checked={imageExercisesEnabled}
                            onChange={(e, data) => setImageExercisesEnabled(data.checked || false)}
                        />
                    </Form.Field>
                    <p className={styles.infoText}>Disable this, if you don't want to do any exercises with images.</p>
                </Segment>

                <Segment>
                    <Form.Field className={styles.sameLine}>
                        <label className={styles.label}>Microphone</label>
                        <Checkbox
                            toggle
                            id="enable-mic"
                            checked={microphoneExercisesEnabled}
                            onChange={(e, data) => setMicrophoneExercisesEnabled(data.checked || false)}
                        />
                    </Form.Field>
                    <p className={styles.infoText}>Disable this, if you don't want to do any exercises that uses microphone.</p>
                </Segment>
                <Button type="submit">Save</Button>
            </Form>
        </Layout>
    );
};

export default SettingsPage;
