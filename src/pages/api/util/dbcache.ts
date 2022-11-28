import clientPromise from "../../../lib/mongodb";

import { AudioMeta, ImageMeta, isRangeAudio, isRangeImage } from '../sharedTypes';

type Query = {
    media: string;
    type?: string;
    instrument?: string;
    abstractAudio?: string;
    humanDescription?: string;
    clef?: string;
};


const clean = item => {
    const copy = { ...item };
    delete copy._id;
    delete copy.master;
    delete copy.metadata_version;

    return copy;
};

const query = async <T>(q: Query): Array<T> => {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    if ( q.media === 'audio' ) {
        const result = await db.collection('audio').find(q);
        const array = await result.toArray();
        return array.map(clean);
    } else if ( q.media === 'image' ) {
        const result = await db.collection('images').find(q);
        const array = await result.toArray();
        return array.map(clean);
    }

    throw new Error(`Unrecoqnised media type: '${q.media}'`);
};


const getAssociatedAudio = async (imageMeta: ImageMeta, instrument: string): AudioMeta | null => {
    const associatedAudio = await query<AudioMeta>({
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
