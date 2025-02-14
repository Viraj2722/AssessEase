import React, { useState } from 'react';
import { FileText } from 'lucide-react';

const TaskTable = ({ taskId, taskType, onViewPdf }) => {
    const [students, setStudents] = useState([{
        rollNo: '',
        pid: '',
        name: '',
        marks: ''
    }]);

    const handleInputChange = (index, field, value) => {
        const newStudents = [...students];
        newStudents[index] = {
            ...newStudents[index],
            [field]: value
        };
        setStudents(newStudents);

        // Add new row if last row is being filled
        if (index === students.length - 1 && value !== '') {
            setStudents([...newStudents, { rollNo: '', pid: '', name: '', marks: '' }]);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Roll No
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PID
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            View PDF
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marks
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="text"
                                    value={student.rollNo}
                                    onChange={(e) => handleInputChange(index, 'rollNo', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Roll No"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="text"
                                    value={student.pid}
                                    onChange={(e) => handleInputChange(index, 'pid', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="PID"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Name"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => onViewPdf(taskId, taskType, student)}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    <FileText size={16} /> View PDF
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="text"
                                    value={student.marks}
                                    onChange={(e) => handleInputChange(index, 'marks', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Marks"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;