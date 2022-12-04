import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Header } from "semantic-ui-react";

import { SITE_TITLE } from '../../config';
import Layout from '../../components/layout';
import Date from '../../components/date';

import exerciseLib from '../../lib/exercises';

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
    const lecturesByTopic = exerciseLib.getLecturesByTopic();
    console.log("================================= get static props ==============================");
    console.log(lecturesByTopic);
    return {
        props: {
            lecturesByTopic
        },
    };
};

type LectureData = {
    id: string
    topic: string
    level: number
    title: string
    subtitle: string
    date: string
};

type TopicDescr = {
    title: string;
    items: Array<LectureData>;
};

type LecturesProps = {
    lecturesByTopic: Array<TopicDescr>
};

export default function Lectures({ lecturesByTopic }: LecturesProps) {
    console.log(lecturesByTopic);
    return (
        <Layout>
            <Head>
                <title>{`Lectures | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Lectures</h1>
            </Header>
            <ul className={utilStyles.list}>
                {lecturesByTopic && lecturesByTopic.map((topic, index) =>
                    (
                        <div className={styles.tier} key={index}>
                            <h3 className={styles.tierHeading}>
                                { topic.title }
                            </h3>
                            <ul>
                                {topic.items.map(({ id, date, topic, level, title, subtitle }) => (
                                    <li className={utilStyles.listItem} key={id}>
                                        <Link href={`/lectures/${id}`}>
                                            {level} — {subtitle || title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </ul>
        </Layout>
    );
};
