const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

// Handle the initial connection error
const makeConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }, console.log('Successfully Connected with Mongodb database'))
  } catch (error) {
    handleConnectionError(error);
  }
};

makeConnection();

/* 
  Handle any errors emerging after initial connection is established properly. 
  Since, this is basically handling the error received from mongodb we need to handle the initial
  error manually - as done above using try-catch
*/
mongoose.connection.on('error', (error) => {
  console.log(`Error from MongoDb: ${error}`);
});

const handleConnectionError = (error) => {
  console.log('Fail in connection with mongodb' + error);

  /* In every 5 second, it will try to reconnect */
  setTimeout(() => {
    console.log('Will try to make connection again after 5 seconsds')
  }, 5000);
};