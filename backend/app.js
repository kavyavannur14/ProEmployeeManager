import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {dbConnection} from './database/dbConnection.js';
import {errorMiddleware} from './error/error.js';
import employeeRouter from './routes/employeeRoute.js';
import taskRouter from './routes/taskRoute.js';


dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors({
       origin:[process.env.FRONTEND_URL],
       methods:["GET","POST","PUT","DELETE"],    
       credentials:true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/task', taskRouter);
dbConnection();
app.use(errorMiddleware)
export default app;