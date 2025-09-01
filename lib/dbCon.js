import mongoose from 'mongoose';
// import { connection } from 'next/server';

let isConnected = false;

export async function DbCon() {  
    try{
        if (isConnected) {
            console.log(" Using existing MongoDB connection");
            return;
          }

        if (!process.env.MONGODB_URI) {
        throw new Error(" MONGODB_URI not found in environment variables");
        }
        const db = await mongoose.connect(process.env.MONGODB_URI);
        const connection = db.connection;

        connection.on('connected', () => {
          console.log("MongoDB Connected successfully");
        })

        connection.on('error', (err) => {
          console.log("MongoDB connection error, please make sure DB is runng: "+ err);
          process.exit();
        })

        isConnected = connection.readyState;
        // isConnected = db.connections[0].readyState
        // console.log("Connected to MongoDB");
    
    } catch(err){
        console.log(" Something went wrong in connecting to DB:",err);
        throw err
    }
}
