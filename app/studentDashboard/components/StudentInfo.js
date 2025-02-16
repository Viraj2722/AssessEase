import React from "react";

const StudentInfo = () => {
  const studentDetails = [
    { label: "Student Name", value: "John Doe" },
    { label: "Roll Number", value: "26" },
    { label: "Class", value: "TE CMPN-B" },
    { label: "Academic Year", value: "2024-2025" },
    { label: "Contact Number", value: "+1 234 567 8900" },
    { label: "Email", value: "john.doe@example.com" },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-md mt-4 grid grid-cols-2 gap-4">
      {studentDetails.map((detail, index) => (
        <div key={index} className="p-4 border rounded bg-gray-50">
          <p className="text-gray-600">{detail.label}</p>
          <p className="font-semibold">{detail.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentInfo;
