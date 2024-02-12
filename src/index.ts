import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import connect from './utils/db';
import index from './routes/index';
import verifyToken from './utils/jwt';
import cookieParser from 'cookie-parser';
import errorHandler from './utils/errorhandler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

connect();

app.use('/', index);
app.use(errorHandler);

app.get('/protected', verifyToken, (req: Request, res: Response) => {
  res.send('Protected Hello World');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
