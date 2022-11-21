import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../util/dbcache';
import { makeFilterFirstNOrLess } from '../../../util/misc';
import random from '../../../util/random';
import { TextOption, ImageOption, MultipleChoiceAssignment } from '../../../types';
import { AudioMeta, PitchMeta, ImageMeta, NoteImage } from '../../../sharedTypes';
import { MAX_HEALTH } from '../../../../../config';

type PitchAudio = AudioMeta & PitchMeta;
type PitchImage = ImageMeta & PitchMeta;

const generateExercise = async () => {
    const questionTypes: (() => MultipleChoiceAssignment)[] = [
        generateNameANoteNoOctave,
        generatePickNoteByName,
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5 + MAX_HEALTH);

    const exerciseSet = [];
    for ( let genFunc of genFunctions ) {
        exerciseSet.push(await genFunc());
    }

    return exerciseSet;
};



const generateNameANoteNoOctave = async () : MultipleChoiceAssignment => {
    const pool = await dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        'range.minLine': { $gte: 2 },
        'range.maxLine': { $lte: 10 },
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

    const associatedAudio = dbcache.query<PitchAudio>({
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



const generatePickNoteByName = async () : MultipleChoiceAssignment => {
    type PitchImage = ImageMeta & PitchMeta;
    const pool = await dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        'range.minLine': { $gte: 2 },
        'range.maxLine': { $lte: 10 },
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


    const getAssociatedAudioFile = (herring: PitchImage) => {
        const meta = dbcache.getAssociatedAudio(herring, 'acoustic grand');
        return meta ? meta.file : null;
    };

    return {
        type: 'multiplechoice',
        question: {
            text: `Select the <strong>${pickedName}</strong> note.`
        },
        answer: pickedName,
        options: options.map<ImageOption>(
            herring => ({
                value: (herring.notes[0] as NoteImage).name,
                image: herring.file,
                audio: getAssociatedAudioFile(herring)
            })
        ),
        id: uuidv4(),
    };
};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(await generateExercise());
};
