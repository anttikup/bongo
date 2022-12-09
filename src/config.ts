export const SITE_TITLE = 'Duo Bongo';
export const MAX_HEALTH = 3;

export const EFFECTS_PATH = (fn: string) =>
    fn ? `/effects/${fn}` : "";

export const AUDIO_PATH = (fn: string) =>
    fn ? `/media/audio/${fn}` : "";

export const IMAGE_PATH = (fn: string) =>
    fn ? `/media/images/${fn}` : "";


export const MONGODB_URI = ((): string => {
    switch ( process.env.NODE_ENV ) {
        case 'development':
            if ( !process.env.DEVELOPMENT_MONGODB_URI ) {
                throw new Error('DEVELOPMENT_MONGODB_URI must be defined');
            }
            return process.env.DEVELOPMENT_MONGODB_URI;
        case 'production':
            if ( !process.env.MONGODB_URI ) {
                throw new Error('DEVELOPMENT_MONGODB_URI must be defined');
            }
            return process.env.MONGODB_URI;
        case 'test':
            if ( !process.env.TESTING_MONGODB_URI ) {
                throw new Error('TESTING_MONGODB_URI must be defined');
            }
            return process.env.TESTING_MONGODB_URI;
        default:
            throw new Error(`invalid value in NODE_ENV: ${process.env.NODE_ENV}`);
    }
})();

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
