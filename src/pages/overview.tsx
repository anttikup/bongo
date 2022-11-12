import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import exerciseLib from '../backendServices/exercises';
import { siteTitle } from '../config';
import Date from '../components/date';
import Layout from '../components/layout';
import Tier from "../components/Tier";
import { useErrorMessage } from '../hooks/errorMessage';
import userService from '../services/user';
import { useStateValue, setUserProgress } from "../state";

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/lecture.module.css';


export const getStaticProps: GetStaticProps = async () => {
    const exercisesByTier = await exerciseLib.getOverview();
    console.log("exercisesByTier:", exercisesByTier);
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
    const [{ userProgress }, dispatch] = useStateValue();

    useEffect(() => {
        const fetchUserProgress = async () => {
            try {
                const userProgressFromApi = await userService.getProgress();
                console.log("userProgressFromApi:", userProgressFromApi);
                dispatch(setUserProgress(userProgressFromApi));
            } catch (e) {
                console.error(e);
                setError(e.message);
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
                <title>Overview — {siteTitle}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Overview</h2>
                <div className="exercise-table">
                    { exercisesByTier.map((tier, index) => (
                        <div key={index}>
                            <Tier boxes={tier.items} />
                            { index + 1 < exercisesByTier.length && <hr/> }
                        </div>
                    )) }
                </div>
            </section>
        </Layout>
    );
};
