import React from "react";

const TaskPanel = () => {
  const tasks = [
    { subject: "SPCC Home Assignment", date: "30-01-2024" },
    { subject: "CSS Home Assignment", date: "30-01-2024" },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Tasks</h2>
      <div className="mt-4 space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center space-x-4">
            <p className="flex-1">{task.subject}</p>
            <p>{task.date}</p>
            <input type="file" className="border p-1" />
            <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPanel;
