import express from 'express';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.js';
import homeRoutes from './routes/home.js'
import subscriptionRoutes from './routes/subscription.js'
import mongoose from 'mongoose';
import { startScheduler } from './scheduler.js';
import logger from './helpers/errorHandler.js'

dotenv.config();
const app = express();

//middleware

app.use(express.json());

app.use((req,res,next)=>{
     logger.info(`${req.path}  ${req.method}`); //logger
     //logger.warn("Using deprecated feature: consider updating");
     //logger.error("Unhandled exception occurred", err);
     //console.log(req.path,req.method);
     next();
});


app.use('/api',loginRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/subscriptions',subscriptionRoutes);

app.get('/', (req, res) => {
  res.redirect('/api');
});
//db

mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    //console.log('SUCCESS:Database is connected\n');
    logger.info('SUCCESS:Database is connected'); //logger
    //scheduller
    startScheduler();

    //server runs
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      logger.info(`SUCCESS: Server is running on port: ${PORT}`); //logger
      //console.log(`SUCCESS: Server is running on port: ${PORT}`);
    });

  })
  .catch((error)=>{
    logger.error("FAILED: to Connect Database"); //logger
    //console.error("FAILED: to Connect Database");
  })
