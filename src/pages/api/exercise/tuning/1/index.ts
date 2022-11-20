import { v4 as uuidv4 } from 'uuid';

import { assert } from '../../../util/debug';
import dbcache from '../../../util/dbcache';
import random from '../../../util/random';
import { TuningAssignment } from '../../../types';
import { AudioMeta, PitchMeta } from '../../../sharedTypes';
import { MAX_HEALTH } from '../../../../../config';

type PitchAudio = AudioMeta & PitchMeta;

/**
 *
 **/
const newLetterer = () => {
    let index = 0;
    return () => {
        console.assert(index < 65 + 26, "Letters beyond Z not implemented");
        return String.fromCharCode(65 + index++);
    };
};

const generateExercise = () => {
    const questionTypes: (() => TuningAssignment)[] = [
        generateTuneAudio,
        generateSortCents,
        generatePickMatchingCents,
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5 + MAX_HEALTH);
    return genFunctions.map(genFunc => genFunc());
};



const generateTuneAudio = () : TuningAssignment => {
    const pool = dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'longpitch',
        //humanDescription: 'PIClass: 6, abs 18',
        minPic: -12,
        maxPic: 12,
    });

    if ( pool.length === 0 ) {
        throw new Error('nothing found');
    }

    const picked = random.pickOne(pool);
    //const pickedName: string = (picked.notes[0] as NoteAudio).name;

    const positive = random.getBoolean();

    return {
        type: 'tuning',
        question: {
            text: 'Tune the audio to match the reference audio. ' + picked.humanDescription,
            audio: picked.file,
        },
        answer: positive
              ? random.getInteger(20, 50)
              : random.getInteger(-50, -20),
        answerPrecision: 10,
        audioToTune: picked.file,
        id: uuidv4(),
    };
};


const generateSortCents = () : TuningAssignment => {
    const pool = dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'pitch',
        minPic: -12,
        maxPic: 12,
    });

    assert(pool.length > 0, 'nothing found');

    const original = random.pickOne(pool);
    const selectedDetunes = random.pickK(
        //[-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100],
        5
    );
    const nextLetter = newLetterer();
    const items = selectedDetunes.map(
        detune => ({
            value: String(detune),
            audio: original.file,
            detune,
            text: nextLetter()
        })
    );

    const order = items.map(item => item.detune);
    order.sort((a, b) => a - b);

    console.log("ORDER:", order);
    return {
        type: 'sorting',
        question: {
            text: 'Sort the sounds from lowest to highest. ',
        },
        answer: order.map(item => String(item)),
        items: items,
        id: uuidv4(),
    };
};


const generatePickMatchingCents = () : MultipleChoiceAssignment => {
    const pool = dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'pitch',
        minPic: -12,
        maxPic: 12,
    });

    assert(pool.length > 0, 'nothing found');

    const original = random.pickOne(pool);
    const selectedDetunes = [0, -15, 15, -30, 30].map(detune => detune);
    const nextLetter = newLetterer();
    const items = selectedDetunes.map<AudioOption>(
        detune => ({
            value: String(detune),
            audio: original.file,
            detune,
            text: nextLetter()
        })
    );

    const options = random.shuffle(items);

    return {
        type: 'multiplechoice',
        question: {
            audio: original.file,
            text: `Select the matching sound.`
        },
        answer: items[0].value,
        options: items,
        id: uuidv4(),
    };
};




export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(generateExercise());
};
