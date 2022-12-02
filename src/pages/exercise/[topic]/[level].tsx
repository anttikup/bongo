import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import LearningSetManager from '../../../utils/LearningSetManager';
import { SITE_TITLE } from '../../../config';
import ExArea from '../../../components/ExArea';
import Health from '../../../components/Health';
import Layout from '../../../components/layout';
import { getErrorMessage } from '../../../lib/error';
import { useErrorMessage } from '../../../hooks/errorMessage';
import { useQuestionSet } from '../../../hooks/data';
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
    let topicTitle = topic;

    const [health, setHealth] = useState(3);
    const [questionSet, setQuestionSet] = useState<QuestionSet>([]);
    //const [learningStats, setLearningStats] = useState<StatsCategory>([]);
    const [loadingQS, setLoadingQS] = useState(false);
    const [loadingLS, setLoadingLS] = useState(false);
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
                topicTitle = questionSetFromApi[0].title;
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
        const fetchLearningStats = async (setName: string) => {
            setLoadingLS(true);
            try {
                const { data: learningStatsFromApi } = await userService.getLearningStats(setName);
                console.info(learningStatsFromApi);
                if ( !learningStatsRef.current ) {
                    learningStatsRef.current = new LearningSetManager();
                }

                learningStatsRef.current.add(setName, learningStatsFromApi);
            } catch (e) {
                console.error(e);
                setError('Error fetching learningstats', (e as Error).message);
            } finally {
                setLoadingLS(false);
            }
        };

        if ( questionSet ) {
            // TODO
            void fetchLearningStats('notenames');
        }
    }, [questionSet]);


    const updateStats = (userAnswer: AssignmentAnswer, trueAnswer: AssignmentAnswer, statsNames: string[]) => {
        if ( !learningStatsRef?.current || statsNames.length === 0 ) {
            return;
        }

        const setName = statsNames[0];
        if ( userAnswer === trueAnswer ) {
            learningStatsRef.current.update(setName, userAnswer.toString(), 2, 0);
        } else {
            learningStatsRef.current.update(setName, userAnswer.toString(), 0, 1);
            learningStatsRef.current.update(setName, trueAnswer.toString(), 0, 1);
        }
    };



    const onExit = async (finishedSuccessfully: boolean) => {
        if ( finishedSuccessfully ) {
            const id = topic + "/" + level;
            const oldProgress = userProgress[id] || { val: 0 };
            try {
                const newProgress = await userService.updateProgress(id, oldProgress.val + 1);
                dispatch(setExerciseProgress(id, newProgress[id]));
                const newXP = await userService.updateXP((experience || 0) + health);
                dispatch(setExperience(newXP));
                saveLearningStats();
            } catch ( err ) {
                console.error(err);
                setError('Error updating progress', getErrorMessage(err));
            }
        }
        Router.push('/overview');
    };


    const saveLearningStats = async () => {
        if ( !learningStatsRef?.current ) {
            return;
        }

        // TODO
        const setName = 'notenames';
        const data = learningStatsRef.current.getSet(setName);
        const learningStatsFromApi = await userService.updateLearningStats(setName, data);
        learningStatsRef.current.setSet(setName, learningStatsFromApi);
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
                <h1 className={styles.title}>
                    <span className={styles.supertitle}>Exercise</span>
                    <br/>
                    <span className={styles.exerciseTitle}>{topicTitle} {level}</span>
                </h1>
                <Health max={3} value={health} />
            </Header>

            <Loader active={loadingQS || loadingLS} />
            { loadingQS || loadingLS
              ? null
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
