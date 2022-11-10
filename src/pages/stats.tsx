import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';

import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date';
import { getUserStats } from '../lib/user';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/stats.module.css';


export const getStaticProps: GetStaticProps = () => {
    const xpByDate = getUserStats();
    console.log("xpByDate:", xpByDate);
    return {
        props: {
            xpByDate
        },
    };
};

type DateType = string;

type XpByDate = {
    date: DateType
    xp: number
};

type StatsProps = {
    xpByDate: Array<XpByDate>
};

export default function Stats({ xpByDate }: StatsProps) {
        return (
            <Layout home>
                <Head>
                    <title>Stats — {siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>
                        Lectures to memorize musical constants.
                    </p>
                </section>
                <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                    <h2 className={utilStyles.headingLg}>Lectures</h2>
                    <table className={utilStyles.table}>
                        {xpByDate.map(({ date, xp }) => (
                            <tr className={utilStyles.tr} key={date}>
                                <th className={utilStyles.th}>
                                    { date }
                                </th>
                                <td className={utilStyles.td}>
                                    { xp }
                                </td>
                            </tr>
                        ))}
                    </table>
                </section>
            </Layout>
        );
};
