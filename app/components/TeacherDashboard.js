"use client";
import React, { useState, useEffect } from 'react';
import { useGetTeacherDashboardQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Sidebar from './TSidebar';
import SelectionDropdowns from './SelectionDropdowns';
import CirclePlaceholder from './CirclePlaceholder';

const TeacherDashboard = () => {
    const { user, loading } = useAuth("teacher");
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    
    // Get teacher ID from authenticated user
    const teacherId = user?.teacher?.id;
    
    // Use the teacher ID for fetching dashboard data
    const dashboardQuery = useGetTeacherDashboardQuery(
        selectedSemester, 
        selectedSubject, 
        selectedClass, 
        selectedTask
    );
    
    // Load teacher's subjects and other data when component mounts
    useEffect(() => {
        if (user && teacherId) {
            // You could fetch teacher's subjects here or in a separate query
            // and then populate the dropdown options
        }
    }, [user, teacherId]);
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    return (
        <div className="min-h-screen bg-[#caf0f8]">
            <div className="flex min-h-screen p-4 gap-4">
                <Sidebar />

                <div className="flex-1 bg-white rounded-lg p-5">
                    <Header />
                    
                    <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
                    <p className="mb-4">Welcome, {user?.user?.fullName}</p>

                    <SelectionDropdowns
                        selectedSemester={selectedSemester}
                        selectedSubject={selectedSubject}
                        selectedClass={selectedClass}
                        selectedTask={selectedTask}
                        onSemesterSelect={setSelectedSemester}
                        onSubjectSelect={setSelectedSubject}
                        onClassSelect={setSelectedClass}
                        onTaskSelect={setSelectedTask}
                        teacherId={teacherId} // Pass teacher ID to load relevant options
                    />

                    <CirclePlaceholder />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;