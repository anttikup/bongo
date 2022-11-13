import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Loader, Table } from "semantic-ui-react";

import Layout, { SITE_TITLE } from '../components/layout';
import Date from '../components/date';
import userService from '../services/user';
import { useErrorMessage } from '../hooks/errorMessage';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/stats.module.css';


/* export const getStaticProps: GetStaticProps = async () => {
 *     const xpByDate = await userService.getStats();
 *     console.log("xpByDate:", xpByDate);
 *     return {
 *         props: {
 *             xpByDate
 *         },
 *     };
 * };
 *  */
type DateType = string;

type XpByDate = {
    date: DateType
    xp: number
};

type StatsProps = {
};

export default function Stats(props: StatsProps) {
    const [userStats, setUserStats] = useState<XpByDate[]>({ xp: [] });
    const [loading, setLoading] = useState(true);
    const [setError] = useErrorMessage();

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const userStatsFromApi = await userService.getStats();
                setUserStats(userStatsFromApi);
                setError(null);
            } catch (e) {
                console.error(e);
                setUserStats([]);
                setError('Error fetching overview', (e as Error).message);
                console.log((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        void fetchUserStats();
    }, []);

    return (
        <Layout home>
            <Head>
                <title>Stats — {SITE_TITLE}</title>
            </Head>
            <main className="stats-page">
                <Header as="header">
                    <h2>Stats</h2>
                </Header>
                { loading
                  ? <Loader active/>
                  : <div className="stats">
                      { userStats && userStats.xp &&
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>XP</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { userStats.xp.map((row, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{row.date}</Table.Cell>
                                        <Table.Cell>{row.value}</Table.Cell>
                                    </Table.Row>
                                )) }
                            </Table.Body>
                        </Table>
                      }
                  </div>
                }
            </main>
        </Layout>
    );
};
