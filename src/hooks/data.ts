import { useEffect, useState } from 'react';
import axios from 'axios';

import exerciseService from '../services/exercise';
import { QuestionSet } from '../types';

export function useFetchedData<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get<T>(
                    url
                );

                setData(data);
            } catch (e) {
                console.error(e);
                setData(null);
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if ( url ) {
            void fetchData();
        }
    }, [url]);


    return { data, loading, error };
};

export function useQuestionSet(topic: string, level: number) {
    const [data, setData] = useState<QuestionSet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const questionSetFromApi = await exerciseService.getQuestionSet({ topic, level });
                setData(questionSetFromApi);
            } catch (e) {
                console.error(e);
                setData([]);
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if ( topic && level ) {
            void fetchData();
        }
    }, [topic, level]);


    return { data, loading, error };
};
