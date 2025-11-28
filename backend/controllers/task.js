import Task from "../models/taskSchema.js"; 
import Employee from "../models/employeeSchema.js"; 
import express from "express";

export const createTask = async (req, res, next) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;

  if (!title || !assignedTo || !dueDate) {
    return res.status(400).json({
      success: false,
      message: "Please fill in Title, Assigned Employee, and Due Date!",
    });
  }

  try {
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found! Cannot assign task.",
      });
    }

    await Task.create({
      title,
      description,
      assignedTo, 
      dueDate,
      priority,   
    });

    res.status(201).json({
      success: true,
      message: "Task Created and Assigned Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasks = async (req, res, next) => {
  try {
    // include firstName and lastName so frontend can show the employee name
    const tasks = await Task.find().populate("assignedTo", "firstName lastName email designation department");

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, assignedTo, dueDate, priority, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, assignedTo, dueDate, priority, status },
      { new: true, runValidators: true }
    ).populate("assignedTo", "firstName lastName email designation department");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task Updated Successfully!",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task Deleted Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};