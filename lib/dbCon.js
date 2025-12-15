import mongoose from 'mongoose';

let isConnected = false; // To prevent multiple connects in dev

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function DbCon(params) {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("New MongoDB Connection Established");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Failed to connect to DB:", error);
    throw error;
  }
}