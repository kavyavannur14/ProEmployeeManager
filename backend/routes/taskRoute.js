import express from "express";
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} from "../controllers/task.js";

const router = express.Router();

router.post("/send", createTask);       
router.get("/getall", getTasks);        
router.put("/update/:id", updateTask);  
router.delete("/delete/:id", deleteTask); 

export default router;