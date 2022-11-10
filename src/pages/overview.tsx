import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import { getLecturesDataByTier } from '../lib/lectures';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/lecture.module.css';


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

type OverviewProps = {
    tiers: Array<Tier>
};

export default function Overview({ lecturesByTier }: OverviewProps) {
    return (
        <Layout home>
            <Head>
                <title>Overview — {siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>
                    Lectures to memorize musical constants.
                </p>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Lectures</h2>
                <ul className={utilStyles.list}>
                    {lecturesByTier.map((tier, index) =>
                        (
                            <div className={styles.tier}>
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
