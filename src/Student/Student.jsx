import axios from 'axios';
import { BookOpen, Calendar, CheckCircle, Clock, Loader2, QrCode, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from "../Layout/Header";
import student from "../assets/graduated.png";

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('subjects');
    const [profileData, setProfileData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: State variables for filters ---
    const [filterBatchYear, setFilterBatchYear] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filteredSubjects, setFilteredSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    throw new Error("User not found in localStorage.");
                }
                const userProfile = JSON.parse(storedUser);
                setProfileData(userProfile);

                if (userProfile && userProfile.email) {
                    const response = await axios.get(`https://attendance-uni-backend.vercel.app/subjects/getensub/${userProfile.email}`);
                    if (response.data.success) {
                        setSubjects(response.data.subjects);
                    } else {
                        throw new Error(response.data.message);
                    }
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
        const filtered = subjects.filter(subject => {
            const matchBatchYear = filterBatchYear ? subject.batchYear === Number(filterBatchYear) : true;
            const matchYear = filterYear ? subject.year === Number(filterYear) : true;
            const matchSemester = filterSemester ? subject.semester === Number(filterSemester) : true;
            return matchBatchYear && matchYear && matchSemester;
        });
        setFilteredSubjects(filtered);
    }, [subjects, filterBatchYear, filterYear, filterSemester]);

    const schedule = [
        { day: 'Monday', time: '9:00 AM', subject: 'Computer Science 101', room: 'A-101' },
        { day: 'Tuesday', time: '11:00 AM', subject: 'Mathematics', room: 'B-205' },
        { day: 'Wednesday', time: '2:00 PM', subject: 'Database Systems', room: 'C-301' },
    ];

    const StudentProfile = () => (
        profileData && (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-6">Student Information</h3>
                    <div className="flex items-start space-x-8">
                        <img
                            src={profileData.img || student}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                        />
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Name</label>
                                    <p className="text-gray-700">{profileData.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Student ID</label>
                                    <p className="text-gray-700">{profileData.reg_no}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Email</label>
                                    <p className="text-gray-700">{profileData.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Department</label>
                                    <p className="text-gray-700">Computer Science</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <QrCode className="mr-2" size={20} />
                        Student QR Code
                    </h3>
                    <div className="text-center">
                        <div className="bg-gray-100 p-8 rounded-lg inline-block">
                            <QrCode size={130} className="text-purple-950" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Use this QR code for attendance marking
                        </p>
                    </div>
                </div>
            </div>
        )
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'subjects':
               if (loading) return (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
  </div>
);
                if (error) return <div className="text-red-500">Error: {error}</div>;
                
                return (
                    <div className="space-y-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900">My Enrolled Subjects</h2>
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <select value={filterBatchYear} onChange={e => setFilterBatchYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                    <option value="">All Batches</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                </select>
                                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                    <option value="">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                                <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                    <option value="">All Semesters</option>
                                    <option value="1">1st Semester</option>
                                    <option value="2">2nd Semester</option>
                                </select>
                            </div>
                        </div>

                       
                        {filteredSubjects.length === 0 && !loading && (
                            <div className="text-center text-gray-500 py-10">No subjects match the current filters.</div>
                        )}
                        <div className="grid gap-6">
                            {filteredSubjects.map((subject) => (
                                <div key={subject._id} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-black">{subject.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {`Batch: ${subject.batchYear} | Year: ${subject.year} | Semester: ${subject.semester}`}
                                            </p>
                                            <p className="text-gray-600 mt-1">Subject Code: {subject.subjectCode}</p>
                                            <p className="text-gray-600">Lecturer ID: {subject.lecturerId}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-550">Attendance</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mt-4">
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="text-green-600 mx-auto mb-1" size={30} />
                                            <div className="text-xs text-gray-800">Present</div>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 rounded-lg">
                                            <XCircle className="text-red-600 mx-auto mb-1" size={30} />
                                            <div className="text-xs text-gray-800">Absent</div>
                                        </div>
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <Clock className="text-blue-600 mx-auto mb-1" size={30} />
                                            <div className="text-xs text-gray-800">Total</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'attendance':
                return (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-green-900">Attendance Overview</h3>
                        <p className="mt-4 text-gray-600">This feature is not yet implemented.</p>
                    </div>
                );

            case 'schedule':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-green-900 flex items-center">
                                <Calendar className="mr-2" size={20} /> Class Schedule
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {schedule.map((item, index) => (
                                    <div key={index} className="flex items-center p-4 border rounded-lg hover:bg-purple-100">
                                        <div className="w-20 text-sm font-medium text-gray-700">{item.day}</div>
                                        <div className="w-24 text-sm text-gray-900">{item.time}</div>
                                        <div className="flex-1 text-sm font-medium text-gray-900">{item.subject}</div>
                                        <div className="text-sm text-gray-900">{item.room}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return <StudentProfile />;

            default:
                return null;
        }
    };

    const tabs = [
        { id: 'subjects', label: 'My Subjects', icon: BookOpen },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: QrCode },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="w-full md:w-64 mb-6 md:mb-0">
                        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors flex-shrink-0 ${activeTab === tab.id
                                            ? 'bg-pink-100 text-pink-600 border-b-4 md:border-b-0 md:border-l-4 border-pink-600'
                                            : 'text-purple-800 hover:bg-pink-100 hover:text-pink-600'
                                            }`}
                                    >
                                        <Icon size={20} className="mr-3" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;