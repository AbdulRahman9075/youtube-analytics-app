import express from 'express';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.js';
import homeRoutes from './routes/home.js'
import mongoose from 'mongoose';

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
    //server runs
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });

  })
  .catch((error)=>{
    console.log(error);
  })

