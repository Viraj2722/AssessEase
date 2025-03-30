
import * as XLSX from 'xlsx';

export const generateExcelReport = (reportData, taskTitle) => {
  if (!reportData || reportData.length === 0) {
    console.error('No data to generate report');
    return;
  }

  // Group data by student
  const studentMap = new Map();
  const questionNumbers = new Set();
  
  // First pass: collect all students and question numbers
  reportData.forEach(item => {
    if (!studentMap.has(item.rollNumber)) {
      studentMap.set(item.rollNumber, {
        rollNumber: item.rollNumber,
        studentName: item.studentName,
        totalMarksObtained: 0,
        totalMarks: item.totalMarks,
        questions: {}
      });
    }
    
    if (item.questionNumber !== null) {
      questionNumbers.add(item.questionNumber);
    }
  });
  
  // Sort question numbers
  const sortedQuestionNumbers = Array.from(questionNumbers).sort((a, b) => a - b);
  
  // Second pass: fill in question marks for each student
  reportData.forEach(item => {
    const student = studentMap.get(item.rollNumber);
    
    if (item.questionNumber !== null && item.marksObtained !== null) {
      student.questions[item.questionNumber] = item.marksObtained;
      student.totalMarksObtained += item.marksObtained;
    }
  });
  
  // Convert to array format for Excel
  const excelData = [];
  
  // Create header row
  const headers = ['Roll Number', 'Student Name'];
  sortedQuestionNumbers.forEach(qNum => {
    headers.push(`Q${qNum} Marks`);
  });
  headers.push('Total Marks Obtained', 'Total Marks');
  
  excelData.push(headers);
  
  // Add student data rows
  studentMap.forEach(student => {
    const row = [student.rollNumber, student.studentName];
    
    sortedQuestionNumbers.forEach(qNum => {
      row.push(student.questions[qNum] || 0);
    });
    
    row.push(student.totalMarksObtained);
    row.push(student.totalMarks);
    
    excelData.push(row);
  });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Set column widths
  const colWidths = [
    { wch: 15 }, // Roll Number
    { wch: 25 }, // Student Name
  ];
  
  // Add widths for question columns
  sortedQuestionNumbers.forEach(() => {
    colWidths.push({ wch: 10 });
  });
  
  // Add widths for total columns
  colWidths.push({ wch: 20 }, { wch: 15 });
  
  ws['!cols'] = colWidths;
  
  // Create workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Student Report');
  
  // Generate Excel file and trigger download
  const fileName = `${taskTitle.replace(/\s+/g, '_')}_Report.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};
