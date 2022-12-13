import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Image } from 'semantic-ui-react';

import { SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import PianoKeyboard from '../../../../components/PianoKeyboard';
import CallToAction from '../../../../components/CallToAction';

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
                <h1>Note names</h1>
            </Header>

            <p>
                A piano keyboard consists of a patter of groups of two and three black keys alternating.
            </p>

            <Image style={{backgroundColor: "white", padding: "5px"}} bordered centered size="large"
                   src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Klavier.png" />

            <p>
                The names repeat for every octave. In every ocatave there are twelve keys (seven white and five black).
            </p>

            <p>
                The white keys in order are:
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
                An useful starting point is to remember that the white key between the black keys in the group of two black keys is <strong>D</strong>.
            </p>

            <PianoKeyboard size="medium" selected="d" />

            <CallToAction href="/exercise/note-reading/1" />

        </Layout>
    );
};
