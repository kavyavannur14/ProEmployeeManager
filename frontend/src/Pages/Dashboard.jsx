import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { FaTasks, FaTrash, FaEdit, FaClock } from "react-icons/fa"; 
import Sidebar from "../components/Sidebar";

const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"];

const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Navigation State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("landing"); // "landing", "employee", "all_pending"
  
  // Data State
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]); // List of tasks to display
  
  // Assign Task Logic State
  const [isGlobalAssign, setIsGlobalAssign] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    employeeId: "", 
    dueDate: ""
  });

  // Employee Hire Logic State
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "",
    hireDate: ""
  });

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/employee/getall");
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error); 
      }
    };
    fetchEmployees();
  }, []);

  // --- VIEW LOGIC HANDLERS ---

  // 1. When clicking an Employee in Sidebar
  const handleEmployeeSelect = async (emp) => {
      setSelectedEmployee(emp);
      setViewMode("employee");
      // Fetch tasks for this specific employee
      try {
        // Update URL to match your backend route
        const { data } = await axios.get(`http://localhost:4000/api/v1/task/getall`);
        const employeeTasks = data.tasks.filter(task => task.assignedTo._id === emp._id);
        setTasks(employeeTasks || []); 
      } catch (error) {
        console.error("Error fetching employee tasks:", error);
        setTasks([]);
      }
  };

  // 2. When clicking "View All Pending"
  const handlePendingClick = async () => {
      setSelectedEmployee(null);
      setViewMode("all_pending");
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/task/getall");
        const pendingTasks = data.tasks.filter(task => task.status === 'Pending');
        setTasks(pendingTasks || []);
      } catch (error) {
        console.error("Error fetching pending tasks:", error);
      }
  };

  // --- ACTION HANDLERS ---

  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/v1/task/delete/${taskId}`);
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
          Swal.fire('Deleted!', 'The task has been deleted.', 'success');
        } catch (error) {
          console.error("Delete error details:", error);
          Swal.fire('Error!', error.response?.data?.message || 'Something went wrong.', 'error');
        }
      }
    });
  };

  const handleGlobalAssign = () => {
    setIsGlobalAssign(true);
    setTaskData({ ...taskData, employeeId: "" }); // Reset selection
    setShowTaskModal(true);
  };

  const handleSpecificAssign = () => {
    setIsGlobalAssign(false);
    setTaskData({ ...taskData, employeeId: selectedEmployee._id }); 
    setShowTaskModal(true);
  };

  const handleAssignTask = async () => {
    if (!taskData.title || !taskData.employeeId || !taskData.dueDate) {
      Swal.fire('Error!', 'Please fill in all required fields!', 'error');
      return;
    }

    const selectedDate = new Date(taskData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Swal.fire('Warning!', 'Due date cannot be in the past!', 'warning');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/v1/task/send', {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignedTo: taskData.employeeId,
        dueDate: taskData.dueDate
      });

      if (res.data.success) {
        Swal.fire('Success!', 'Task assigned successfully!', 'success');
        setShowTaskModal(false);
        setTaskData({
          title: "",
          description: "",
          priority: "Medium",
          employeeId: "",
          dueDate: ""
        });
      }
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to assign task', 'error');
    }
  };

  const handleHireEmployee = async () => {
    if (!employeeData.firstName || !employeeData.lastName || !employeeData.email || !employeeData.department || !employeeData.designation) {
      Swal.fire('Error!', 'Please fill in all fields!', 'error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/v1/employee/send', employeeData);
      if (res.data.success) {
        Swal.fire('Success!', 'Employee hired successfully!', 'success');
        setShowEmployeeModal(false);
        setEmployeeData({ firstName: "", lastName: "", email: "", department: "", designation: "", hireDate: "" });
        // Refresh employees
        const { data } = await axios.get("http://localhost:4000/api/v1/employee/getall");
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Hire error details:", error);
      Swal.fire('Error!', error.response?.data?.message || 'Failed to hire employee', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      
      {/* --- LEFT SIDE: SIDEBAR --- */}
      <div className="w-80 h-full flex-shrink-0">
        <Sidebar 
            onSelect={handleEmployeeSelect} 
            selectedId={selectedEmployee?._id}
            onHireClick={() => setShowEmployeeModal(true)} 
            onAssignTaskClick={handleGlobalAssign} // <--- Global Button
            onPendingClick={handlePendingClick}    // <--- View Pending Button
        />
      </div>

      {/* --- RIGHT SIDE: MAIN CONTENT --- */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    {viewMode === "all_pending" 
                        ? "Global Pending Tasks" 
                        : selectedEmployee 
                            ? `Employee: ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                            : "Dashboard Overview"}
                </h1>
                
                {/* Department Badge */}
                {selectedEmployee && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        {selectedEmployee.department || "No Dept"}
                    </span>
                )}
                
                <p className="text-slate-500 mt-1">
                    {viewMode === "all_pending" ? "Showing all tasks waiting for action" : "Task Management"}
                </p>
            </div>
            
            {/* Context-Aware Assign Button */}
            {selectedEmployee && (
                <button 
                    onClick={handleSpecificAssign}
                    className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition shadow-lg shadow-slate-300"
                >
                    <FaTasks /> Assign to {selectedEmployee.firstName}
                </button>
            )}
        </div>

        {/* TASK GRID AREA */}
        <div className="space-y-4">
            {tasks.length === 0 ? (
                <div className="text-center text-slate-400 mt-20 p-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <p>No tasks found for this selection.</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow">
                        
                        {/* EDIT / DELETE BUTTONS (Visible on Hover) */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-white rounded-full transition-colors">
                                <FaEdit />
                            </button>
                            <button 
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-white rounded-full transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* Task Content */}
                        <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {task.priority}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {task.status || "Pending"}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{task.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{task.description}</p>
                        
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                             <FaClock /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>

      {/* --- MODALS --- */}
      
      {/* 1. ASSIGN TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
                {isGlobalAssign ? "Assign New Task" : `Assign to ${selectedEmployee?.firstName}`}
            </h2>
            
            <input 
              type="text" 
              placeholder="Task Title" 
              className="w-full border p-2 mb-3 rounded"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
            <textarea 
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded h-24 resize-none"
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />

            {/* SMART DROPDOWN LOGIC */}
            {isGlobalAssign ? (
                 <select 
                    className="w-full border p-2 mb-3 rounded"
                    onChange={(e) => setTaskData({...taskData, employeeId: e.target.value})}
                 >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName}
                        </option>
                    ))}
                 </select>
            ) : (
                <div className="bg-slate-100 p-2 rounded mb-3 text-slate-600 text-sm border border-slate-200">
                    Assigning to: <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong>
                </div>
            )}

            <select 
              className="w-full border p-2 mb-3 rounded"
              onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
            >
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            
            <input 
                type="date" 
                className="w-full border p-2 mb-4 rounded"
                value={taskData.dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-slate-500 hover:text-slate-700 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignTask}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. HIRE TALENT MODAL */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
              <h2 className="text-xl font-bold mb-4">Hire New Talent</h2>
              
              <div className="flex gap-2 mb-3">
                 <input 
                   type="text" 
                   placeholder="First Name" 
                   className="border p-2 rounded w-full"
                   value={employeeData.firstName}
                   onChange={(e) => setEmployeeData({...employeeData, firstName: e.target.value})}
                 />
                 <input 
                   type="text" 
                   placeholder="Last Name" 
                   className="border p-2 rounded w-full"
                   value={employeeData.lastName}
                   onChange={(e) => setEmployeeData({...employeeData, lastName: e.target.value})}
                 />
              </div>

              <input 
                type="email" 
                placeholder="Email Address" 
                className="border p-2 rounded w-full mb-3"
                value={employeeData.email}
                onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
              />

              <select 
                className="border p-2 rounded w-full mb-3"
                value={employeeData.department}
                onChange={(e) => setEmployeeData({...employeeData, department: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <input 
                type="text" 
                placeholder="Designation" 
                className="border p-2 rounded w-full mb-4"
                value={employeeData.designation}
                onChange={(e) => setEmployeeData({...employeeData, designation: e.target.value})}
              />

              <div className="flex justify-end gap-2">
                <button 
                    onClick={() => setShowEmployeeModal(false)}
                    className="text-slate-500 hover:text-slate-700 px-4 py-2"
                >
                    Cancel
                </button>
                <button 
                  onClick={handleHireEmployee}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Hire Now
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;