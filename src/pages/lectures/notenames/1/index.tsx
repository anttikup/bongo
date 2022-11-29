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
                <title>{`Note reading 1 | ${SITE_TITLE}`}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                Note names in order are:

                - a
                - b
                - c
                - d
                - e
                - f
                - g

                After that they continue from beginning.

                An useful mnemonic to remember notes on the treble clef is the word *face* written from bottom to top between the lines.
            </section>
        </Layout>
    );
};
