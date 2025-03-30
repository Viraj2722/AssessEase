import React from 'react';
import SubmitTask from './SubmitTask';
import { useAuth } from '../hooks/useAuth';

const TaskPanel = ({ data, onTaskSubmitted, taskStatus }) => {
  // Get the authenticated user
  const { user } = useAuth("student");
  
  // Extract the student ID from the user object
  // Adjust the path based on your actual user object structure
  const studentId = user?.students?.id || user?.user?.id;

  const handleSubmitSuccess = (taskId) => {
    // Call the parent component's handler
    if (onTaskSubmitted) {
      onTaskSubmitted(taskId);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {data.map((task) => (
        <div
          key={task.taskId}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${task.submission.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
                }`}>
                {task.submission.status}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Marks: {task.totalMarks}</p>
              {taskStatus === 'pending' && task.submission.status === 'pending' && (
                <SubmitTask
                  taskId={task.taskId}
                  studentId={studentId}
                  onSubmitSuccess={handleSubmitSuccess}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPanel;