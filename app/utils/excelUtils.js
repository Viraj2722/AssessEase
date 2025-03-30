  import * as XLSX from 'xlsx';

// Function for generating Excel report for a single task
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

// Separate function for generating integrated Excel report for multiple tasks
export const generateIntegratedExcelReport = (reportData, reportTitle) => {
  if (!reportData || reportData.length === 0) {
    console.error('No data to generate integrated report');
    return;
  }

  // Group data by student and task
  const studentMap = new Map();
  const taskMap = new Map();
  const questionNumbersMap = new Map(); // Track question numbers for each task
  
  // First pass: collect all students, tasks, and question numbers
  reportData.forEach(item => {
    // Track unique students
    if (!studentMap.has(item.rollNumber)) {
      studentMap.set(item.rollNumber, {
        rollNumber: item.rollNumber,
        studentName: item.studentName,
        tasks: new Map()
      });
    }
    
    // Track unique tasks
    const taskKey = `${item.taskId}-${item.taskType}`;
    if (!taskMap.has(taskKey)) {
      taskMap.set(taskKey, {
        taskId: item.taskId,
        title: item.taskTitle,
        type: item.taskType,
        totalMarks: item.totalMarks
      });
    }
    
    // Track question numbers for each task
    if (!questionNumbersMap.has(taskKey)) {
      questionNumbersMap.set(taskKey, new Set());
    }
    if (item.questionNumber !== null) {
      questionNumbersMap.get(taskKey).add(item.questionNumber);
    }
    
    // Initialize task data for this student if not exists
    const student = studentMap.get(item.rollNumber);
    if (!student.tasks.has(taskKey)) {
      student.tasks.set(taskKey, {
        marksObtained: 0,
        totalMarks: item.totalMarks,
        questions: {}
      });
    }
    
    // Add question marks
    if (item.questionNumber !== null && item.marksObtained !== null) {
      const taskData = student.tasks.get(taskKey);
      taskData.questions[item.questionNumber] = item.marksObtained;
      taskData.marksObtained += item.marksObtained;
    }
  });
  
  // Convert task map to sorted array
  const sortedTasks = Array.from(taskMap.values()).sort((a, b) => {
    // Sort by task type first, then by title
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.title.localeCompare(b.title);
  });
  
  // Create Excel data with hierarchical headers
  const excelData = [];
  
  // Create header rows (two levels)
  const topHeaders = ['', '']; // Empty cells for Roll Number and Student Name
  const bottomHeaders = ['Roll Number', 'Student Name'];
  
  // Add task columns with sub-columns for each question
  sortedTasks.forEach(task => {
    const taskKey = `${task.taskId}-${task.type}`;
    const questionNumbers = Array.from(questionNumbersMap.get(taskKey) || []).sort((a, b) => a - b);
    
    // Calculate span for this task (number of questions + 2 for total obtained and total marks)
    const taskSpan = questionNumbers.length + 2;
    
    // Add task title to top header (spanning multiple columns)
    topHeaders.push(`${task.title} (${task.type})`);
    for (let i = 1; i < taskSpan; i++) {
      topHeaders.push(''); // Empty cells for spanning
    }
    
    // Add individual question columns and totals to bottom header
    questionNumbers.forEach(qNum => {
      bottomHeaders.push(`Q${qNum}`);
    });
    bottomHeaders.push('Obtained');
    bottomHeaders.push('Total');
  });
  
  // Add overall column
  topHeaders.push('Overall');
  bottomHeaders.push('Percentage');
  
  excelData.push(topHeaders);
  excelData.push(bottomHeaders);
  
  // Add student data rows
  studentMap.forEach(student => {
    const row = [student.rollNumber, student.studentName];
    
    let totalMarksObtained = 0;
    let totalPossibleMarks = 0;
    
    // Add marks for each task
    sortedTasks.forEach(task => {
      const taskKey = `${task.taskId}-${task.type}`;
      const taskData = student.tasks.get(taskKey);
      const questionNumbers = Array.from(questionNumbersMap.get(taskKey) || []).sort((a, b) => a - b);
      
      if (taskData) {
        // Add individual question marks
        questionNumbers.forEach(qNum => {
          row.push(taskData.questions[qNum] || 0);
        });
        
        // Add total obtained marks for this task
        row.push(taskData.marksObtained);
        
        // Add total possible marks for this task
        row.push(taskData.totalMarks);
        
        totalMarksObtained += taskData.marksObtained;
        totalPossibleMarks += taskData.totalMarks;
      } else {
        // Fill with N/A if student has no data for this task
        for (let i = 0; i < questionNumbers.length + 2; i++) {
          row.push('N/A');
        }
      }
    });
    
    // Calculate and add overall percentage
    const overallPercentage = totalPossibleMarks > 0 
      ? ((totalMarksObtained / totalPossibleMarks) * 100).toFixed(2) + '%'
      : 'N/A';
    
    row.push(overallPercentage);
    
    excelData.push(row);
  });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Set column widths
  const colWidths = [
    { wch: 15 }, // Roll Number
    { wch: 25 }, // Student Name
  ];
  
  // Add widths for all other columns
  for (let i = 2; i < bottomHeaders.length; i++) {
    colWidths.push({ wch: 10 });
  }
  
  ws['!cols'] = colWidths;
  
  // Set merged cells for the top header row
  const merges = [];
  let colIndex = 2; // Start after Roll Number and Student Name
  
  sortedTasks.forEach(task => {
    const taskKey = `${task.taskId}-${task.type}`;
    const questionCount = questionNumbersMap.get(taskKey)?.size || 0;
    const span = questionCount + 2; // Questions + Obtained + Total
    
    // Add merge for this task's header
    merges.push({
      s: { r: 0, c: colIndex },
      e: { r: 0, c: colIndex + span - 1 }
    });
    
    colIndex += span;
  });
  
  ws['!merges'] = merges;
  
  // Create workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Integrated Report');
  
  // Add a summary sheet
  const summaryData = [
    ['Report Summary'],
    [''],
    ['Generated On', new Date().toLocaleString()],
    ['Subject', reportTitle.split('_')[0]],
    ['Semester', reportTitle.split('_')[1]],
    ['Class', reportTitle.split('_')[2]],
    [''],
    ['Tasks Included:'],
    ['Task Title', 'Task Type', 'Total Marks', 'Questions']
  ];
  
  sortedTasks.forEach(task => {
    const taskKey = `${task.taskId}-${task.type}`;
    const questionCount = questionNumbersMap.get(taskKey)?.size || 0;
    summaryData.push([
      task.title, 
      task.type, 
      task.totalMarks,
      questionCount
    ]);
  });
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  // Generate Excel file and trigger download
  const fileName = `${reportTitle.replace(/\s+/g, '_')}_Integrated_Report.xlsx`;
  XLSX.writeFile(wb, fileName);
  
  return fileName;
};
