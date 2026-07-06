const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    console.error(
      "   Make sure MongoDB is running locally (mongod) or MONGO_URI in .env points to a valid Atlas free-tier cluster."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
