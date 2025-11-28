// import {errorMiddleware} from './error/errorMiddleware.js';
import Employee from '../models/employeeSchema.js';
import express from 'express';


export const createEmployee = async (req, res, next) => {
  const { firstName, lastName, email, designation, department, hiredate } = req.body;

  
  if (!firstName || !lastName || !email || !designation || !department) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields!",
    });
  }

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return res.status(400).json({
            success: false,
            message: "Email already registered!",
        });
    }

    await Employee.create({
      firstName,
      lastName,
      email,
      designation,
      department,
      hireDate: hiredate,  // Map hiredate to hireDate
    });

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    
    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};