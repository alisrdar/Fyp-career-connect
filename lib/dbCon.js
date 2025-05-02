import mongoose from 'mongoose';
// import { connection } from 'next/server';


// let isConnected = false;

// const dbCon = async () => {
//   if (isConnected) return 
// }
export async function DbCon() {  
    try{
        mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;
        connection.on()

        isConnected = db.connections[0].readyState
        console.log("Connected to MongoDB");
    
    } catch(err){
        console.log(" MongoDB connection error:",err);
        throw err
    }
}

 