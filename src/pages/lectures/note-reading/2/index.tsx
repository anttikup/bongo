import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Image } from 'semantic-ui-react';

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
                <title>{`Note reading 2 | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Note Reading 2</h1>
            </Header>
            <p>
                When a note is higher or lower than the top or bottom line, short extra
                lines called leger or ledger lines are added.
            </p>

            <Image style={{backgroundColor: "white", padding: "5px"}} bordered centered size="small"
                   src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Music-ledger.svg" />
        </Layout>
    );
};
