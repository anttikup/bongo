import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Image } from 'semantic-ui-react';

import { EFFECTS_PATH, SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import PianoKeyboard from '../../../../components/PianoKeyboard';

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
    return (
        <Layout>
            <Head>
                <title>{`Note names | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Note names/h1>
            </Header>

            <p>
                Note names in order are:
            </p>

            <ul>
                <li>c</li>
                <li>d</li>
                <li>e</li>
                <li>f</li>
                <li>g</li>
                <li>a</li>
                <li>b</li>
            </ul>
            <p>
                After that they continue from beginning.
            </p>

            <Image style={{backgroundColor: "white", padding: "5px"}} bordered centered size="large"
                   src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Klavier.png" />

            <PianoKeyboard />
        </Layout>
    );
};
