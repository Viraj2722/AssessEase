import React from 'react';
import SubmitTask from './SubmitTask';

const TaskPanel = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.map((task) => (
        <div
          key={task.taskId}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                task.submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {task.submission.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Marks: {task.totalMarks}</p>
              {task.submission.status === 'pending' && (
                <SubmitTask 
                  taskId={task.taskId} 
                  studentId="std_1"
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