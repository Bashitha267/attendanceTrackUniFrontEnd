import { BookOpen, Eye, Menu, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../Layout/Header';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.reg_no) {
      fetch(`https://attendance-uni-backend.vercel.app/lecturer/getsubjects/${user.reg_no}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            setCourses([]);
          }
        })
        .catch((err) => console.error('Error fetching courses:', err));
    }
  }, [user]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); // Close mobile menu on tab selection
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-900">My Courses</h2>
            </div>
            <div className="grid gap-6 mt-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-600">{course.subjectCode}</p>
                      <p className="text-sm text-gray-500">
                        Year {course.year} • Semester {course.semester} • Batch {course.batchYear}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-800">Avg Attendance</div>
                      <div className="text-pink-600 text-3xl font-semibold">{course.avgAttendance}%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <Users className="text-blue-600 mx-auto mb-1" size={30} />
                      <div className="font-semibold text-blue-600">{course.studentCount}</div>
                      <div className="text-xs text-gray-800">Students</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <BookOpen className="text-green-600 mx-auto mb-1" size={30} />
                      <div className="font-semibold text-green-600">{course.numberOfClasses}</div>
                      <div className="text-xs text-gray-800">Classes</div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      onClick={() => {
                        setActiveTab("students");
                        setStudents(course.studentsEnrolled);
                      }}
                    >
                      <Eye size={16} className="mr-1" />
                      View Students
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'students':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-900">Enrolled Students</h2>
            </div>
            {students.length === 0 ? (
              <p>No Students Enrolled Yet.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-sm mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="pl-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={student} className="hover:bg-purple-50">
                          <td className="pl-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className=" whitespace-nowrap text-sm text-gray-900 uppercase">{student}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'attendance':
        return <div className="space-y-6">This feature is not implemented yet.</div>;

      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-6">Teacher Profile</h3>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
              src={ user?.avatar||"https://res.cloudinary.com/dnfbik3if/image/upload/v1759460597/school_fjjtaf.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-400"
              />
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Name:</label>
                    <p className="text-gray-700">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Reg_No:</label>
                    <p className="text-gray-700">{user.reg_no}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email:</label>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Eye },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  const SidebarContent = () => (
    <>
        {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
            <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                    ? 'bg-pink-100 text-pink-600 font-semibold border-l-4 border-pink-600'
                    : 'text-purple-800 hover:bg-pink-100 hover:text-pink-600'
                }`}
            >
                <Icon size={20} className="mr-3" />
                {tab.label}
            </button>
            );
        })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-white shadow-sm text-purple-800"
          >
            <Menu size={20} className="mr-3" />
            {tabs.find(tab => tab.id === activeTab)?.label || 'Menu'}
          </button>
        </div>

        <div className="relative flex flex-col lg:flex-row lg:space-x-8">
          
          <div className="hidden lg:block w-64 space-y-2">
            <SidebarContent />
          </div>

          {mobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}
          <div
            className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-pink-600">Dashboard</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>
            <div className="flex flex-col space-y-2 p-4">
                <SidebarContent />
            </div>
          </div>
          
          <div className="flex-1 mt-4 lg:mt-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;