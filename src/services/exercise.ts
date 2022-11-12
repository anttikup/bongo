import axios from "axios";

import { QuestionSet } from '../types';

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

export default { getQuestionSet };
