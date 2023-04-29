import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/routes';

dotenv.config();

const app = express();

const { PORT, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '644af935cd1a3a323f406032',
  };

  next();
});

app.use(routes);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  console.log(`Server connect db ${MONGO_URL}`);

  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
