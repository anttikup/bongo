import { AudioMeta, ImageMeta, isRangeAudio } from '../sharedTypes';

import imageData from '../../../../../earoutil/backend/data/image.json';
import audioData from '../../../../../earoutil/backend/data/audio.json';

const data = (imageData as Record<string, unknown>[]).concat(audioData as Record<string, unknown>[]);

type Query = {
    media: string;
    type?: string;
    instrument?: string;
    minLine?: number;
    maxLine?: number;
    minPic?: number;
    maxPic?: number;
    abstractAudio?: string;
    humanDescription?: string;
    clef?: string;
};


const makeFilter = (q: Query) => {
    const qr = q as Record<string, unknown>;
    const queryMatches = (item: Record<string, unknown>) => {
        for ( let key in qr ) {
            if ( key === 'minPic' && isRangeAudio(item.range) ) {
                if ( item.range[key] < (qr[key] as number) ) {
                    console.log("  range lower:", key, "—", item.range[key], "<", qr[key]);
                    return false;
                }
                continue;
            }
            if ( key === 'maxPic' && isRangeAudio(item.range) ) {
                if ( item.range[key] > (qr[key] as number) ) {
                    console.log("  range higher:", key, "—", item.range[key], ">", qr[key]);
                    return false;
                }
                continue;
            }

            if ( !(key in item) ) {
                return false;
            }

            if (item[key] !== qr[key] ) {
                return false;
            }
            //console.log("  a match:", key, "—", item[key], "<>", qr[key]);
        }
        console.log("matches:", item);
        return true;
    };

    return (item: Record<string, unknown>) => {
        if ( !queryMatches(item) ) {
            return false;
        }
        return true;
    };
};


const query = <T>(q: Query): Array<T> => {
    const filterFunc = makeFilter(q);
    console.log(filterFunc);
    // MOCK
    return  data.filter(filterFunc) as Array<unknown> as Array<T>;
};


const getAssociatedAudio = (imageMeta: ImageMeta, instrument: string): AudioMeta | null => {
    const associatedAudio = query<AudioMeta>({
        media: 'audio',
        instrument,
        abstractAudio: imageMeta.abstractAudio
    });

    console.assert(associatedAudio.length <= 1, "Too many audios found");

    if ( associatedAudio.length > 0 ) {
        return associatedAudio[0];
    }

    return null;
};



export default {
    getAssociatedAudio,
    query,
};
