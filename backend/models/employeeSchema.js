import mongoose from 'mongoose';
import validator from 'validator';

const employeeSchema = new mongoose.Schema({
       firstName: {
       type: String,    
       required: [true, 'First name is required'],
       trim: true,
       maxlength: [50, 'First name cannot exceed 50 characters']
       },
       lastName: {
       type: String,
       required: [true, 'Last name is required'],
       trim: true,
       maxlength: [50, 'Last name cannot exceed 50 characters']
       },
       email: {
       type: String,
       required: [true, 'Email is required'],
       unique: true,
       lowercase: true,
       trim: true,   
       validate: [validator.isEmail, 'Please provide a valid email address']
      },
       designation: {
       type: String,
       required: [true, 'Designation is required'],
       trim: true,
       maxlength: [100, 'Designation cannot exceed 100 characters']
       },
       department: {
       type: String,
       required: [true, 'Department is required'],
       trim: true,
       maxlength: [100, 'Department cannot exceed 100 characters']
       },
       hireDate: {
       type: Date,
       required: [true, 'Hire date is required'],
       default: Date.now
       },
         
       });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;