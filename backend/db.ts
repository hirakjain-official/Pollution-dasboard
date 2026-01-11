import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollution_dashboard';

        // Set connection timeout to avoid hanging
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000, // 3 second timeout
        });

        console.log('✅ MongoDB Connected Successfully');
        return true;
    } catch (error) {
        console.warn('\n⚠️  MongoDB NOT CONNECTED - Running in MOCK DATA mode');
        console.warn('💡 To enable full database features:');
        console.warn('   Option 1: Install MongoDB locally');
        console.warn('   Option 2: Use MongoDB Atlas (free): https://mongodb.com/atlas');
        console.warn('   Then update MONGODB_URI in .env\n');
        return false;
    }
}
