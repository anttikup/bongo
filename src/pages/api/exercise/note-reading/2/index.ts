// {
//     "tier": 1,
//     "pos": 2,
//     "subtitle": "Leger Lines",
//     "image": "/images/icons/Radio.svg",
//     "color": "#c0cbff"
// }


import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../../../lib/dbcache';
import { makeFilterFirstNOrLess } from '../../../../../lib/misc';
import random from '../../../../../lib/random';
import { MAX_HEALTH } from '../../../../../config';

import type { TextOption, ImageOption, MultipleChoiceAssignment } from '../../../../../types';
import type { AudioMeta, PitchMeta, ImageMeta, NoteImage } from '../../../../../types';

type PitchAudio = AudioMeta & PitchMeta;
type PitchImage = ImageMeta & PitchMeta;

const generateExercise = async () => {
    const questionTypes: (() => Promise<MultipleChoiceAssignment>)[] = [
        () => generateNameANoteNoOctave(12, 17),
        () => generatePickNoteByName(12, 17),
        () => generateNameANoteNoOctave(-5, 0),
        () => generatePickNoteByName(-5, 0),
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5 + MAX_HEALTH);

    const exerciseSet = [];
    for ( let genFunc of genFunctions ) {
        exerciseSet.push(await genFunc());
    }

    return exerciseSet;
};



const generateNameANoteNoOctave = async (minLine: number, maxLine: number) : Promise<MultipleChoiceAssignment> => {
    const pool = await dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        'range.minLine': { $gte: minLine },
        'range.maxLine': { $lte: maxLine },
        clef: 'treble',
    });

    if ( pool.length < 5 ) {
        throw new Error('not enough items in result');
    }

    const picked = random.pickOne(pool);
    const pickedName: string = (picked.notes[0] as NoteImage).name;

    const shuffled = random.shuffle(pool);

    const filterFirst_4_Matching = makeFilterFirstNOrLess(4);
    const seen = new Set();
    seen.add(pickedName);
    const redHerrings = filterFirst_4_Matching(
        shuffled,
        (item: PitchImage) => {
            const note = item.notes[0] as NoteImage;
            if ( seen.has(note.name) ) {
                return false;
            }
            seen.add(note.name);
            return true;
        }
    )

    const redHerringNames = redHerrings.map(herring => (herring.notes[0] as NoteImage).name);
    const optionNames = random.shuffle(redHerringNames.concat(pickedName));

    const associatedAudio = await dbcache.query<PitchAudio>({
        media: 'audio',
        instrument: 'acoustic grand',
        abstractAudio: picked.abstractAudio
    });

    return {
        type: 'multiplechoice',
        question: {
            text: 'Name the following note.',
            image: picked.file,
            audio: associatedAudio.length > 0 ? associatedAudio[0].file : undefined
        },
        answer: pickedName,
        options: optionNames.map<TextOption>(
            option => ({
                value: option,
                text: option
            })
        ),
        id: uuidv4(),
    };
};



const generatePickNoteByName = async (minLine: number, maxLine: number) : Promise<MultipleChoiceAssignment> => {
    type PitchImage = ImageMeta & PitchMeta;
    const pool = await dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        'range.minLine': { $gte: minLine },
        'range.maxLine': { $lte: maxLine },
        clef: 'treble',
    });

    if ( pool.length < 5 ) {
        throw new Error('not enough items in result');
    }

    const picked = random.pickOne(pool);
    const pickedName: string = (picked.notes[0] as NoteImage).name;

    const shuffled = random.shuffle(pool);

    const filterFirst_4_Matching = makeFilterFirstNOrLess(4);
    const redHerrings = filterFirst_4_Matching(
        shuffled,
        (item: PitchImage) => (item.notes[0] as NoteImage).name !== pickedName
    )

    const options = random.shuffle(redHerrings.concat(picked));


    const getAssociatedAudioFile = async (herring: PitchImage) => {
        const meta = await dbcache.getAssociatedAudio(herring, 'acoustic grand');
        return meta?.file;
    };

    return {
        type: 'multiplechoice',
        question: {
            text: `Select the <strong>${pickedName}</strong> note.`
        },
        answer: pickedName,
        options: await Promise.all(options.map<Promise<ImageOption>>(
            async (herring) => ({
                value: (herring.notes[0] as NoteImage).name,
                image: herring.file,
                audio: await getAssociatedAudioFile(herring)
            })
        )),
        id: uuidv4(),
    };
};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(await generateExercise());
};
