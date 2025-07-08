import express from 'express';
import { PORT,MONGO_URI } from './config.js';
import path from 'path';
import loginRoutes from './routes/login.js';
import homeRoutes from './routes/home.js';
import subscriptionRoutes from './routes/subscription.js';
import userRoutes from './routes/user.js';
import logRoute from './routes/log.js';
import mongoose from 'mongoose';
import logger from './helpers/errorHandler.js';
import schedulerRoute from './routes/scheduler.js';

const app = express();
const __dirname = path.resolve();

//middleware

app.use(express.json());

app.use((req,res,next)=>{
     logger.info(`${req.path}  ${req.method}`); //logger
     next();
});

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.use('/api',loginRoutes);

app.use('/api/home',homeRoutes);
app.use('/api/subscriptions',subscriptionRoutes);
app.use('/api/user', userRoutes);
app.use('/api', logRoute);
app.use('/api/scheduler', schedulerRoute);


// app.get('/', (req, res) => {
//   res.redirect('/api');
// });

app.use(express.static(path.join(__dirname, 'build')));

console.log(path.join(__dirname, 'build', 'index.html'));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


//db
mongoose.connect(MONGO_URI)
  .then(()=>{
    logger.info('SUCCESS:Database is connected'); //logger
    //server runs
    app.listen(PORT, () => {
      logger.info(`SUCCESS: Server is running on port: ${PORT}`); //logger
    });

  })
  .catch((error)=>{
    logger.error("FAILED: to Connect Database"); //logger
  })
