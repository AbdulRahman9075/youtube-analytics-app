import express from 'express';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.js';
import homeRoutes from './routes/home.js'
import mongoose from 'mongoose';
import { startScheduler } from './scheduler.js';

dotenv.config();
const app = express();

//middleware

app.use(express.json());

app.use((req,res,next)=>{
     console.log(req.path,req.method);
     next();
});

app.use('/',loginRoutes);
app.use('/home',homeRoutes);
//db

mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log('Database is connected\n');

    //scheduller
    startScheduler();

    //server runs
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`SUCCESS: Server is running on port: ${PORT}`);
    });

  })
  .catch((error)=>{
    console.error("FAILED: to Connect Database");
  })
