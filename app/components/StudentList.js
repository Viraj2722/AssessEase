import { useEffect } from 'react';
import { useGetTeacherStudentsListQuery } from '../services/queries';
import { FileText } from 'lucide-react';
import { data } from 'react-router-dom';

const StudentList = ({ taskId, semester, subjectId, division, onViewPdf, onUpdatePendingCount }) => {


    const { data: studentData, isLoading } = useGetTeacherStudentsListQuery(
        semester,
        "sub_2",
        division,
        taskId
    );
    // console.log("studentData", semester, subjectId, division, taskId, studentData);




    // Use useEffect to update pending counts when data is loaded
    // Calculate and report pending counts when data is loaded
    useEffect(() => {
        if (studentData?.data) {
            const pendingCount = studentData.data.filter(
                student => student.submission?.status !== 'submitted'
            ).length;
            const totalCount = studentData.data.length;

            if (onUpdatePendingCount) {
                onUpdatePendingCount(taskId, pendingCount, totalCount);
            }
        }
    }, [studentData, taskId]); // Remove onUpdatePendingCount from dependencies

    if (isLoading) return <div>Loading students...</div>;

    // console.log('Student data:', studentData);

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {studentData?.data?.map((student) => (
                    <tr key={student.rollNumber} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${student.submission?.status === 'submitted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {student.submission?.status || 'pending'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.totalMarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => onViewPdf(taskId, student)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="View PDF"
                            >
                                <FileText size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentList;