import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { siteTitle } from '../config';
import Layout from '../components/layout';
import Tier from "../components/Tier";
import Date from '../components/date';
import exerciseService from '../services/exercise';
import { useErrorMessage } from '../hooks/errorMessage';

import utilStyles from '../styles/utils.module.css';
import styles from '../styles/lecture.module.css';

import { TierDescr } from "../../types";



type OverviewProps = {
};

export default function Overview(props: OverviewProps) {
    const [exercisesByTier, setExercisesByTier] = useState<TierDescr[]>([]);
    const [loading, setLoading] = useState(true);
    const [setError] = useErrorMessage();


    useEffect(() => {
        const fetchExercisesByTier = async () => {
            try {
                const overviewFromApi = await exerciseService.getOverview();
                setExercisesByTier(overviewFromApi);
                setError(null);
            } catch (e) {
                console.error(e);
                setExercisesByTier([]);
                setError('Error fetching overview', (e as Error).message);
                console.log((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        void fetchExercisesByTier();
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
