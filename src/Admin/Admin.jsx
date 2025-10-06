import axios from "axios";
import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  GraduationCapIcon,
  Grid2X2,
  Hourglass,
  Loader2Icon,
  MailIcon,
  Menu,
  MessageCircle,
  PhoneIcon,
  Plus,
  ShieldIcon,
  Trash2Icon,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import ChatBox from "../ChatBox";
import Header from "../Layout/Header";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [profileData, setProfileData] = useState([]);
  const [openApproveFilter, setOpenApprovefilter] = useState(false);
  const [activeApprove, setActiveApprove] = useState("all");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [courseLoading, setCourseLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectsloading, setSubjectsloading] = useState(false);
  
  // Filter states for Courses Tab
  const [filterBatchYear, setFilterBatchYear] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [pendingApprovels, setPendingApprovels] = useState([]);
  const [filteredApprovels, setFilterdApprovels] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requestsSize, setRequestsSize] = useState(0);
  const [courseID, setCourseID] = useState("");
  const [isChatopen, setisChatOpen] = useState(false);

  // State for Reports tab
  const [classSessions, setClassSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // NEW: Dedicated filter states for the Reports tab
  const [reportFilterDate, setReportFilterDate] = useState("");
  const [reportFilterYear, setReportFilterYear] = useState("");


  const activeroles = [
    { id: "all", icon: Grid2X2 },
    { id: "student", icon: GraduationCapIcon },
    { id: "lecturer", icon: BookOpen },
    { id: "registrar", icon: ClipboardList },
  ];

  const [formDataCourse, setFormDataCourse] = useState({
    subjectCode: "", name: "", year: "", semester: "", lecturerId: "", batchYear: "", subpinCode: "",
  });

  const [studentList, setStudentList] = useState([]);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    if (!courseID) return;
    const fetchStudents = async () => {
      try {
        const response = await fetch(`https://attendance-uni-backend.vercel.app/subjects/getsubjects/${courseID}`);
        const data = await response.json();
        if (data && data.success) {
          setSubject(data.subject);
          setStudentList(data.subject.studentsEnrolled || []);
        }
      } catch (e) { console.log(e); }
    };
    fetchStudents();
  }, [courseID]);

  const handleDelete = (studentId) => {
    console.log("Delete student:", studentId);
    setStudentList(studentList.filter((id) => id !== studentId));
  };

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setProfileData(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const getApprovels = async () => {
      try {
        const res = await fetch("https://attendance-uni-backend.vercel.app/users/getnotapproved");
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setRequestsSize(data.users.length);
          setPendingApprovels(data.users);
          setFilterdApprovels(data.users);
        }
      } catch (e) { console.error(e); }
    };
    getApprovels();
  }, []);

  useEffect(() => {
    const fetchSubjectsAndSessions = async () => {
      setSubjectsloading(true);
      setSessionsLoading(true);
      try {
        const subjectsResponse = await axios.get("https://attendance-uni-backend.vercel.app/subjects/getsubjects");
        if (subjectsResponse.data.success) {
          setSubjects(subjectsResponse.data.subjects);
        }

        const sessionsResponse = await axios.get("https://attendance-uni-backend.vercel.app/class/getall");
        if (sessionsResponse.data.success) {
          setClassSessions(sessionsResponse.data.data);
          setFilteredSessions(sessionsResponse.data.data); // Initially show all
        }

      } catch (err) {
        console.log(err);
        setToast({ message: "Failed to load data.", type: false });
      } finally {
        setSubjectsloading(false);
        setSessionsLoading(false);
      }
    };
    fetchSubjectsAndSessions();
  }, []);

  // Effect for Courses tab filtering
  useEffect(() => {
    const filtered = subjects.filter((subject) => {
      const matchBatchYear = filterBatchYear ? subject.batchYear === Number(filterBatchYear) : true;
      const matchYear = filterYear ? subject.year === Number(filterYear) : true;
      const matchSemester = filterSemester ? subject.semester === Number(filterSemester) : true;
      return matchBatchYear && matchYear && matchSemester;
    });
    setFilteredSubjects(filtered);
  }, [subjects, filterBatchYear, filterYear, filterSemester]);

  
  // *** NEW: Updated useEffect for Report Filtering (Date and Year) ***
  useEffect(() => {
    if (Array.isArray(classSessions)) {
      let tempSessions = [...classSessions];

      // Filter by Date
      if (reportFilterDate) {
        tempSessions = tempSessions.filter(session => {
          const sessionDate = new Date(session.date).toISOString().split('T')[0];
          return sessionDate === reportFilterDate;
        });
      }

      // Filter by Year of Study
      if (reportFilterYear) {
        tempSessions = tempSessions.filter(session => {
          return session.subjectID?.year === Number(reportFilterYear);
        });
      }

      setFilteredSessions(tempSessions);
    }
  }, [reportFilterDate, reportFilterYear, classSessions]);


  useEffect(() => {
    if (pendingApprovels.length > 0) {
      if (activeApprove === "all") setFilterdApprovels(pendingApprovels);
      else setFilterdApprovels(pendingApprovels.filter((item) => item.role === activeApprove));
    } else setFilterdApprovels([]);
  }, [activeApprove, pendingApprovels]);

  const handleInputChangeCourse = (e) => setFormDataCourse({ ...formDataCourse, [e.target.name]: e.target.value });

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setCourseLoading(true);
    try {
      const res = await axios.post("https://attendance-uni-backend.vercel.app/subjects/create", formDataCourse);
      if (res.data.success) {
        setToast({ message: "Course added successfully", type: true });
        setShowAddCourse(false);
        setFormDataCourse({ subjectCode: "", name: "", year: "", semester: "", lecturerId: "", batchYear: "", });
      } else setToast({ message: "Failed to add course", type: false });
    } catch (error) {
      setToast({ message: "Enter valid details", type: false });
    } finally { setCourseLoading(false); }
  };

  const addApprove = async (reg_no) => {
    try {
      const response = await axios.put(`https://attendance-uni-backend.vercel.app/users/approve/${reg_no}`);
      if (response.data.success) {
        setToast({ message: "Approving success", type: true });
        setPendingApprovels((prev) => prev.filter((u) => u.reg_no !== reg_no));
        setFilterdApprovels((prev) => prev.filter((u) => u.reg_no !== reg_no));
      } else setToast({ message: response.data.message, type: false });
    } catch (error) { setToast({ message: "Error approving user", type: false }); }
  };

  const removeUser = async (reg_no) => {
    try {
      const response = await axios.delete(`https://attendance-uni-backend.vercel.app/users/deleteuser/${reg_no}`);
      if (response.data.success) {
        setToast({ message: "User removed successfully", type: true });
        setPendingApprovels((prev) => prev.filter((u) => u.reg_no !== reg_no));
        setFilterdApprovels((prev) => prev.filter((u) => u.reg_no !== reg_no));
      } else setToast({ message: response.data.message, type: false });
    } catch (error) { setToast({ message: "Error removing user", type: false }); }
  };

  const handleSelectClass = (session) => {
    setSelectedClass(session);
    setAttendeesLoading(true);
    const attendedRegNumbers = session.studentsAttended.map(student => student.reg_no);
    setAttendees(attendedRegNumbers);
    setAttendeesLoading(false);
  };

  // NEW: Updated function to handle downloading the CSV report
  const handleDownloadReport = () => {
    if (!selectedClass || attendees.length === 0) {
      setToast({ message: "No attendance data to download.", type: false });
      return;
    }

    const subjectDetails = subjects.find(s => s._id === selectedClass.subjectID._id);
    
    const reportDate = new Date(selectedClass.date);
    const longDateString = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const lecturerName = selectedClass.lecturer?.name || 'N/A';
    const lecturerId = selectedClass.lecturer?.reg_no || 'N/A';
    const registrarId = selectedClass.registor?.reg_no || 'N/A';

    const headers = ["Registration No"];
    const rows = attendees.map(regNo => [regNo]);
    const attendanceCount = attendees.length;

    let csvContent = "data:text/csv;charset=utf-8,";

    // --- CSV Header Section with Updated Titles ---
    csvContent += `Course:,"${subjectDetails?.name || ''} (${subjectDetails?.subjectCode || ''})"\n`;
    csvContent += `Date:,"${longDateString}"\n`;
    csvContent += `Lecturer Name:,"${lecturerName}"\n`;
    csvContent += `Lecturer ID:,${lecturerId}\n`;
    csvContent += `Registrar ID (Marked By):,${registrarId}\n\n`;

    // Main Data Table
    csvContent += headers.join(",") + "\n";
    csvContent += rows.map(e => e.join(",")).join("\n");

    // --- Footer Section with Updated Title ---
    csvContent += `\n\nTotal Attendance Count:,${attendanceCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `Attendance_${subjectDetails?.subjectCode || 'Report'}_${reportDate.toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Management
              </h2>
              <button
                onClick={() => setShowAddCourse(true)}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-900 text-white rounded-lg w-full sm:w-auto"
              >
                <Plus size={18} className="mr-2" /> Add Course
              </button>
            </div>
            {showAddCourse && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
                  <button onClick={() => setShowAddCourse(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={28} className="text-gray-600 hover:text-gray-900" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitCourse}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Course Name" value={formDataCourse.name} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                    <input type="text" name="subjectCode" placeholder="Course ID" value={formDataCourse.subjectCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="number" name="batchYear" placeholder="Academic Year" value={formDataCourse.batchYear} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                    <select name="year" value={formDataCourse.year} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0">
                      <option disabled value="">Year</option> <option value="1">1st Year</option> <option value="2">2nd Year</option> <option value="3">3rd Year</option> <option value="4">4th Year</option>
                    </select>
                    <select name="semester" value={formDataCourse.semester} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0">
                      <option disabled value="">Semester</option> <option value="1">1</option> <option value="2">2</option>
                    </select>
                    <input type="text" name="lecturerId" placeholder="Lecture ID" value={formDataCourse.lecturerId} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                  </div>
                  <div className="grid grid-cols-2">
                    <input type="text" name="subpinCode" placeholder="Subject Pin Code" value={formDataCourse.subpinCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-900 min-w-[110px]">
                      {courseLoading ? (<Loader2Icon size={24} className="animate-spin mx-auto" />) : ("Add Course")}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select value={filterBatchYear} onChange={(e) => setFilterBatchYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Academic Year</option> <option value="2021">2021</option> <option value="2022">2022</option> <option value="2023">2023</option>
                </select>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Year</option> <option value="1">1st</option> <option value="2">2nd</option> <option value="3">3rd</option> <option value="4">4th</option>
                </select>
                <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Semester</option> <option value="1">1st</option> <option value="2">2nd</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {subjectsloading && (<div className="flex justify-center mt-14"><Loader2Icon size={40} className="animate-spin text-purple-700" /></div>)}
              {!subjectsloading && filteredSubjects.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-lg hover:bg-gray-50 p-4 border-2 border-purple-200 hover:border-purple-400" onClick={() => { setCourseID(course._id); setActiveTab("studentList"); }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-800">Lecture ID: {course.lecturerId}</p>
                      <p className="text-gray-800">Subject Pin Code: {course.subpinCode}</p>
                      <p className="text-gray-800">{course.subjectCode}</p>
                      <p className="text-sm text-gray-700">Year: {course.year}, Semester: {course.semester}, Batch: {course.batchYear}</p>
                    </div>
                    <div className="flex gap-3 self-end sm:self-center">
                      <button className="p-2 hover:bg-gray-200 rounded-full"><User size={24} className="text-green-500" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-full"><Trash2Icon size={24} className="text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Class Session Reports</h2>

            {/* *** NEW: Updated Filter Section *** */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Filter Classes</h3>
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  
                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                      <label htmlFor="reportDate" className="text-sm font-medium text-gray-700">Select Date:</label>
                      <input 
                        type="date"
                        id="reportDate"
                        value={reportFilterDate}
                        onChange={(e) => setReportFilterDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                  </div>

                  {/* Year of Study Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Select Year:</label>
                    <select value={reportFilterYear} onChange={(e) => setReportFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option value="">All Years</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Class Sessions</h3>
              {sessionsLoading ? (
                <div className="flex justify-center py-10"><Loader2Icon size={40} className="animate-spin text-purple-700" /></div>
              ) : filteredSessions.length > 0 ? (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {filteredSessions.map((session) => (
                    <div key={session._id} onClick={() => handleSelectClass(session)} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 cursor-pointer hover:bg-purple-100 hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{session.subjectID?.name || 'Unknown Course'}</p>
                          <p className="text-sm text-gray-600">{session.subjectID?.subjectCode || 'N/A'}</p>
                        </div>
                      
                        <div className="text-sm text-gray-700 text-left sm:text-right mt-2 sm:mt-0 flex lg:flex-row flex-col">
                          <div className=" mr-10 bg-purple-500 px-4 rounded-xl items-center h-fit py-1 flex flex-row"  >
                            <User  className="text-white text-lg mx-2"></User>
                            <h2 className="text-lg text-white">

{session.studentsAttended.length}

                            </h2>

                          </div>
                          <div>
                          <p><span className="font-semibold">Date:</span> {new Date(session.date).toLocaleDateString()}</p>
                          <p><span className="font-semibold">Time:</span> {session.startTime}:00 - {session.endTime}:00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">No class sessions found matching the selected filters.</p>
              )}
            </div>

            {selectedClass && (
              <div className="fixed inset-0  z-40 flex items-center justify-center p-4 bg-opacity-60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Attendance Report</h3>
                      <p className="text-sm text-gray-600">{selectedClass.subjectID.name} - {new Date(selectedClass.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => setSelectedClass(null)} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                  </div>
                  <div className="p-6 flex-grow overflow-y-auto">
                    {attendeesLoading ? (
                      <div className="flex justify-center items-center h-full"><Loader2Icon size={32} className="animate-spin text-purple-600" /></div>
                    ) : attendees.length > 0 ? (
                      <ul className="space-y-2">
                        {attendees.map(regNo => (
                          <li key={regNo} className="bg-gray-100 px-4 py-2 rounded-md font-mono text-gray-800">{regNo}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 h-full flex items-center justify-center">No attendees recorded for this session.</p>
                    )}
                  </div>
                  <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end">
                    <button onClick={handleDownloadReport} disabled={attendees.length === 0} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                      <Download size={18} /> Download CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "profile":
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden font-sans border border-gray-200/80">
            <div className="relative"><div className="h-32 bg-[#9810FA]"></div><div className="absolute left-1/2 -translate-x-1/2 -bottom-16 transform"><img className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md" src={profileData.img || "https://res.cloudinary.com/dnfbik3if/image/upload/v1757522500/Gemini_Generated_Image_35u0bk35u0bk35u0_mbqnnr_og0ikh.png"} alt="Admin" /></div></div><div className="text-center px-6 pt-20 pb-8"><h2 className="text-2xl font-bold text-gray-800">{"Admin"}</h2><p className="text-gray-500 mt-1 text-sm">System Administrator</p><div className="mt-8 text-left space-y-5 max-w-sm mx-auto"><div className="flex items-center"><MailIcon /><div className="ml-4"><p className="text-xs text-gray-500">Email</p><a href={`mailto:${profileData.email}`} className="text-sm font-medium text-gray-700 hover:text-purple-600 break-all">{profileData.email}</a></div></div><div className="flex items-center"><PhoneIcon /><div className="ml-4"><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-700">{profileData.contact_no || "Not Available"}</p></div></div><div className="flex items-center"><ShieldIcon /><div className="ml-4"><p className="text-xs text-gray-500">Access Level</p><p className="text-sm font-medium text-gray-700">Full System Access</p></div></div></div></div>
          </div>
        );
      case "pending":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xl font-semibold text-gray-900 ">Pending Requests</div>
              <div className="relative w-full sm:w-auto">
                <button onClick={() => setOpenApprovefilter(!openApproveFilter)} className="text-lg inline-flex items-center justify-between w-full sm:w-auto px-4 py-1 border-2 border-purple-600 rounded-lg">
                  Filter{" "}<svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" /></svg>
                </button>
                <div className={`${openApproveFilter ? "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 absolute right-0 mt-2" : "hidden"}`}>
                  <ul className="py-2 text-sm text-black">
                    {activeroles.map((role) => {
                      const RoleIcon = role.icon;
                      return (<li key={role.id}><div onClick={() => { setActiveApprove(role.id); setOpenApprovefilter(false); }} className={`${activeApprove === role.id ? "bg-purple-700 text-white" : ""} px-4 py-2 flex gap-4 items-center hover:bg-purple-400 hover:text-white cursor-pointer`}><RoleIcon size={20} /><span className="font-bold text-md capitalize">{role.id}</span></div></li>);
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {filteredApprovels.length === 0 && (<p className="text-center text-gray-500">No pending Requests to approve.</p>)}
              {filteredApprovels.map((request) => (<div key={request.reg_no} className="flex flex-col md:flex-row justify-between gap-4 p-4 shadow-md rounded-lg bg-white hover:bg-gray-50"><div className="flex-grow space-y-2"><div className="text-sm text-gray-500">Reg No: <span className="font-medium text-gray-800">{request.reg_no}</span></div><div className="text-sm text-gray-500">Name: <span className="font-medium text-gray-800">{request.name}</span></div><div className="text-sm text-gray-500">Email: <span className="font-medium text-gray-800 break-all">{request.email}</span></div><div className="text-sm text-gray-500">Role: <span className="font-medium text-purple-700 capitalize bg-purple-100 px-2 py-1 rounded-full">{request.role}</span></div></div><div className="flex gap-3 self-end md:self-center flex-shrink-0"><button className="bg-green-100 border-2 border-green-500 rounded-xl px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-200" onClick={() => addApprove(request.reg_no)}>Approve</button><button className="bg-red-100 border-2 border-red-500 rounded-xl px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200" onClick={() => removeUser(request.reg_no)}>Remove</button></div></div>))}
            </div>
          </div>
        );
      case "studentList":
        return (
          <div className="max-w-6xl mx-auto ">
            {subject ? (<> <div className="rounded-lg p-4 mb-4"><h2 className="text-xl font-semibold mb-1">{subject.name} ({subject.subjectCode})</h2><p className="text-gray-600 text-lg">Lecturer: {subject.lecturerId} | Year: {subject.year} | Semester: {subject.semester} | Batch: {subject.batchYear}</p></div><div className="text-xl font-semibold mb-1 px-4 pb-2 underline-offset-2 underline">Enrolled Student List</div>{studentList.length > 0 ? (<div className="space-y-2 ">{studentList.map((studentId) => (<div key={studentId} className="flex justify-between items-center bg-purple-50 shadow p-3 py-4 rounded hover:bg-purple-200 transition max-w-2xl border-2 border-purple-50"><span className="px-3 font-semibold font-sans text-lg">{studentId}</span><Trash2Icon className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 mr-3" onClick={() => handleDelete(studentId)} /></div>))}</div>) : (<p className="text-gray-500">No students enrolled.</p>)}</>) : (<p className="text-gray-500">Loading subject info...</p>)}
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
    { id: "pending", label: "Pending Approval", icon: Hourglass },
  ];

  return (
    <div className="min-h-screen bg-purple-50">
      <Header requests={requestsSize} />
      <div className="bg-purple-600 fixed bottom-8 right-8 lg:bottom-6 lg:right-24 z-50 px-4 py-3 rounded-full shadow-lg hover:bg-purple-800" onClick={() => setisChatOpen(!isChatopen)}>
        <MessageCircle size={25} className="text-white w-8 h-8 lg:w-10 lg:h-10" />
      </div>
      <div>
        <ChatBox isOpen={isChatopen} isClose={setisChatOpen}></ChatBox>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-white shadow-sm text-purple-800">
            <Menu size={20} className="mr-3" />
            {tabs.find((tab) => tab.id === activeTab)?.label || "Menu"}
          </button>
        </div>
        <div className="relative flex flex-col lg:flex-row lg:space-x-8 ">
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`fixed inset-y-0 left-0 w-64 h-screen shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:h-auto z-30 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col space-y-2 p-4 lg:p-0 bg-white lg:bg-transparent rounded-lg h-full">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`w-full flex items-center py-4 px-5 text-left rounded-lg transition-colors ${activeTab === tab.id ? "bg-purple-700 text-white font-semibold shadow" : "text-purple-800 hover:bg-purple-400 hover:text-white"}`}>
                  <tab.icon size={20} className="mr-3" />{tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 mt-4 lg:mt-0">{renderContent()}</div>
        </div>
      </div>
      {toast.message && (<div className={`fixed top-24 right-4 z-50 px-4 py-2 rounded shadow-lg max-w-xs text-white ${toast.type ? "bg-green-500" : "bg-red-500"} transition-all duration-300`}>{toast.message}</div>)}
    </div>
  );
};

export default AdminDashboard;