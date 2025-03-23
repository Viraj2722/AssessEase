"use client";
import { useAuth } from "../hooks/useAuth";

const StudentInfo = ({ studentData }) => {
  const { user } = useAuth("student");

  // Use provided studentData or fall back to authenticated user data
  const data = studentData || user;



  const studentDetails = [
    { label: "Student Name", value: data?.users?.fullName || "N/A" },
    { label: "Roll Number", value: data?.students?.rollNumber || "N/A" },
    { label: "Class", value: `${data?.students?.currentYear} ${data?.students?.division}` || "N/A" },
    { label: "Academic Year", value: data?.students?.academicYear || "N/A" },
    { label: "Contact Number", value: data?.users?.contactNumber || "N/A" },
    { label: "Email", value: data?.users?.email || "N/A" },
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
