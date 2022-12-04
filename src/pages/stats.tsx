import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Header, Loader, Table } from "semantic-ui-react";

import { SITE_TITLE } from '../config';
import Layout from '../components/layout';
import Date from '../components/date';
import userService from '../services/user';
import { useErrorMessage } from '../hooks/errorMessage';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/stats.module.css';

import type { UserStats, XpByDate } from '../types';


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


type StatsProps = {
};

export default function Stats(props: StatsProps) {
    const [userStats, setUserStats] = useState<UserStats>({});
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
                setUserStats({});
                setError('Error fetching overview', (e as Error).message);
                console.log((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        void fetchUserStats();
    }, []);


    const dates = userStats && userStats.xpHistory ? Object.keys(userStats.xpHistory).sort() : [];

    return (
        <Layout home>
            <Head>
                <title>{`Stats | ${SITE_TITLE}`}</title>
            </Head>
            <main className="stats-page">
                <Header as="header">
                    <h1>Stats</h1>
                </Header>
                { loading
                  ? <Loader active/>
                  : <div className="stats">
                      { userStats && userStats.xpHistory &&
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>XP</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { dates.map((date, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{date}</Table.Cell>
                                        <Table.Cell>{userStats?.xpHistory && userStats.xpHistory[date]}</Table.Cell>
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
