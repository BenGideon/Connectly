const mongoose = require('mongoose');

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
};

module.exports = {
  connectToDatabase,
};
