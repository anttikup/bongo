import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';

import { EFFECTS_PATH, SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import Tuner from '../../../../components/Tuner';
import PlayButton from '../../../../components/PlayButton';

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
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                Cleff tells us where each note is located on the staff. The most common cleff is the treble cleff, or g cleff.

                ![image](https://commons.wikimedia.org/wiki/Category:G_clef#/media/File:C-major_a-minor.png)

                Mnemonic:

                The whirl of the treble cleff points to the note g¹. It is usually on the second line reading from bottom up.

                Mnemonic:

                Notes between the lines spell out the word FACE from bottom to top.

                ![image](https://upload.wikimedia.org/wikipedia/commons/f/f1/FACE_mnemonic_acronym.svg)

                Thus, the lines from bottom up are: e, g, b, d, and f.

            </section>
        </Layout>
    );
};
