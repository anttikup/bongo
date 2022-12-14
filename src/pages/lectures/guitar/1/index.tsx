import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Image } from 'semantic-ui-react';

import { SITE_TITLE } from '../../../../config';
import Layout from '../../../../components/layout';
import SVGFretboard from '../../../../components/SVGFretboard';
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

    const knobs = [
        {
            id: 'master',
            string: 5,
            fret: 2,
            text: 'e',
            color: 'black',
            selectable: false,
        },
    ];


    return (
        <Layout>
            <Head>
                <title>{`Guitar | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Guitar</h1>
            </Header>

            <p>

            </p>


            <SVGFretboard knobs={knobs} minLastFret={4} drawFretTitles={false} />

            <CallToAction href="/exercise/guitar/1" />

        </Layout>
    );
};
