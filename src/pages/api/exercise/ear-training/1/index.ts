import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../util/dbcache';
//import { makeFilterFirstNOrLess } from '../../../util/misc';
import random from '../../../util/random';
import { SortingAssignment } from '../../../../../types';
import { AudioMeta, PitchMeta, RangeAudio } from '../../../sharedTypes';
import { MAX_HEALTH } from '../../../../../config';

type PitchAudio = AudioMeta & PitchMeta;

const newColorer = () => {
    const colors = random.shuffle([
        '#6768e1',
        '#e065e1',
        '#e3e26a',
        '#65dd64',
        '#f26379'
    ]);
    let index = 0;
    return () => {
        return colors[index++ % colors.length];
    };
};


const generateExercise = async () => {
    const questionTypes: (() => Promise<SortingAssignment>)[] = [
        await generateSortAudio,
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5 + MAX_HEALTH);

    const exerciseSet = [];
    for ( let genFunc of genFunctions ) {
        exerciseSet.push(await genFunc());
    }

    return exerciseSet;
};



const generateSortAudio = async () : Promise<SortingAssignment> => {
    const piano = random.getBoolean();
    const pool = await dbcache.query<PitchAudio>({
        media: 'audio',
        type: 'pitch',
        'range.minPic': { $gte: -12 },
        'range.maxPic': { $lte: 12 },
        instrument: piano ? 'acoustic grand' : 'voice oohs',
    });

    if ( pool.length < 5 ) {
        throw new Error('not enough items in result');
    }

    const nextColor = newColorer();

    const selected = random.pickK(pool, 5);
    const items = selected.map(item => ({
        value: item.id,
        audio: item.file,
        color: nextColor()
    }));

    selected.sort((a, b) => (a.range as RangeAudio).minPic - (b.range as RangeAudio).minPic);
    const order = selected.map(item => item.id);

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




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(await generateExercise());
};
