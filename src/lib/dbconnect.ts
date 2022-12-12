/**
 * From https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
 *
 * This is used for everything except file information.
 **/

import mongoose from 'mongoose'

import { MONGODB_URI } from '../dbconfig';


if ( !MONGODB_URI ) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if ( !cached ) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if ( cached.conn ) {
        return cached.conn
    }

    if ( !cached.promise ) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts)
                                 .then((mongoose) => {
                                     return mongoose
                                 })
    }

    try {
        cached.conn = await cached.promise
    } catch ( e ) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect
