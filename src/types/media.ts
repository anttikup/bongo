import { ObjectId } from 'mongodb';

import {
    isObject,
    isString,
} from './basic';



export enum MediaType {
    Audio = 'audio',
    Image = 'image',
}

export const isMediaType = (type: string): type is MediaType =>
    typeof isString(type) && (type === 'audio' || type === 'image');


export interface File {
    type: MediaType;
    location: string;
}

export enum ItemType {
    Chord = 'chord',
    MelodicInterval = 'melodic',
    HarmonicInterval = 'harmonic',
    Pitch = 'pitch'
}

export const isItemType = (type: string): type is ItemType =>
    typeof isString(type) && (type in ['chord', 'melodic', 'harmonic', 'pitch']);



export interface Chord {
    name: string;
    type: string;
}

//base: "c", "c-d", "d", "d-e", "e", "f", "f-g", "g", "g-a", "a", "a-b", "b";

export interface Interval {
    quality: "diminished" | "minor" | "perfect" | "major" | "augmented";
    number: number;
    short: string;
    direction: "forward" | undefined | "backward"
}

export interface NoteImage {
    name: string;
    octave: number;
    line: number;
    duration: string;
}

export interface NoteAudio {
    pic: number;
    duration: string;
}

export type Note = NoteImage | NoteAudio;

export interface RangeImage {
    maxLine: number;
    minLine: number;
}

export interface RangeAudio {
    maxPic: number;
    minPic: number;
}

export const isRangeAudio = (obj: unknown): obj is RangeAudio =>
    isObject(obj) && 'maxPic' in obj && typeof obj.maxPic === 'number' && 'minPic' in obj && typeof obj.minPic === 'number';

export const isRangeImage = (obj: unknown): obj is RangeAudio =>
    isObject(obj) && 'maxLine' in obj && typeof obj.maxLine === 'number' && 'minLine' in obj && typeof obj.minLine === 'number';

export type Range = RangeImage | RangeAudio;


export interface MetadataDB {
    _id?: ObjectId;
    __v?: string;
    master?: string;
    metadata_version?: string;
}

export interface FileMeta extends MetadataDB {
    abstractAudio: string;
    file: string;
    humanDescription: string;
    id: string;
    //intervals: Interval[];
    media: MediaType;
    notes: Note[];
    range: Range;
    type: ItemType;
}

export type PitchMeta = FileMeta;

export interface ChordMeta extends FileMeta {
    type: ItemType.Chord;
    chord: Chord;
}

export interface MelodicIntervalMeta extends FileMeta {
    type: ItemType.MelodicInterval;
    interval: Interval;
}

export interface HarmonicIntervalMeta extends FileMeta {
    type: ItemType.HarmonicInterval;
    interval: Interval;
}

export interface ImageMeta extends FileMeta {
    media: MediaType.Image;
    clef: "treble" | "bass" | undefined
}

export interface AudioMeta extends FileMeta {
    media: MediaType.Audio;
    instrument: string;
    tempo: number;
}
