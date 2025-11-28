import { Task } from "../models/Task.js";
import { Employee } from "../models/Employee.js"; 

export const assignTask = async (req, res) => {
  try {
    const { title, description, employeeId, priority, dueDate } = req.body;

    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found!" });
    }

    
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo: employeeId, // This links it to the employee
      status: "Pending"
    });

    await newTask.save();

    res.status(201).json({ success: true, message: "Task Assigned Successfully", task: newTask });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};