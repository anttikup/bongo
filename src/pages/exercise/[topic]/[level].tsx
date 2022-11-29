import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import LearningSetManager from '../../../utils/LearningSetManager';
import { SITE_TITLE } from '../../../config';
import ExArea from '../../../components/ExArea';
import Health from '../../../components/Health';
import Layout from '../../../components/layout';
import { useErrorMessage } from '../../../hooks/errorMessage';
import { useQuestionSet } from '../../../hooks/data';
import { getAllExerciseIds } from '../../../lib/exercises';
import exerciseService from '../../../services/exercise';
import userService from '../../../services/user';
import { setExerciseProgress, setExperience, useStateValue } from '../../../state';

import styles from  '../../../styles/exercise.module.css';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { AssignmentAnswer, QuestionSet, LearningStats } from '../../../types';


type Props = {

};


const ExercisePage = (props: Props) => {
    const router = useRouter();
    const topic = router.query.topic as string;
    const level = router.query.level as string;

    const [health, setHealth] = useState(3);
    const [questionSet, setQuestionSet] = useState<QuestionSet>([]);
    //const [learningStats, setLearningStats] = useState<StatsCategory>([]);
    const [loadingQS, setLoadingQS] = useState(true);
    const [loadingLS, setLoadingLS] = useState(true);
    const [setError] = useErrorMessage();
    const [{ experience, userProgress }, dispatch] = useStateValue();
    // Stats data doesn't affect the component, so we store it outside state.
    const learningStatsRef = useRef<LearningSetManager | null>(null);

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
                if ( !learningStatsRef.current ) {
                    learningStatsRef.current = new LearningSetManager();
                }

                learningStatsRef.current.add('notenames', learningStatsFromApi.data);
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


    const updateStats = (userAnswer: AssignmentAnswer, trueAnswer: AssignmentAnswer) => {
        console.log("UPDAT:", learningStatsRef.current);
        if ( userAnswer === trueAnswer ) {
            learningStatsRef.current.update('notenames', userAnswer, 2, 0);
        } else {
            learningStatsRef.current.update('notenames', userAnswer, 0, 1);
            learningStatsRef.current.update('notenames', trueAnswer, 0, 1);
        }
    };



    const onExit = async (finishedSuccessfully: boolean) => {
        console.log("EXIT", finishedSuccessfully);
        if ( finishedSuccessfully ) {
            const id = topic + "/" + level;
            const oldProgress = userProgress[id] || { val: 0 };
            try {
                const newProgress = await userService.updateProgress(id, oldProgress.val + 1);
                dispatch(setExerciseProgress(id, newProgress[id]));
                const newXP = await userService.updateXP((experience || 0) + health);
                dispatch(setExperience(newXP));
                const data = learningStatsRef.current.getSet('notenames');
                const learningStatsFromApi = await userService.updateLearningStats('notenames', data);
                learningStatsRef.current.setSet('notenames', learningStatsFromApi);
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
              : <ExArea
                    exit={onExit}
                    health={health}
                    decrementHealth={healthHit}
                    questionSet={questionSet}
                    updateStats={updateStats}
              />
            }
        </Layout>
    );
};

export default ExercisePage;
