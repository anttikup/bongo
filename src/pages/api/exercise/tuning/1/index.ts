import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../util/dbcache';
import random from '../../../util/random';
import { TuningAssignment } from '../../../types';
import { AudioMeta, PitchMeta } from '../../../sharedTypes';

type PitchAudio = AudioMeta & PitchMeta;

const generateExercise = () => {
    const questionTypes: (() => TuningAssignment)[] = [
        generateTuneAudio,
        generateTuneAudio,
        generateTuneAudio,
        generateTuneAudio,
        generateTuneAudio,
    ];

    const genFunctions = random.pickK(questionTypes, 5);
    return genFunctions.map(genFunc => genFunc());
};



const generateTuneAudio = () : TuningAssignment => {
    const pool = dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'pitch',
        //humanDescription: 'PIClass: 6, abs 18',
        minPic: -12,
        maxPic: 12,
    });

    if ( pool.length === 0 ) {
        throw new Error('nothing found');
    }

    const picked = random.pickOne(pool);
    //const pickedName: string = (picked.notes[0] as NoteAudio).name;

    const positive = random.getRandomBoolean();

    return {
        type: 'tuning',
        question: {
            text: 'Tune the audio to match the reference audio. ' + picked.humanDescription,
            audio: picked.file,
        },
        answer: positive
              ? random.getRandomInteger(1, 10)
              : random.getRandomInteger(-10, -1),
        answerPrecision: 0.5,
        audioToTune: picked.file,
        id: uuidv4(),
    };
};



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(generateExercise());
};
