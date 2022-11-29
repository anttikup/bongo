import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { SITE_TITLE } from '../../config';
import Layout from '../../components/layout';
import Date from '../../components/date';

import utilStyles from '../../styles/utils.module.css';
import styles from '../../styles/lecture.module.css';


const lecturesDataByTier = [
    {
        lectures: [
            {
                id: 'notenames/1',
                date: '2000000',
                topic: 'notenames',
                number: 1,
                title: ''
            },
            {
                id: 'note-reading/1',
                date: '2000000',
                topic: 'note-reading',
                number: 1,
                title: ''
            },
            {
                id: 'tuning/1',
                date: '2000000',
                topic: 'tuning',
                number: 1,
                title: ''
            },
        ]
    },
    {
        lectures: [
            {
                id: 'note-reading/2',
                date: '2000000',
                topic: 'note-reading',
                number: 2,
                title: ''
            },
        ]
    },
];

export const getStaticProps: GetStaticProps = () => {
    const lecturesByTier = lecturesDataByTier;
    return {
        props: {
            lecturesByTier
        },
    };
};

type LectureData = {
    id: string
    topic: string
    number: number
    title: string
    date: string
};

type Tier = {
    lectures: Array<LectureData>;
};

type LecturesProps = {
    lecturesByTier: Array<Tier>
};

export default function Lectures({ lecturesByTier }: LecturesProps) {
    return (
        <Layout>
            <Head>
                <title>{`Lectures | ${SITE_TITLE}`}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h1 className={utilStyles.headingLg}>Lectures</h1>
                <ul className={utilStyles.list}>
                    {lecturesByTier && lecturesByTier.map((tier, index) =>
                        (
                            <div className={styles.tier} key={index}>
                                <div className={styles.tierHeading}>
                                    {index > 0 && <hr/>}

                                    {index + 1}
                                </div>
                                {tier.lectures.map(({ id, date, topic, number, title }) => (
                                    <li className={utilStyles.listItem} key={id}>
                                        <Link href={`/lectures/${id}`}>
                                            {topic} {number}: {title}
                                        </Link>
                                        <br />
                                    </li>
                                ))}
                            </div>
                        )
                    )}
                </ul>
            </section>
        </Layout>
    );
};
