import axios from 'axios';
import { BookOpen, CheckCircle, Clock, Loader2, Menu, PlusCircle, QrCode, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from "../Layout/Header";
import student from "../assets/graduated.png";

// New Component for displaying styled success/error messages
const EnrollmentFeedback = ({ status, onClose }) => {
    if (!status || !status.message) return null;

    const isSuccess = status.type === 'success';
    const baseClasses = "p-4 rounded-lg flex items-center justify-between mb-4 text-sm";
    const successClasses = "bg-green-100 text-green-800";
    const errorClasses = "bg-red-100 text-red-800";

    return (
        <div className={`${baseClasses} ${isSuccess ? successClasses : errorClasses}`}>
            <div className="flex items-center">
                {isSuccess ? <CheckCircle className="mr-2" size={20} /> : <XCircle className="mr-2" size={20} />}
                <span>{status.message}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10">
                <X size={18} />
            </button>
        </div>
    );
};


const EnrollmentModal = ({ isOpen, onClose, onSubmit, subject, enrollmentStatus, setEnrollmentStatus }) => {
    const [inputCode, setInputCode] = useState('');

    useEffect(() => {
        // Clear input when the modal opens for a new subject
        if (isOpen) {
            setInputCode('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!inputCode.trim()) {
            setEnrollmentStatus({ message: "Please enter the subject's PIN code.", type: 'error' });
            return;
        }
        onSubmit(inputCode);
        // Don't clear the input code here, so user can see it if there's an error
    };

    const handleClose = () => {
        setEnrollmentStatus({ message: null, type: null }); // Clear status on close
        setInputCode('');
        onClose();
    };

    return (
        <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                
                

                <h2 className="text-xl font-semibold mb-2 text-gray-800">Enroll in Course</h2>
                <p className="mb-4 text-gray-600">
                    Enter the PIN code for <strong className="text-purple-700">{subject?.name}</strong> to complete enrollment.
                </p>
                <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter PIN Code here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    autoFocus
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Confirm Enrollment
                    </button>
                </div>
                <EnrollmentFeedback status={enrollmentStatus} onClose={() => setEnrollmentStatus({ message: null, type: null })} />

            </div>
        </div>
    );
};


const StudentDashboard = () => {
    // ... (keep all your existing states)
    const [activeTab, setActiveTab] = useState('subjects');
    const [profileData, setProfileData] = useState(null);
    const [enrolledSubjects, setEnrolledSubjects] = useState([]);
    const [filteredEnrolledSubjects, setFilteredEnrolledSubjects] = useState([]);
    const [allAvailableSubjects, setAllAvailableSubjects] = useState([]);
    const [filteredAllAvailableSubjects, setFilteredAllAvailableSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterBatchYear, setFilterBatchYear] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectToEnroll, setSubjectToEnroll] = useState(null);

 
    const [enrollmentStatus, setEnrollmentStatus] = useState({ message: null, type: null });


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem("user");
                if (!storedUser) throw new Error("User not found in localStorage.");
                
                const userProfile = JSON.parse(storedUser);
                setProfileData(userProfile);

                if (userProfile?.email) {
                    const [enrolledRes, allSubjectsRes] = await Promise.all([
                        axios.get(`https://attendance-uni-backend.vercel.app/subjects/getensub/${userProfile.email}`),
                        axios.get(`https://attendance-uni-backend.vercel.app/subjects/getsubjects`)
                    ]);

                    setEnrolledSubjects(enrolledRes.data.success ? enrolledRes.data.subjects : []);
                    setAllAvailableSubjects(allSubjectsRes.data.success ? allSubjectsRes.data.subjects : []);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = enrolledSubjects.filter(subject => {
            const matchBatchYear = filterBatchYear ? subject.batchYear === Number(filterBatchYear) : true;
            const matchYear = filterYear ? subject.year === Number(filterYear) : true;
            const matchSemester = filterSemester ? subject.semester === Number(filterSemester) : true;
            return matchBatchYear && matchYear && matchSemester;
        });
        setFilteredEnrolledSubjects(filtered);
    }, [enrolledSubjects, filterBatchYear, filterYear, filterSemester]);

    useEffect(() => {
        const enrolledSubjectCodes = new Set(enrolledSubjects.map(sub => sub.subjectCode));
        const filtered = allAvailableSubjects.filter(subject => {
             if (enrolledSubjectCodes.has(subject.subjectCode)) {
                 return false; // Hide subjects the student is already in
             }
            const matchBatchYear = filterBatchYear ? subject.batchYear === Number(filterBatchYear) : true;
            const matchYear = filterYear ? subject.year === Number(filterYear) : true;
            const matchSemester = filterSemester ? subject.semester === Number(filterSemester) : true;
            return matchBatchYear && matchYear && matchSemester;
        });
        setFilteredAllAvailableSubjects(filtered);
    }, [allAvailableSubjects, enrolledSubjects, filterBatchYear, filterYear, filterSemester]);


    // --- CORE ENROLLMENT LOGIC (UPDATED) ---
    const handleOpenEnrollModal = (subject) => {
        setSubjectToEnroll(subject);
        setEnrollmentStatus({ message: null, type: null }); // Reset status when opening modal
        setIsModalOpen(true);
    };

    const handleEnroll = async (enteredPinCode) => {
        if (!subjectToEnroll || !profileData?.email) {
            setEnrollmentStatus({ message: "Error: Missing subject or profile information.", type: 'error' });
            return;
        }

        const payload = {
            email: profileData.email,
            subjectCode: subjectToEnroll.subjectCode,
            subpinCode: enteredPinCode,
        };

        try {
            const response = await axios.post('https://attendance-uni-backend.vercel.app/subjects/enrolsubjects', payload);

            
            setEnrollmentStatus({ message: response.data.message, type: 'success' });
            
           
            setEnrolledSubjects(prev => [...prev, subjectToEnroll]);

            
            setTimeout(() => {
                setIsModalOpen(false);
                setSubjectToEnroll(null);
            }, 2000);

        } catch (err) {
            
            const errorMessage = err.response?.data?.message || "An error occurred during enrollment.";
            setEnrollmentStatus({ message: errorMessage, type: 'error' });
            console.error("Enrollment failed:", err);
        }
        
    };


    
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setIsMenuOpen(false);
    };

    const StudentProfile = () => (
        profileData && (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-6">Student Information</h3>
                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
                        <img src={profileData.img || student} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                        <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-900">Name</label><p className="text-gray-700">{profileData.name}</p></div>
                                <div><label className="block text-sm font-medium text-gray-900">Student ID</label><p className="text-gray-700">{profileData.reg_no}</p></div>
                                <div><label className="block text-sm font-medium text-gray-900">Email</label><p className="text-gray-700">{profileData.email}</p></div>
                                <div><label className="block text-sm font-medium text-gray-900">Department</label><p className="text-gray-700">Computer Science</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><QrCode className="mr-2" size={20} /> Student QR Code</h3>
                    <div className="text-center">
                        <div className="bg-gray-100 p-8 rounded-lg inline-block"><QrCode size={130} className="text-purple-950" /></div>
                        <p className="text-sm text-gray-600 mt-2">Use this QR code for attendance marking</p>
                    </div>
                </div>
            </div>
        )
    );

    const SubjectList = ({ subjectsToRender, isEnrollMode = false, onEnrollClick }) => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{isEnrollMode ? 'Available Courses to Enroll' : 'My Enrolled Subjects'}</h2>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select value={filterBatchYear} onChange={e => setFilterBatchYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="">All Batches</option><option value="2021">2021</option><option value="2022">2022</option><option value="2023">2023</option><option value="2024">2024</option><option value="2025">2025</option>
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="">All Years</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                    </select>
                    <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="">All Semesters</option><option value="1">1st Semester</option><option value="2">2nd Semester</option>
                    </select>
                </div>
            </div>
            {subjectsToRender.length === 0 && !loading && (<div className="text-center text-gray-500 py-10">No subjects match the current filters.</div>)}
            <div className="grid gap-6">
                {subjectsToRender.map((subject) => (
                    <div key={subject._id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-black">{subject.name}</h3>
                                <p className="text-sm text-gray-600">{`Batch: ${subject.batchYear} | Year: ${subject.year} | Semester: ${subject.semester}`}</p>
                                <p className="text-gray-600 mt-1">Subject Code: {subject.subjectCode}</p>
                                <p className="text-gray-600">Lecturer ID: {subject.lecturerId}</p>
                            </div>
                            {isEnrollMode ? (
                                <button onClick={() => onEnrollClick(subject)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Enroll</button>
                            ) : (
                                <div className="text-right"><div className="text-sm text-gray-550">Attendance</div></div>
                            )}
                        </div>
                        {!isEnrollMode && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <div className="text-center p-3 bg-green-50 rounded-lg"><CheckCircle className="text-green-600 mx-auto mb-1" size={30} /><div className="text-xs text-gray-800">Present</div></div>
                                <div className="text-center p-3 bg-red-50 rounded-lg"><XCircle className="text-red-600 mx-auto mb-1" size={30} /><div className="text-xs text-gray-800">Absent</div></div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg"><Clock className="text-blue-600 mx-auto mb-1" size={30} /><div className="text-xs text-gray-800">Total</div></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return (<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-pink-600" /></div>);
        if (error) return <div className="text-red-500">Error: {error}</div>;

        switch (activeTab) {
            case 'subjects': return <SubjectList subjectsToRender={filteredEnrolledSubjects} />;
            case 'attendance': return (<div className="bg-white rounded-lg shadow-sm p-6"><h3 className="text-lg font-semibold text-green-900">Attendance Overview</h3><p className="mt-4 text-gray-600">This feature is not yet implemented.</p></div>);
            case 'enroll': return <SubjectList subjectsToRender={filteredAllAvailableSubjects.filter(sub => !enrolledSubjects.some(enSub => enSub.subjectCode === sub.subjectCode))} isEnrollMode={true} onEnrollClick={handleOpenEnrollModal} />;
            case 'profile': return <StudentProfile />;
            default: return null;
        }
    };

    const tabs = [
        { id: 'subjects', label: 'My Subjects', icon: BookOpen },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'enroll', label: 'Enroll Courses', icon: PlusCircle },
        { id: 'profile', label: 'Profile', icon: QrCode },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
  <Header />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Mobile Menu Button */}
    <div className="md:hidden mb-4">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-white shadow-sm text-purple-800"
      >
        <Menu size={20} className="mr-3" />
        {tabs.find(tab => tab.id === activeTab)?.label || 'Menu'}
      </button>
    </div>

    <div className="relative flex flex-col md:flex-row md:space-x-8">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none md:bg-transparent ${
          isMenuOpen ? "translate-x-0 z-20" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-2 p-4 md:p-0 md:bg-transparent rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-pink-100 text-pink-600 font-semibold border-l-4 border-pink-600"
                  : "text-purple-800 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              <tab.icon size={20} className="mr-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-4 md:mt-0">{renderContent()}</div>
    </div>
  </div>

  {/* Modal Responsiveness */}
  <EnrollmentModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleEnroll}
    subject={subjectToEnroll}
    enrollmentStatus={enrollmentStatus}
    setEnrollmentStatus={setEnrollmentStatus}
  />
</div>
    );
};

export default StudentDashboard;