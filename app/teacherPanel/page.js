"use client"
import React from 'react'
import { useState } from 'react';
import { Button, Dropdown, Modal } from 'react-bootstrap';

const page = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState('');

    const semesterSubjects = {
        1: ['Mathematics-1', 'Physics-1', 'Chemistry', 'Basic Electrical Engineering', 'Engineering Graphics'],
        2: ['Mathematics-2', 'Physics-2', 'Programming in C', 'Engineering Mechanics', 'Basic Electronics'],
        3: ['Data Structures', 'Digital Logic Design', 'Discrete Mathematics', 'Computer Organization', 'OOP'],
        4: ['Analysis of Algorithms', 'Database Management', 'Operating Systems', 'Computer Networks', 'Microprocessors'],
        5: ['Software Engineering', 'Computer Graphics', 'Web Technologies', 'Theoretical CS', 'Cryptography'],
        6: ['SPCC', 'AI', 'CSS', 'QA', 'MC', 'CC'],
        7: ['Machine Learning', 'Big Data Analytics', 'Cloud Computing', 'IoT', 'Blockchain'],
        8: ['Deep Learning', 'Natural Language Processing', 'Information Security', 'Project Management', 'Ethics in IT']
    };

    const yearClasses = {
        'FE': ['FE A', 'FE B'],
        'SE': ['SE CMPN A', 'SE CMPN B'],
        'TE': ['TE CMPN A', 'TE CMPN B'],
        'BE': ['BE CMPN A', 'BE CMPN B']
    };

    const addTask = (taskType) => {
        const taskName = `${taskType} - ${selectedSubject}`;
        const taskDate = new Date().toISOString().split('T')[0];
        setTasks([...tasks, { name: taskName, date: taskDate }]);
    };

    const toggleTaskDetails = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].showDetails = !updatedTasks[index].showDetails;
        setTasks(updatedTasks);
    };

    const editTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].editable = !updatedTasks[index].editable;
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
        }
    };

    const generateExcel = (event) => {
        event.preventDefault();
        alert('Generating Excel for this task...');
    };

    const logout = () => {
        alert('Logout clicked');
    };

    const openPdfModal = (event, taskType) => {
        event.preventDefault();
        setCurrentTaskType(taskType);
        setShowPdfModal(true);
    };

    const closePdfModal = () => {
        setShowPdfModal(false);
    };

    const saveMarksAndComments = () => {
        // Implement the logic to save marks and comments
        alert('Marks and comments saved!');
        setShowPdfModal(false);
    };

    const selectSemester = (year, semester) => {
        setSelectedYear(year);
        setSelectedSemester(semester);
        setSelectedSubject(null);
        setSelectedClass(null);
    };

    const selectSubject = (subject) => {
        setSelectedSubject(subject);
    };

    const selectClass = (className) => {
        setSelectedClass(className);
    };
    return (
        <div className="app-container">
            <nav className="sidebar">
                <h2 className="sidebar-title">Teacher Panel</h2>
                <div className="nav flex-column">
                    <a href="teacherdashboard.html" className="nav-link">Dashboard</a>
                    <a href="teacherpanel.html" className="nav-link active">Panel</a>
                </div>
            </nav>

            <main className="main-content">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="header-actions">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="semesterBtn">
                                {selectedSemester ? `${selectedYear} Semester ${selectedSemester}` : 'Semester'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {['FE', 'SE', 'TE', 'BE'].map((year, yearIndex) =>
                                    [1, 2].map(i => {
                                        const semester = yearIndex * 2 + i;
                                        return (
                                            <Dropdown.Item key={`${year}-${semester}`} onClick={() => selectSemester(year, semester)}>
                                                {`${year} Semester ${semester}`}
                                            </Dropdown.Item>
                                        );
                                    })
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="subjectBtn">
                                {selectedSubject || 'Subject'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {semesterSubjects[selectedSemester]?.map(subject => (
                                    <Dropdown.Item key={subject} onClick={() => selectSubject(subject)}>
                                        {subject}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="classBtn">
                                {selectedClass || 'Class'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {yearClasses[selectedYear]?.map(className => (
                                    <Dropdown.Item key={className} onClick={() => selectClass(className)}>
                                        {className}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Button variant="primary" onClick={logout}>Logout</Button>
                </div>

                <div className="action-buttons">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="addTaskBtn">
                            Add Task
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => addTask('ISE1')}>ISE 1</Dropdown.Item>
                            <Dropdown.Item onClick={() => addTask('ISE2')}>ISE 2</Dropdown.Item>
                            <Dropdown.Item onClick={() => addTask('MSE')}>MSE</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="primary">Integrate Excel</Button>
                </div>

                <div id="taskList">
                    {tasks.map((task, index) => (
                        <div key={index} className="task-bar">
                            <div className="task-header" onClick={() => toggleTaskDetails(index)}>
                                <div className="task-inputs">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={task.name}
                                        readOnly={!task.editable}
                                    />
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={task.date}
                                        readOnly={!task.editable}
                                    />
                                </div>
                                <span className="dropdown-icon">{task.showDetails ? '▲' : '▼'}</span>
                            </div>
                            <div className="task-buttons">
                                <Button variant="primary" onClick={() => editTask(index)}>
                                    {task.editable ? 'Save' : 'Edit'}
                                </Button>
                                <Button variant="primary" onClick={() => deleteTask(index)}>Delete</Button>
                                <Button variant="primary" onClick={generateExcel}>Generate Excel</Button>
                            </div>
                            {task.showDetails && (
                                <div className="student-table-container mt-3">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Roll No</th>
                                                <th>PID</th>
                                                <th>Name</th>
                                                <th>View PDF</th>
                                                <th>Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><input type="text" className="form-control" placeholder="Roll No" /></td>
                                                <td><input type="text" className="form-control" placeholder="PID" /></td>
                                                <td><input type="text" className="form-control" placeholder="Name" /></td>
                                                <td>
                                                    <Button variant="primary" onClick={(e) => openPdfModal(e, task.name.split(' - ')[0])}>
                                                        View PDF
                                                    </Button>
                                                </td>
                                                <td><input type="text" className="form-control" placeholder="Marks" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <Modal show={showPdfModal} onHide={closePdfModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>View PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <h5 className="mb-3">Marks Distribution</h5>
                            <div id="marksDistribution">
                                {/* Add marks distribution fields dynamically based on currentTaskType */}
                            </div>
                            <div className="mt-3">
                                <strong>Total Marks: <span id="totalMarks">0</span></strong>
                            </div>
                            <h5 className="mt-3 mb-3">Add Comments</h5>
                            <textarea className="form-control mb-3" id="commentsInput" rows="4" placeholder="Enter comments"></textarea>
                            <Button variant="primary" onClick={saveMarksAndComments}>Save</Button>
                        </div>
                        <div className="col-md-8">
                            <div className="pdf-viewer">
                                PDF Viewer Placeholder
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default page