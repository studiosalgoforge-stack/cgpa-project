import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    console.log('Using cached database connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {

      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    };
    
    // Ensure your MongoDB connection string is set in your environment variables (.env file)
    const MONGODB_URI = process.env.MONGODB_URI;


    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('New database connection established.');
      return mongoose;
    });
  }
  
  // Await the promise to get the connection object
  cached.conn = await cached.promise;
  return cached.conn;
}