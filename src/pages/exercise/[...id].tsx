import { useEffect, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import { SITE_TITLE } from '../../config';
import ExArea from '../../components/ExArea';
import Health from '../../components/Health';
import Layout from '../../components/layout';
import { useErrorMessage } from '../../hooks/errorMessage';
import { useQuestionSet } from '../../hooks/data';
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
    //const [learningStats, setLearningStats] = useState<StatsCategory>([]);
    const [loadingQS, setLoadingQS] = useState(true);
    const [loadingLS, setLoadingLS] = useState(true);
    const [setError] = useErrorMessage();
    const [{ experience, userProgress }, dispatch] = useStateValue();
    //const learningStats = useRef({});

    /* const {
     *     data: questionSet,
     *     error: questionSetError,
     *     loading: questionSetLoading
     * } = useQuestionSet(topic, level);


     * if ( questionSetError ) {
     *     setError(questionSetError);
     * } */

    useEffect(() => {
        const fetchQuestionSet = async () => {
            setLoadingQS(true);
            try {
                const questionSetFromApi = await exerciseService.getQuestionSet({ topic, level: parseInt(level, 10) });
                console.assert(questionSetFromApi.length >= health, `Must have at least ${health} questions`);
                setQuestionSet(questionSetFromApi);
            } catch (e) {
                console.error(e);
                setQuestionSet([]);
                setError('Error fetching questions', (e as Error).message);
            } finally {
                setLoadingQS(false);
            }
        };

        if ( topic && level ) {
            void fetchQuestionSet();
        }
    }, [topic, level]);


    useEffect(() => {
        const fetchLearningStats = async () => {
            setLoadingLS(true);
            try {
                const learningStatsFromApi = await userService.getLearningStats('notenames');
                console.info(learningStatsFromApi);
                setLearningStats(learningStatsFromApi);
            } catch (e) {
                console.error(e);
                setError('Error fetching learningstats', (e as Error).message);
            } finally {
                setLoadingLS(false);
            }
        };

        if ( topic && level ) {
            void fetchLearningStats();
        }
    }, [topic, level]);


    const updateStats = (userAnswer: Answer, trueAnswer: Answer) => {
        if ( userAnswer === trueAnswer ) {
            setlearningStats({
                ...learningStats,
                [userAnswer].right: learningStats[userAnswer].right + 1,
            });
        } else {
            setlearningStats({
                ...learningStats,
                [userAnswer].wrong: learningStats[userAnswer].wrong + 1,
                [trueAnswer].wrong: learningStats[trueAnswer].wrong + 1,
            });

        }
    };



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
                const data = { ...learningStats.data };
                data['f'] = { right: 99, wrong: 12 };
                const learningStatsFromApi = await userService.updateLearningStats('notenames', data);
                console.info(learningStatsFromApi);
                setLearningStats(learningStatsFromApi);
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
                { topic && level
                  ? <title>{`${topic} ${level} | ${SITE_TITLE}`}</title>
                  : <title>{`Exercise | ${SITE_TITLE}`}</title>
                }
            </Head>
            <Header as="header">
                <h2 className={styles.title}>
                    <span className={styles.supertitle}>Exercise</span>
                    <br/>
                    <span className={styles.exerciseTitle}>{topic} {level}</span>
                </h2>
                <Health max={3} value={health} />
            </Header>

            { loadingQS || loadingLS
              ? <Loader active/>
              : <ExArea exit={onExit} health={health} decrementHealth={healthHit} questionSet={questionSet} />
            }
        </Layout>
    );
};

export default ExercisePage;
