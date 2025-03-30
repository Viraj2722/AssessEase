import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSaveMarksMutation } from '../services/mutations';
import { useGetSubmissionByFilePathQuery } from '../services/queries';
import { API_URL } from '../lib/utils';

const PdfModal = ({ isOpen, onClose, taskType, fileKey, submissionId, teacherId, onSave }) => {
    const [marks, setMarks] = useState({});
    const [comments, setComments] = useState('');
    const [totalMarks, setTotalMarks] = useState(0);
    const [pdfError, setPdfError] = useState(false);

    const saveMarksMutation = useSaveMarksMutation();
    const totalQuestions = taskType === 'MSE' ? 6 : 3;

    // console.log("task type", taskType);

    // console.log("PdfModal props:", { isOpen, taskType, fileKey, submissionId, teacherId });


    useEffect(() => {
        if (isOpen) {
            setMarks({});
            setComments('');
            setTotalMarks(0);
            setPdfError(false);
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

    // const { data: submissionData } = useGetSubmissionByFilePathQuery(fileKey);


    // console.log("submissionData:", submissionData);
    const handleSave = async () => {
        try {
            const marksData = { marks, totalMarks, comments };
            // console.log("submission id is ",submissionId);
            // console.log("Saving marks data:", {
            //     submissionId,
            //     marksData,
            //     teacherId
            // });



            const result = await saveMarksMutation.mutateAsync({
                submissionId,
                marksData,
                teacherId
            });

            console.log("Save result:", result);
            onSave({ marks, totalMarks, comments });
            onClose();
        } catch (error) {
            console.error("Error saving marks:", error);

            // Log more details about the error
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);

                // Show error message to user
                alert(`Error: ${error.response.data.message || "Failed to save marks"}`);
            } else {
                alert("Failed to save marks. Check console for details.");
            }
        }
    };

    const handlePdfError = () => {
        console.error("Failed to load PDF");
        setPdfError(true);
    };

    if (!isOpen) return null;

    // Construct the PDF URL using the fileKey directly
    const pdfUrl = fileKey ? `${API_URL}/student/file/${fileKey}` : '';
    // console.log("PDF URL:", pdfUrl);

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
                            disabled={saveMarksMutation.isPending}
                        >
                            {saveMarksMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <div className="col-span-2 bg-gray-100 rounded-lg p-4 min-h-[600px] flex items-center justify-center">
                        {pdfError ? (
                            <div className="text-center text-red-500">
                                <p>Failed to load PDF. Please check if the file exists.</p>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline mt-2 inline-block"
                                >
                                    Try opening directly
                                </a>
                            </div>
                        ) : fileKey ? (
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="100%"
                                onError={handlePdfError}
                                style={{ border: 'none' }}
                            >
                                <p>Your browser does not support iframes. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Click here</a> to view the PDF.</p>
                            </iframe>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>No PDF file available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfModal;