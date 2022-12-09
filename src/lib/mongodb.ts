/**
 * From https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts
 *
 * This is used for getting file information from mongodb which don't have mongoose schemas.
 **/

import { MongoClient } from 'mongodb'

import { MONGODB_URI } from '../config';

const options = {}

let client
let clientPromise: Promise<MongoClient>

if ( process.env.NODE_ENV === 'development' ) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if ( !global._mongoClientPromise ) {
        client = new MongoClient(MONGODB_URI, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options)
    clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
