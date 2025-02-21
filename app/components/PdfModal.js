import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PdfModal = ({ isOpen, onClose, taskType, onSave }) => {
    const [marks, setMarks] = useState({});
    const [comments, setComments] = useState('');
    const [totalMarks, setTotalMarks] = useState(0);

    const totalQuestions = taskType === 'MSE' ? 6 : 3;

    useEffect(() => {
        if (isOpen) {
            setMarks({});
            setComments('');
            setTotalMarks(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const total = Object.values(marks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);
        setTotalMarks(total);
    }, [marks]);

    const handleMarkChange = (questionNumber, value) => {
        setMarks(prev => ({
            ...prev,
            [`Q${questionNumber}`]: value
        }));
    };

    const handleSave = () => {
        onSave({ marks, totalMarks, comments });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-6xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">View PDF</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Marks Distribution</h3>
                        <div className="space-y-3">
                            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((questionNumber) => (
                                <div key={questionNumber} className="flex items-center gap-2">
                                    <label className="w-12">Q{questionNumber}:</label>
                                    <input
                                        type="number"
                                        className="border rounded px-3 py-2 w-full"
                                        value={marks[`Q${questionNumber}`] || ''}
                                        onChange={(e) => handleMarkChange(questionNumber, e.target.value)}
                                        placeholder={`Marks for Q${questionNumber}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 font-semibold">
                            Total Marks: {totalMarks}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Comments</h3>
                            <textarea
                                className="w-full border rounded p-2 h-32"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter comments..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Save
                        </button>
                    </div>

                    <div className="col-span-2 bg-gray-100 rounded-lg p-4 min-h-[600px] flex items-center justify-center">
                        <p className="text-gray-500">PDF Viewer Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfModal;