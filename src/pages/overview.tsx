import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Header } from "semantic-ui-react";

import exerciseLib from '../lib/exercises';
import { SITE_TITLE } from '../config';
import Date from '../components/date';
import Layout from '../components/layout';
import LockDivider from "../components/LockDivider";
import Tier from "../components/Tier";
import { useErrorMessage } from '../hooks/errorMessage';
import { getErrorMessage } from '../lib/error';
import userService from '../services/user';
import { useStateValue, setUserProgress } from "../state";

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/overview.module.css';

import type { TierDescr } from '../types';

export const getStaticProps: GetStaticProps = async () => {
    const exercisesByTier = await exerciseLib.getOverview();
    return {
        props: {
            exercisesByTier
        },
    };
};


type OverviewProps = {
    exercisesByTier: TierDescr[]
};

export default function Overview({ exercisesByTier }: OverviewProps) {
    const [loading, setLoading] = useState(true);
    const [setError] = useErrorMessage();
    const [{ }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const userProgressFromApi = await userService.getProgress();
                dispatch(setUserProgress(userProgressFromApi));
            } catch (e) {
                console.error(e);
                setError("Error fetching user progress", getErrorMessage(e));
                setUserProgress({});
            } finally {
                setLoading(false);
            }
        };

        void fetchUserProgress();
    }, []);


    return (
        <Layout home>
            <Head>
                <title>{`Overview | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h1>Overview</h1>
            </Header>
            <div className="exercise-table">
                { exercisesByTier.map((tier, index) => (
                    <div key={index}>
                        <Tier boxes={tier.items} />
                        { index + 1 < exercisesByTier.length && <LockDivider open={false} /> }
                    </div>
                )) }
            </div>
        </Layout>
    );
};
