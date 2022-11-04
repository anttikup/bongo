import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getLecturesDataByTier } from '../lib/lectures';
import Link from 'next/link';
import Date from '../components/date';
import { GetStaticProps } from 'next';

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
}

export default Home;
