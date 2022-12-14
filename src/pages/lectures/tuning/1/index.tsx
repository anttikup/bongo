import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header } from "semantic-ui-react";

import { EFFECTS_PATH, SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import Tuner from '../../../../components/Tuner';
import PlayButton from '../../../../components/PlayButton';

import utilStyles from '../../../../styles/utils.module.css';
import styles from '../../../../styles/lecture.module.css';

/* export const getStaticProps: GetStaticProps = () => {
 *     return {
 *         props: {
 *         },
 *     };
 * };
 *
 *  */

type Props = {

};



export default function Lectures(props: Props) {
    const [sinewaveValue, setSinewaveValue] = useState(0);
    const [elpnoValue, setElpnoValue] = useState(0);

    return (
        <Layout>
            <Head>
                <title>{`Tuning 1 | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Tuning 1</h1>
            </Header>
            <p>
                When two pitches are close to each other, but not exactly the same, there is a noticeable{' '}
                <strong>wobbling</strong> effect. This is especially audible when the sound is a <em>sinewave</em>.
            </p>

            <p>
                Sinewave is the simplest kind of audio wave that all other sounds can be build of.
            </p>

            <p>
                Press the button to play sine wave of 440 Hz. Then move the slider to play another sine wave. When the{' '}
                sounds match exactly (at 34) the wobbling disappears.
            </p>

            <p>
                <label> Sine wave at 440 Hz{' '}<PlayButton src={EFFECTS_PATH("sine440.mp3")} /></label>
            </p>
            <label>Slightly off sine wave</label>
            <Tuner src={EFFECTS_PATH("sine440.mp3")} deviation={-34} value={sinewaveValue} onChange={setSinewaveValue} />

            <p>
                When the sound is not a sine wave, the wobbling is not as pronounced, but can be still heard.
            </p>

            <p>
                <label> Electric piano 440 Hz{' '}<PlayButton src={EFFECTS_PATH("tune-elpno.mp3")} /></label>
            </p>
            <label>Slightly off</label>
            <Tuner src={EFFECTS_PATH("tune-elpno.mp3")} deviation={-34} value={elpnoValue} onChange={setElpnoValue} />

            <CallToAction href="/exercise/tuning/1" />
        </Layout>
    );
};
