import fs from 'fs';
import path from 'path';
import walkSync from 'walk-sync';

import { ExerciseDescr, TierDescr } from '../types';

const EXERCISE_DIR = 'src/pages/api/exercise/';
const LECTURE_DIR = 'src/pages/lectures/';
const START_TAG = '// {\n';
const END_TAG = '// }\n';

import { Overview } from '../types';


type PartialExerciseDescr = Partial<ExerciseDescr>;
type LectureTopic = {
    title: string;
    items: ExerciseDescr[];
};

const getInfoSection = (text: string, fileName: string) => {
    const startTagPos = text.indexOf(START_TAG);
    if ( startTagPos === -1 ) {
        return {};
    }
    const startTagLen = START_TAG.length;
    const endTagPos = text.indexOf(END_TAG);
    if ( endTagPos === -1 ) {
        throw new Error(`No info part ${fileName}`);
    }
    const info = text.substring(startTagPos, endTagPos + END_TAG.length).replaceAll('// ', '');
    const json = JSON.parse(info);
    return json;
};

const getExerciseDescr = () => {
    const dirInfo: Map<string, PartialExerciseDescr> = new Map();
    const exInfo: Map<string, ExerciseDescr> = new Map();

    const paths = walkSync(EXERCISE_DIR);
    for ( let subpath of paths ) {
        if ( subpath.endsWith('/') ) {
            const fullPath = path.join(EXERCISE_DIR, subpath, 'info.json');
            if ( fs.existsSync(fullPath) ) {
                const relevant = subpath.replace(EXERCISE_DIR, "").replace(/\/$/, '');
                const data = fs.readFileSync(fullPath, { encoding: 'utf8', flag:'r' });
                const json = JSON.parse(data);
                dirInfo.set(relevant, json);
            }
        } else if ( subpath.endsWith('/info.json') ) {
            // Ignore, because handled in dir.
        } else {
            const fullPath = path.join(EXERCISE_DIR, subpath);
            const relevant = subpath.replace(EXERCISE_DIR, "").replace("/index.ts", "");

            if ( subpath.indexOf('/') === -1 ) {
                continue;
            }

            const data = fs.readFileSync(fullPath, { encoding: 'utf8', flag:'r' });
            const json = getInfoSection(data, relevant) || {};
            const parent = subpath.split('/')[0];
            const parentJson = dirInfo.get(parent) || {};

            const [topic, level] = relevant.split('/');

            exInfo.set(relevant, {
                ...parentJson,
                ...json,
                id: relevant,
                topic,
                level: parseInt(level, 10)
            });
        }
    }
    return exInfo;
};


const getLectureInfo = (exInfo: Map<string, ExerciseDescr>) => {
    const paths = walkSync(LECTURE_DIR);
    for ( let subpath of paths ) {
        if ( subpath.endsWith('/') ) {
            // Ignore, because handled in LECTURE_DIR.
        } else {
            const fullPath = path.join(LECTURE_DIR, subpath);
            const relevant = subpath.replace(LECTURE_DIR, "").replace("/index.tsx", "");

            const exerciseData = exInfo.get(relevant);

            if ( relevant !== 'index.tsx' ) {
                exInfo.set(relevant, { ...exerciseData, hasLecture: true } as ExerciseDescr);
            }

        }
    }
    return exInfo;
};

const exerciseInfo = getLectureInfo(getExerciseDescr());

function getOverview() {

    const tiers: TierDescr[] = [];
    exerciseInfo.forEach((val, id) => {
        if ( !tiers[val.tier] ) {
            tiers[val.tier] = {
                title: `tier-${val.tier + 1}`,
                items: []
            };
        }
        tiers[val.tier].items.push(val);
    });

    for ( let tier of tiers ) {
        tier.items.sort((a, b) => (b.pos || Number.MAX_SAFE_INTEGER) - (a.pos || Number.MAX_SAFE_INTEGER));
    }
    return tiers;
}


function getLecturesByTopic() {
    const topics = new Map<string, ExerciseDescr[]>();
    exerciseInfo.forEach((val, id) => {
        if ( val.hasLecture ) {
            const items = topics.get(val.topic) || [];
            items.push(val);
            items.sort((a, b) => a.level - b.level);
            topics.set(val.topic, items);
        }
    });

    const listOfTopics: LectureTopic[] = [];
    topics.forEach(items => {
        listOfTopics.push({
            title: items[0].title,
            items,
        });
    });


    return listOfTopics;
}


export default {
    getOverview,
    getLecturesByTopic,
};
