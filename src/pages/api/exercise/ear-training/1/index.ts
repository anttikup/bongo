import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../util/dbcache';
//import { makeFilterFirstNOrLess } from '../../../util/misc';
import random from '../../../util/random';
import { SortingAssignment } from '../../../types';
import { AudioMeta, PitchMeta, RangeAudio } from '../../../sharedTypes';

type PitchAudio = AudioMeta & PitchMeta;

const generateExercise = () => {
    const questionTypes: (() => SortingAssignment)[] = [
        generateSortAudio,
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5);
    return genFunctions.map(genFunc => genFunc());
};



const generateSortAudio = () : SortingAssignment => {
    const piano = random.getBoolean();
    const pool = dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'pitch',
        minPic: -12,
        maxPic: 12,
        instrument: piano ? 'acoustic grand' : 'voice oohs',
    });

    if ( pool.length === 0 ) {
        throw new Error('nothing found');
    }

    const selected = random.pickK(pool, 5);
    const items = selected.map(item => ({ value: item.id, audio: item.file }));

    selected.sort(item => (item.range as RangeAudio).minPic);
    const order = selected.map(item => item.file);

    return {
        type: "sorting",
        question: {
            text: "Order the items from lowest to highest."
        },
        answer: order,
        items: items,
        id: uuidv4(),
    };
};




export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(generateExercise());
};
