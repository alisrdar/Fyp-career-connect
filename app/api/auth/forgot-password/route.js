import mongoose from 'mongoose';

let cached = global.mongoose; 
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function DbCon() {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in env");
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection promise");
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,      // disable query buffering
      bufferMaxEntries: 0,        // if you really wanna block
    }).then((mongooseInstance) => {
      console.log("MongoDB Connected successfully");
      return mongooseInstance;
    }).catch(err => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance;
  return cached.conn;
}
