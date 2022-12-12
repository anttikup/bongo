export const MONGODB_URI = ((): string => {
    switch ( process.env.NODE_ENV ) {
        case 'development':
            if ( !process.env.DEVELOPMENT_MONGODB_URI ) {
                throw new Error();
            }
            return process.env.DEVELOPMENT_MONGODB_URI;
        case 'production':
            if ( process.env.MONGODB_URI ) {
                throw new Error('DEVELOPMENT_MONGODB_URI must be defined');
            }
            return process.env.MONGODB_URI;
        case 'test':
            if ( process.env.TESTING_MONGODB_URI ) {
                throw new Error('TESTING_MONGODB_URI must be defined');
            }
            return process.env.TESTING_MONGODB_URI;
        default:
            throw new Error(`invalid value in NODE_ENV: ${process.env.NODE_ENV}`);
    }
})();
