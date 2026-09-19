import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kenzna', {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed: ${error.message}`);
    console.log('🔄 Initializing in-memory MongoDB fallback for development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB In-Memory Connected: ${conn.connection.host}`);
      
      // Auto seed initial data in dev memory mode if empty
      const { autoSeedIfEmpty } = await import('../data/seeder.js');
      await autoSeedIfEmpty();
    } catch (fallbackError) {
      console.error(`❌ MongoDB Fallback Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
