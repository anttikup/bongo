import mongoose from 'mongoose';

export * from './basic';
export * from './exercises';
export * from './learningstats';
export * from './media';
export * from './user';

export interface ErrorMessage {
    type: 'error';
    title: string;
    text: string;
}

export interface InfoMessage {
    type: 'info';
    title: string;
    text: string;
}

export interface SuccessMessage {
    type: 'success';
    title: string;
    text: string;
}

export type UIMessage = ErrorMessage | InfoMessage | SuccessMessage;
