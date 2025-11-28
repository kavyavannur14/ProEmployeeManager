import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { FaUserTie, FaPlus, FaMoon, FaSun } from 'react-icons/fa'; 

const Sidebar = ({ onSelect, selectedId, onHireClick, onAdminClick, darkMode, onToggleDark }) => {  
  const [employees, setEmployees] = useState([]);

  // Fetch employees when component loads
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Make sure this URL matches your backend!
        const res = await axios.get('http://localhost:4000/api/v1/employee/getall');
        setEmployees(res.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="h-full bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-lg">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white-600 rounded-lg">
            <FaUserTie className="text-slate-700 dark:text-slate-200 text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">ProEmployeeManager</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage your Workforce</p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-full px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {employees.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <p className="text-sm">No employees added yet</p>
          </div>
        ) : (
          employees.map((emp) => (
            <button
              key={emp._id}
              onClick={() => onSelect(emp)}
              className={`w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedId === emp._id 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-500 shadow-md' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm'
              }`}
            >
              <h3 className={`font-semibold text-sm ${
                selectedId === emp._id 
                  ? 'text-blue-700 dark:text-blue-100' 
                  : 'text-slate-800 dark:text-slate-50'
              }`}>
                {emp.firstName} {emp.lastName}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                selectedId === emp._id
                  ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {emp.designation}
              </span>
              {emp.department && (
                <p className={`text-xs mt-1 ${
                  selectedId === emp._id
                    ? 'text-blue-600 dark:text-blue-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {emp.department}
                </p>
              )}
            </button>
          ))
        )}
      </div>

      {/* Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 space-y-2">
        <button 
          onClick={onAdminClick}
          className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
        >
          All Pending Tasks
        </button>
        <button 
          onClick={onHireClick}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <FaPlus /> Add Employee
        </button>
      </div>
    </div>
  );
};

export default Sidebar;