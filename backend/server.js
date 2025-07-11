import express from 'express';
import cors from 'cors';
import { PORT,MONGO_URI,FRONTEND_BASE } from './config.js';
import loginRoutes from './routes/login.js';
import homeRoutes from './routes/home.js';
import subscriptionRoutes from './routes/subscription.js';
import userRoutes from './routes/user.js';
import logRoute from './routes/log.js';
import mongoose from 'mongoose';
import logger from './helpers/errorHandler.js';
import schedulerRoute from './routes/scheduler.js';

const app = express();

//middleware

app.use(cors({
  origin: FRONTEND_BASE, // Allow frontend domain
}));

app.use(express.json());

app.use((req,res,next)=>{
     logger.info(`${req.path}  ${req.method}`); //logger
     next();
});

app.use('/api',loginRoutes);

app.use('/api/home',homeRoutes);
app.use('/api/subscriptions',subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/api', logRoute);
app.use('/api/scheduler', schedulerRoute);

//db
mongoose.connect(MONGO_URI)
  .then(()=>{
    logger.info('SUCCESS:Database is connected');
    //server runs
    app.listen(PORT, () => {
      logger.info(`SUCCESS: Server is running on port: ${PORT}`);
    });

  })
  .catch((error)=>{
    logger.error("FAILED: to Connect Database"); 
  })
