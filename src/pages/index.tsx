import Head from 'next/head';
import { GetStaticProps } from 'next';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getLecturesDataByTier } from '../lib/lectures';
import Date from '../components/date';

import styles from '../styles/overview.module.css';


export const getStaticProps: GetStaticProps = () => {
    const lecturesByTier = getLecturesDataByTier();
    return {
        props: {
            lecturesByTier
        }
    };
};

type LecturesData = {
    id: string
    tier: number
    topic: string
    number: number
    title: string
    date: string
};

type HomeProps = {
    lecturesByTier: LecturesData[]
};



function Home ({ lecturesByTier }: HomeProps) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
        </Layout>
    );
}

export default Home;
