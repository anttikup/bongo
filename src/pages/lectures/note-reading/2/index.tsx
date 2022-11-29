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
                When a note is higher or lower than the top or bottom line, short extra
                lines called leger or ledger lines are added.
            </section>
        </Layout>
    );
};
