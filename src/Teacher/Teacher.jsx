import { BookOpen, Edit, Eye, Menu, Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../Layout/Header';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEnrollStudent, setShowEnrollStudent] = useState(false);
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
                      <div className="text-gray-400 text-xs">(not available yet)</div>
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
                      <div className="font-semibold text-green-600">—</div>
                      <div className="text-xs text-gray-800">Classes</div>
                    </div>
                    <div className="text-center p-3 bg-orange-100 rounded-lg">
                      <Eye className="text-orange-600 mx-auto mb-1" size={30} />
                      <div className="font-semibold text-orange-600">Active</div>
                      <div className="text-xs text-gray-800">Status</div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Eye size={16} className="mr-1" />
                      View Students
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm text-blue-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Edit size={16} className="mr-1" />
                      Edit
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

            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-sm mt-6">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black">
                      <option>All Courses</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                          Student Reg No
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white  divide-gray-200">
                      {courses.flatMap((course) =>
                        course.studentsEnrolled.map((studentReg) => (
                          <tr key={studentReg} className="hover:bg-purple-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {studentReg}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'attendance':
        return <div className="space-y-6">This feature is not implemented yet</div>;

      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-6">Teacher Profile</h3>
            <div className="flex items-start space-x-6">
              <img
                src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-35 h-35 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                    <p className="text-gray-700">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Teacher Code</label>
                    <p className="text-gray-700">{user.reg_no}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
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
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Eye },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
  <div className="min-h-screen bg-gray-50">
    <Header />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex space-x-8">
      <div className="hidden lg:block w-64 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
      </div>

      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-800"
        >
          <Menu size={20} className="mr-2" />
          Menu
        </button>
      </div>

    
     <div
  className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none ${
    mobileMenuOpen ? "translate-x-0 z-50" : "-translate-x-full"
  }`}
>

      
        <div
          className="absolute inset-0 bg-black bg-opacity-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

 
        <div className="relative bg-white w-64 h-full shadow-lg flex flex-col">
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-600 font-semibold border-l-4 border-pink-600'
                    : 'text-purple-800 hover:bg-pink-100 hover:text-pink-600'
                }`}
              >
                <tab.icon size={20} className="mr-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

  
      <div className="flex-1">{renderContent()}</div>
    </div>
  </div>
);

};

export default TeacherDashboard;
