import mongoose, {ConnectOptions} from 'mongoose';
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI as string;

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connection successfull.');
  } catch (error) {
    console.error('Connection Error', error);
  }
};

export default connect;
