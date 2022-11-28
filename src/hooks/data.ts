import { useEffect, useState } from 'react';

import exerciseService from '../../services/exercise';


export function useFetchedData<T>(url) {
    const [data, setData] = useState<T>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

export function useQuestionSet(topic, level) {
    const [data, setData] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const questionSetFromApi = await exerciseService.getQuestionSet({ topic, level });
                console.assert(questionSetFromApi.length >= health, `Must have at least ${health} questions`);
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