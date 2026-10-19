import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxedrive_db');
    console.log(`✅ [MongoDB] Connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB Error] Échec de connexion : ${error.message}`);
    process.exit(1);
  }
};
