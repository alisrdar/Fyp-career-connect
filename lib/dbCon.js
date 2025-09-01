import mongoose from 'mongoose';

let isConnected = false; // To prevent multiple connects in dev

export async function DbCon() {
  try {
    if (isConnected) {
      console.log(" Using existing MongoDB connection");
      return;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(" MONGODB_URI not found in environment variables");
    }

    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 1000000, // Avoid long hanging
    });

    const connection = db.connection;

    connection.on('connected', () => {
      console.log(" MongoDB Connected successfully");
    });

    connection.on('error', (err) => {
      console.error(" MongoDB connection error:", err);
      process.exit(1);
    });

    isConnected = connection.readyState === 1;
  } catch (err) {
    console.error(" Failed to connect to DB:", err);
    throw err;
  }
}
