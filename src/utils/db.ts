import mongoose, {ConnectOptions} from 'mongoose';

const MONGO_URI =
  'mongodb+srv://burakkepuc:Burakkep3@photorepocluster.qpqnj5q.mongodb.net/';

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connection successfull.');
  } catch (error) {
    console.error('Connection Error', error);
  }
};

export default connect;
