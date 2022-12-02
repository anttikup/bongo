import clientPromise from './mongodb';

import { isObject, isRangeAudio, isRangeImage } from '../types';
import type { FileMeta, AudioMeta, ImageMeta, MetadataDB } from '../types';


type QueryBase = {
    media: string;
    type?: string;
};

type Query = QueryBase & Record<string, unknown>;

const isMetadataDB = (obj: unknown): obj is MetadataDB => {
    if ( isObject(
        obj) && '_id' in obj
      && 'master' in obj
      && 'metadata_version' in obj
      && '__v' in obj ) {
        return true;
    }
    return false
};

const clean = (item: any) => {
    if ( isMetadataDB(item) ) {
        const copy = { ...item };
        delete copy._id;
        delete copy.master;
        delete copy.metadata_version;
        return copy;
    }
    throw new Error("Incompatible");
};


const query = async <T>(q: Query): Promise<Array<T>> => {
    const client = await clientPromise;
    const db = client.db('bongo');

    if ( q.media === 'audio' ) {
        const result = await db.collection('audio').find(q);
        return await result.toArray() as T[];

    } else if ( q.media === 'image' ) {
        const result = await db.collection('images').find(q);
        return await result.toArray() as T[];
    }

    throw new Error(`Unrecoqnised media type: '${q.media}'`);
};


const getAssociatedAudio = async (imageMeta: ImageMeta, instrument: string): Promise<AudioMeta | null> => {
    const associatedAudio = await query<AudioMeta>({
        media: 'audio',
        instrument,
        abstractAudio: imageMeta.abstractAudio
    });

    console.assert(associatedAudio.length <= 1, 'Too many audios found');

    if ( associatedAudio.length > 0 ) {
        return associatedAudio[0];
    }

    return null;
};



export default {
    getAssociatedAudio,
    query,
};
