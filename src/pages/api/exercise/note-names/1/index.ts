import { v4 as uuidv4 } from 'uuid';

import dbcache from '../../../util/dbcache';
import { makeFilterFirstNOrLess } from '../../../util/misc';
import random from '../../../util/random';
import { TextOption, ImageOption, MultipleChoiceAssignment } from '../../../types';
import { AudioMeta, PitchMeta, ImageMeta, NoteImage } from '../../../sharedTypes';

type PitchAudio = AudioMeta & PitchMeta;
type PitchImage = ImageMeta & PitchMeta;

const generateExercise = () => {
    const questionTypes: (() => MultipleChoiceAssignment)[] = [
        generateNameANoteNoOctave,
        generatePickNoteByName,
        generateNameANoteNoOctave,
        generatePickNoteByName,
        generateNameANoteNoOctave,
        generatePickNoteByName,
    ];

    const genFunctions = random.pickK(questionTypes, 5);
    return genFunctions.map(genFunc => genFunc());
};



const generateNameANoteNoOctave = () : MultipleChoiceAssignment => {
    const pool = dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        //minLine: 0,
        //maxLine: 13,
        clef: 'treble',
    });

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
            text: 'Name the following pitch.',
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



const generatePickNoteByName = () : MultipleChoiceAssignment => {
    type PitchImage = ImageMeta & PitchMeta;
    const pool = dbcache.query<PitchImage>({
        media: 'image',
        type: 'pitch',
        //minLine: 0,
        //maxLine: 13,
        //clef: 'treble',
    });

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
            text: `Pick the ${pickedName} pitch.`
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



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(generateExercise());
};
