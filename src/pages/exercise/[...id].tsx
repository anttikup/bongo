import { useEffect, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import { SITE_TITLE } from '../../config';
import ExArea from '../../components/ExArea';
import Health from '../../components/Health';
import Layout from '../../components/layout';
import { useErrorMessage } from '../../hooks/errorMessage';
import { getAllExerciseIds } from '../../lib/exercises';
import exerciseService from '../../services/exercise';
import userService from '../../services/user';
import { setExerciseProgress, setExperience, useStateValue } from "../../state";


import styles from  '../../styles/exercise.module.css';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { QuestionSet } from "../../types";


export const getServerSidePaths: GetServerSidePaths = () => {
    const paths = getAllExercisesParams();
    return {
        id: paths.map(id => {
            const parts = id.split('/');
            return {
                params: {
                    topic: parts[0],
                    number: Number(parts[1]),
                }
            };
        }),
        fallback: false,
    };
};


type Props = {

};


const ExercisePage = (props: Props) => {
    const router = useRouter();
    const id = router.query.id;
    const [topic, level] = id && id.length > 1 ? id : [];

    const [health, setHealth] = useState(3);
    const [questionSet, setQuestionSet] = useState<QuestionSet>([]);
    const [loading, setLoading] = useState(true);
    const [setError] = useErrorMessage();
    const [{ experience, userProgress }, dispatch] = useStateValue();


    useEffect(() => {
        const fetchQuestionSet = async () => {
            try {
                const questionSetFromApi = await exerciseService.getQuestionSet({ topic, level: parseInt(level, 10) });
                console.assert(questionSetFromApi.length >= health, `Must have at least ${health} questions`);
                setQuestionSet(questionSetFromApi);
            } catch (e) {
                console.error(e);
                setQuestionSet([]);
                setError('Error fetching questions', (e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if ( topic && level ) {
            void fetchQuestionSet();
        }
    }, [topic, level]);



    const onExit = async (finishedSuccessfully: boolean) => {
        console.log("EXIT", finishedSuccessfully);
        if ( finishedSuccessfully ) {
            const id = topic + "/" + level;
            const oldProgress = userProgress[id] || { val: 0 };
            try {
                const newProgress = await userService.updateProgress(id, oldProgress.val + 1);
                console.log("updated progress:", newProgress);
                dispatch(setExerciseProgress(id, newProgress[id]));
                const newXP = await userService.updateXP((experience || 0) + health);
                dispatch(setExperience(newXP));
            } catch ( err ) {
                console.error(err);
                setError('Error updating progress', err.message);
            }
        }
        Router.push('/overview');
    };

    const healthHit = () => {
        setHealth(health - 1);
    };


    return (
        <Layout>
            <Head>
                <title>{`${topic} ${level} | ${SITE_TITLE}`}</title>
            </Head>
            <Header as="header">
                <h2 className={styles.title}>
                    <span className={styles.supertitle}>Exercise</span>
                    <br/>
                    <span className={styles.exerciseTitle}>{topic} {level}</span>
                </h2>
                <Health max={3} value={health} />
            </Header>

            { loading
              ? <Loader active/>
              : <ExArea exit={onExit} health={health} decrementHealth={healthHit} questionSet={questionSet} />
            }
        </Layout>
    );
};

export default ExercisePage;
