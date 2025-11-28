import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';

const TaskBoard = ({ employee, onAssignTaskClick, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch tasks whenever the selected 'employee' changes
  useEffect(() => {
    // Define the function INSIDE the effect to fix the linting error
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:4000/api/v1/task/getall');
        
        // Filter: Keep tasks where assignedTo._id matches current employee
        const employeeTasks = res.data.tasks.filter(
          task => task.assignedTo?._id === employee._id
        );
        
        setTasks(employeeTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    // Only run if we actually have an employee selected
    if (employee) {
      fetchTasks();
    }
  }, [employee]); // Dependency array is now clean

  // Helper to get color based on Priority
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400 dark:text-slate-400">Loading tasks...</div>;
  
  return (
    <div>
      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-700">
            Tasks ({tasks.length})
        </h3>
        <button 
          onClick={onAssignTaskClick}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition shadow-lg">
            + Assign New Task
        </button>
      </div>

      {/* TASK GRID */}
      {tasks.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No tasks assigned to {employee.firstName} yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex justify-between items-start"
            >
                <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                         <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getPriorityColor(task.priority)}`}>
                             {task.priority}
                         </span>
                         <span className="text-slate-400 text-xs flex items-center gap-1">
                             <FaHourglassHalf /> Due: {new Date(task.dueDate).toLocaleDateString()}
                         </span>
                     </div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-50">{task.title}</h4>
                    <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">{task.description}</p>
                 </div>
                 
                 {/* Status Badge & Action Buttons */}
                 <div className="flex flex-col items-end gap-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                         task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                     }`}>
                         {task.status}
                     </span>
                     
                     {/* Hover Action Buttons */}
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                           onClick={() => onEditTask(task)}
                           className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition"
                         >
                           ✎ Edit
                         </button>
                         <button
                           onClick={() => onDeleteTask(task._id)}
                           className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                         >
                           🗑 Delete
                         </button>
                     </div>
                 </div>
             </div>
           ))}
         </div>
       )}
     </div>
   );
 };
 
 export default TaskBoard;