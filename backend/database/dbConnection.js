import mongoose from 'mongoose';

export const dbConnection = () =>{
       mongoose.connect(process.env.MONGO_URI,{
              dbName:'ProEmployeeManager',
       }).then(()=>{
              console.log("Database connected successfully");
       }).catch((err)=>{
              console.log("Database connection failed during database connection");
       })
}