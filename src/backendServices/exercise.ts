import { ExerciseDescr } from '../types';

import notenames1 from '../exercises/note-names/1';
import tuning1 from '../exercises/tuning/1';
import eartraining1 from '../exercises/ear-training/1';

interface Module {
    generateExercise: () => ExerciseDescr;
}

const map : Record<string, Module> = {
    'note-names/1': notenames1,
    'tuning/1': tuning1,
    'ear-training/1': eartraining1,
};

const findByTopicAndNumber = (topic: string, num: number): ExerciseDescr => {
    console.log("find", topic, num);
    const module = map[`${topic}/${num}`];

    if ( !module ) {
        throw new Error(`module not found: ${topic}/${num}`);
    }

    try {
        return module.generateExercise();
    } catch ( err ) {
        console.error(err);
        throw err;
    }
};


export default {
    findByTopicAndNumber,
};
