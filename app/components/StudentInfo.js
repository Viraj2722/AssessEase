import React from "react";

const StudentInfo = ({ studentData }) => {
  const studentDetails = [
    { label: "Student Name", value: studentData?.users?.fullName || "N/A" },
    { label: "Roll Number", value: studentData?.students?.rollNumber || "N/A" },
    { label: "Class", value: `${studentData?.students?.currentYear} ${studentData?.students?.division}` || "N/A" },
    { label: "Academic Year", value: studentData?.students?.academicYear || "N/A" },
    { label: "Contact Number", value: studentData?.users?.contactNumber || "N/A" },
    { label: "Email", value: studentData?.users?.email || "N/A" },
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
