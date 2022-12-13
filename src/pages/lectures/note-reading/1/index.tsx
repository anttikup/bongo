import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Image } from 'semantic-ui-react';

import { EFFECTS_PATH, SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import Tuner from '../../../../components/Tuner';
import PlayButton from '../../../../components/PlayButton';
import CallToAction from '../../../../components/CallToAction';

import utilStyles from '../../../../styles/utils.module.css';
import styles from '../../../../styles/lecture.module.css';

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
        },
    };
};



type Props = {

};



export default function Lectures(props: Props) {
    return (
        <Layout>
            <Head>
                <title>{`Note reading 1 | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Note Reading 1</h1>
            </Header>
            <p>
                Cleff tells us where each note is located on the staff. The most common cleff is the treble cleff, or g cleff.
            </p>

            <Image style={{backgroundColor: "white", padding: "5px"}} bordered centered size="small"
                   src="https://upload.wikimedia.org/wikipedia/commons/1/18/C-major_a-minor.png" />

            <p>
                Mnemonic:
            </p>
            <p>
                The whirl of the treble cleff points to the note g¹. It is usually on the second line reading from bottom up.
            </p>
            <p>
                Mnemonic:
            </p>
            <p>
                Notes between the lines spell out the word <strong>FACE</strong> from bottom to top.
            </p>

            <Image style={{backgroundColor: "white", padding: "5px"}} bordered centered size="small"
                   src="https://upload.wikimedia.org/wikipedia/commons/f/f1/FACE_mnemonic_acronym.svg" />

            <p>
                This means the lines from bottom up are: e, g, b, d, and f.
            </p>

            <CallToAction href="/exercise/note-reading/1" />
        </Layout>
    );
};
