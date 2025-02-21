import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './TSidebar';
import SelectionDropdowns from './SelectionDropdowns';
import CirclePlaceholder from './CirclePlaceholder';

const TeacherDashboard = () => {
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTask, setSelectedTask] = useState('');

    const handleLogout = () => {
        alert('Logout clicked');
    };

    return (
        <div className="min-h-screen bg-[#caf0f8]">
            <div className="flex min-h-screen p-4 gap-4">
                <Sidebar />

                <div className="flex-1 bg-white rounded-lg p-5">
                    <Header onLogout={handleLogout} />

                    <SelectionDropdowns
                        selectedSemester={selectedSemester}
                        selectedSubject={selectedSubject}
                        selectedClass={selectedClass}
                        selectedTask={selectedTask}
                        onSemesterSelect={setSelectedSemester}
                        onSubjectSelect={setSelectedSubject}
                        onClassSelect={setSelectedClass}
                        onTaskSelect={setSelectedTask}
                    />

                    <CirclePlaceholder />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;