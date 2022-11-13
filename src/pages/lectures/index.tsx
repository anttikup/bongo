import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { SITE_TITLE } from '../../config';
import Layout from '../../components/layout';
import Date from '../../components/date';
import { getLecturesDataByTier } from '../../lib/lectures';

import utilStyles from '../../styles/utils.module.css';
import styles from '../../styles/lecture.module.css';


export const getStaticProps: GetStaticProps = () => {
    const lecturesByTier = getLecturesDataByTier();
    return {
        props: {
            lecturesByTier
        },
    };
};

type LectureData = {
    title: string
    date: string
    contentHtml: string
};

type Tier = {
    lectures: Array<LectureData>
};

type LecturesProps = {
    tiers: Array<Tier>
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
                    {lecturesByTier.map((tier, index) =>
                        (
                            <div className={styles.tier} key={index}>
                                <div className={styles.tierHeading}>
                                    {index > 0 && <hr/>}

                                    {index + 1}
                                </div>
                                {tier.map(({ id, date, topic, number, title }) => (
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
