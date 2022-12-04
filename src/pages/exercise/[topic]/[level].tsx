import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router'
import { Header, Loader } from "semantic-ui-react";

import exerciseLib from '../../../lib/exercises';
import LearningSetManager from '../../../utils/LearningSetManager';
import { SITE_TITLE, MAX_HEALTH } from '../../../config';
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
import type {
    AssignmentAnswer,
    QuestionSet,
    LearningStats,
    StatType
} from '../../../types';


export const getStaticProps: GetStaticProps = async ({ params }) => {
    if ( !params ) {
        throw new Error('params not defined');
    }

    const title = await exerciseLib.getTopicTitle(params.topic as string);
    return {
        props: {
            title
        },
    };
};

export async function getStaticPaths() {
    const paths = await exerciseLib.getExercisePaths();
    return {
        paths: paths.map(({ topic, level }: { topic: string; level: number; }) => {
            return {
                params: {
                    topic,
                    level: String(level)
                }
            };
        }),
        fallback: false,
    };
}


const collectLearningSets = (questionSet: QuestionSet): string[] => {
    const seen = new Set<StatType>();
    for ( let exercise of questionSet ) {
        console.log("qs:", exercise);
        if ( exercise.itemType ) {
            seen.add(exercise.itemType);
        }
    }
    return Array.from(seen.values());
};

type Props = {
    title: string;
};


const ExercisePage = ({ title }: Props) => {
    const router = useRouter();
    const topic = router.query.topic as string;
    const level = router.query.level as string;

    const [health, setHealth] = useState(MAX_HEALTH);
    const [questionSet, setQuestionSet] = useState<QuestionSet>([]);
    const [learningSetNames, setLearningSetNames] = useState<string[]>([]);
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
                setLearningSetNames(collectLearningSets(questionSetFromApi));
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

        for ( let learningSetName of learningSetNames ) {
            if ( !learningStatsRef.current?.has(learningSetName) ) {
                void fetchLearningStats(learningSetName);
            }
        }

    }, [learningSetNames]);


    const updateStats = (
        userAnswer: AssignmentAnswer,
        trueAnswer: AssignmentAnswer,
        itemType: StatType,
        refValue?: AssignmentAnswer
    ) => {
        if ( !learningStatsRef?.current || itemType === undefined ) {
            return;
        }

        const [correctPoints, wrongPoints] = userAnswer === trueAnswer ? [1, 0] : [0, 1];

        learningStatsRef.current.update(itemType, userAnswer.toString(), correctPoints, wrongPoints);
        learningStatsRef.current.update(itemType, trueAnswer.toString(), correctPoints, wrongPoints);
        if ( refValue ) {
            learningStatsRef.current.update(itemType, refValue.toString(), correctPoints, wrongPoints);
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
            } catch ( err ) {
                console.error(err);
                setError('Error updating progress', getErrorMessage(err));
            }
        }
        saveLearningStats();
        Router.push('/overview');
    };


    const saveLearningStats = async () => {
        if ( !learningStatsRef?.current || learningSetNames.length === 0 ) {
            return;
        }

        for ( let learningSetName of learningSetNames ) {
            const data = learningStatsRef.current.getSet(learningSetName);
            const learningStatsFromApi = await userService.updateLearningStats(learningSetName, data);
            learningStatsRef.current.setSet(learningSetName, learningStatsFromApi);
        }
    };

    const healthHit = () => {
        setHealth(health - 1);
    };


    return (
        <Layout>
            <Head>
                { topic && level
                  ? <title>{`${title} ${level} | ${SITE_TITLE}`}</title>
                  : <title>{`Exercise | ${SITE_TITLE}`}</title>
                }
            </Head>
            <Header as="header">
                <h1 className={styles.title}>
                    <span className={styles.supertitle}>Exercise</span>
                    <br/>
                    <span className={styles.exerciseTitle}>{title} {level}</span>
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

            <p>
                All sets: { learningStatsRef?.current?.listSets() }
            </p>
            <p>
                Current sets: { learningSetNames }
            </p>

        </Layout>
    );
};

export default ExercisePage;
