import axios from "axios";

import { QuestionSet, TierDescr } from '../types';

//const baseUrl = '/api/exercise';

type ExerciseRef = {
    topic: string;
    level: number;
};

const getQuestionSet = async ({ topic, level } : ExerciseRef) => {
    console.log(topic, level);
    const { data: questionSetFromApi } = await axios.get<QuestionSet>(
        `/api/exercise/${topic}/${level}`
    );

    return questionSetFromApi;
};

const getOverview = async () => {
    const { data: overviewFromApi } = await axios.get<TierDescr[]>(
        `/api/overview`
    );

    if ( !overviewFromApi.map ) {
        // Return value is string, if json is malformed.
        throw new Error(`Returned value not an array: ${typeof overviewFromApi}`);
    }

    return overviewFromApi;
};

export default { getOverview, getQuestionSet };
