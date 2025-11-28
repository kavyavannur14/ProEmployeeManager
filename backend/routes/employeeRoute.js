import express from 'express';
import {createEmployee,getEmployees} from '../controllers/employee.js';

const router = express.Router();

router.post("/send", createEmployee); 
router.get("/getall", getEmployees);

export default router;