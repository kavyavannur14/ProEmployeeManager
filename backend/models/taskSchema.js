import mongoose from 'mongoose';    

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true 
    },
   
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        required: [true, 'You must assign this task to an employee']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
   
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    }
}, {
    timestamps: true 
});

const Task = mongoose.model('Task', taskSchema);

export default Task;