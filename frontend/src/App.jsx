import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Sidebar from './components/Sidebar';
import TaskBoard from './components/Taskboard';

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState('employee'); // 'employee' or 'admin'
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    department: "",
    hiredate: ""
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    dueDate: ""
  });
  const [employees, setEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/employee/getall');
        const data = await res.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/task/getall');
        const data = await res.json();
        setAllTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching all tasks:", error);
      }
    };
    fetchAllTasks();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleHireSubmit = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/employee/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Employee hired successfully!',
          showConfirmButton: false,
          timer: 1600
        });
        setShowEmployeeModal(false);
        setEmployeeData({ firstName: "", lastName: "", email: "", designation: "", department: "", hiredate: "" });
        // Refresh employee list
        window.location.reload();
      }
    } catch (error) {
      console.error("Error hiring employee:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to hire employee' });
    }
  };
  
  const handleTaskSubmit = async () => {
    if (!taskData.title || !taskData.assignedTo || !taskData.dueDate) {
      Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill in all required fields!' });
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(taskData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Swal.fire({ icon: 'warning', title: 'Invalid date', text: 'Due date cannot be in the past! Please select today or a future date.' });
      return;
    }

    try {
      const url = editingTaskId 
        ? `http://localhost:4000/api/v1/task/update/${editingTaskId}`
        : 'http://localhost:4000/api/v1/task/send';
      
      const method = editingTaskId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: editingTaskId ? 'Task updated successfully!' : 'Task assigned successfully!',
          showConfirmButton: false,
          timer: 1600
        });
        setShowTaskModal(false);
        setEditingTaskId(null);
        setTaskData({ title: "", description: "", priority: "Medium", assignedTo: "", dueDate: "" });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to submit task' });
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedTo: task.assignedTo._id,
      dueDate: task.dueDate.split('T')[0]
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/task/delete/${taskId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Delete failed');

      // update local UI without reload
      setAllTasks(prev => prev.filter(t => t._id !== taskId));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Task deleted',
        showConfirmButton: false,
        timer: 1800
      });
    } catch (err) {
      console.error("Delete error details:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || err.message || 'Failed to delete task'
      });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-900 dark:text-slate-100">
      
      {/* LEFT SIDE: Sidebar */}
      <div className="w-80 flex-shrink-0 h-full shadow-xl z-10">
        <Sidebar 
          onSelect={(employee) => { setSelectedEmployee(employee); setCurrentPage('employee'); }}
          selectedId={selectedEmployee?._id}
          onHireClick={() => setShowEmployeeModal(true)}
          onAdminClick={() => setCurrentPage('admin')}
          currentPage={currentPage}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(prev => !prev)}
        />
      </div>

      {/* RIGHT SIDE: Main Content */}
      <div className="flex-1 h-full overflow-y-auto p-8 bg-white dark:bg-slate-950">
        
        {currentPage === 'employee' ? (
          selectedEmployee ? (
            <div className="max-w-5xl mx-auto animate-fadeIn">
              <header className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Department: <span className="font-semibold text-blue-600 dark:text-blue-300">{selectedEmployee.department}</span></p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Designation: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedEmployee.designation}</span></p>
                  </div>
                </div>
              </header>
              <TaskBoard 
                employee={selectedEmployee} 
                onAssignTaskClick={() => {
                  setEditingTaskId(null);
                  setTaskData({ title: "", description: "", priority: "Medium", assignedTo: selectedEmployee._id, dueDate: "" });
                  setShowTaskModal(true);
                }}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 flex items-center justify-center text-4xl">
                  👈
              </div>
              <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-300">No Team Member Selected</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Click on an employee in the sidebar to view their tasks.</p>
            </div>
          )
        ) : (
          // ADMIN PAGE
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">All Pending Tasks</h1>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">Overview of all pending tasks across the team</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingTaskId(null);
                    setTaskData({ title: "", description: "", priority: "Medium", assignedTo: "", dueDate: "" });
                    setShowTaskModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  + Assign New Task
                </button>
              </div>
            </header>

            {allTasks.filter(task => task.status === 'Pending').length === 0 ? (
              <div className="text-center py-10 bg-slate-100 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">No pending tasks at the moment.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {allTasks.filter(task => task.status === 'Pending').map((task) => (
                  <div key={task._id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                            task.priority === 'High' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200' : 
                            'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{task.title}</h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{task.description}</p>
                        <p className="text-slate-700 dark:text-slate-200 text-sm mt-3">
                          Assigned to: <span className="font-semibold">{task.assignedTo?.firstName} {task.assignedTo?.lastName}</span>
                        </p>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
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
        )}
      </div>

      {/* HIRE EMPLOYEE MODAL */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">Hire New Talent</h2>
            
            <input 
              type="text" 
              placeholder="First Name" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.firstName}
              onChange={(e) => setEmployeeData({...employeeData, firstName: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="Last Name" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.lastName}
              onChange={(e) => setEmployeeData({...employeeData, lastName: e.target.value})}
            />
            
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.email}
              onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="Designation" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.designation}
              onChange={(e) => setEmployeeData({...employeeData, designation: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="Department" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.department}
              onChange={(e) => setEmployeeData({...employeeData, department: e.target.value})}
            />
            
            <input 
              type="date" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={employeeData.hiredate}
              onChange={(e) => setEmployeeData({...employeeData, hiredate: e.target.value})}
            />
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowEmployeeModal(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleHireSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Hire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">{editingTaskId ? 'Edit Task' : 'Assign New Task'}</h2>
            
            <input 
              type="text" 
              placeholder="Task Title" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={taskData.title}
              onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            />
            
            <textarea 
              placeholder="Description" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={taskData.description}
              onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            />
            
            <select 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            
            <select 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={taskData.priority}
              onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            
            <input 
              type="date" 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 p-2 mb-3 rounded"
              value={taskData.dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
            />
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTaskId(null);
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleTaskSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {editingTaskId ? 'Update' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;