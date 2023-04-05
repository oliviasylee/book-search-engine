const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googleBooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // Configures Mongoose to use createIndex() instead of ensureIndex().
  useFindAndModify: false, // Sets to use findOneAndUpdate() and findOneAndDelete() instead of findAndModify().
});

module.exports = mongoose.connection;
