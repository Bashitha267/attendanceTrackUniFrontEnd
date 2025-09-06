import { BarChart3, BookOpen, Edit, Eye, MailIcon, PhoneIcon, Plus, Search, ShieldIcon, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../Layout/Header';

const AdminDashboard= () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const[profileData,setProfileData]=useState([]);
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    }
  }, []);

  if (!profileData) {
    return <p>No user data found</p>;
  }
  // Mock data
  const stats = {
    totalStudents: 1250,
    totalTeachers: 45,
    totalCourses: 78,
    averageAttendance: 84,
  };

  const teachers = [
    { 
      id: '1', 
      name: 'Dr. Sarah Johnson', 
      email: 'sarah@edu.com', 
      department: 'Computer Science',
      courses: 3,
      experience: '8 years'
    },
    { 
      id: '2', 
      name: 'Prof. Michael Brown', 
      email: 'michael@edu.com', 
      department: 'Mathematics',
      courses: 2,
      experience: '12 years'
    },
    { 
      id: '3', 
      name: 'Dr. Emily Davis', 
      email: 'emily@edu.com', 
      department: 'Physics',
      courses: 4,
      experience: '6 years'
    },
  ];

  const courses = [
    { 
      id: '1', 
      name: 'Computer Science 101', 
      code: 'CS101', 
      teacher: 'Dr. Sarah Johnson',
      students: 35,
      department: 'Computer Science'
    },
    { 
      id: '2', 
      name: 'Advanced Mathematics', 
      code: 'MATH301', 
      teacher: 'Prof. Michael Brown',
      students: 28,
      department: 'Mathematics'
    },
    { 
      id: '3', 
      name: 'Physics Fundamentals', 
      code: 'PHY101', 
      teacher: 'Dr. Emily Davis',
      students: 42,
      department: 'Physics'
    },
  ];

  const AddTeacherForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Add New Teacher</h3>
        <button
          onClick={() => setShowAddTeacher(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter email address"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter teacher code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
              <option>Select department</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Years of experience"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="Enter areas of specialization"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddTeacher(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Add Teacher
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</div>
                    <div className="text-sm text-gray-600">Total Teachers</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <BarChart3 className="text-red-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.averageAttendance}%</div>
                    <div className="text-sm text-gray-600">Avg Attendance</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">New student enrolled in CS101</span>
                    <span className="ml-auto text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Teacher added new course</span>
                    <span className="ml-auto text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Attendance marked for MATH301</span>
                    <span className="ml-auto text-gray-400">6 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Computer Science</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">18</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mathematics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">12</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Physics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'teachers':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Teacher Management</h2>
              <button
                onClick={() => setShowAddTeacher(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus size={18} className="mr-2" />
                Add Teacher
              </button>
            </div>

            {showAddTeacher && <AddTeacherForm />}

            <div className="bg-white rounded-lg shadow-sm mt-6">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                              alt=""
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-sm text-gray-500">{teacher.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.courses} courses
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={16} />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                  <option>All Departments</option>
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-600">{course.code} • {course.teacher}</p>
                      <p className="text-sm text-gray-500">{course.department} Department</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{course.students}</div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
         <div className=" max-w-7xl  bg-white rounded-xl shadow-lg overflow-hidden font-sans border border-gray-200/80">
      <div className="relative">
        {/* Header Gradient */}
        <div className="h-32 bg-[#9810FA]"></div>
        
        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 transform">
          <img
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            src={profileData.img}
            alt="Admin Profile Avatar"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="text-center px-6 pt-16 pb-8">
        <h2 className="text-2xl font-bold text-gray-800">Admin</h2>
        <p className="text-gray-500 mt-1 text-sm">System Administrator</p>
        
        {/* Profile Details */}
        <div className="mt-8 text-left space-y-5">
            <div className="flex items-center">
                <MailIcon />
                <div className="ml-4">
                    <p className="text-xs text-gray-500">Email</p>
                    <a href="mailto:nimeshspc2k17@gmail.com" className="text-sm font-medium text-gray-700 hover:text-purple-600">
                        {profileData.email}
                    </a>
                </div>
            </div>
             <div className="flex items-center">
                <PhoneIcon />
                <div className="ml-4">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-400 italic">{profileData.contact_no}</p>
                </div>
            </div>
            <div className="flex items-center">
                <ShieldIcon />
                <div className="ml-4">
                    <p className="text-xs text-gray-500">Access Level</p>
                    <p className="text-sm font-medium text-gray-700">Full System Access</p>
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
          </div>
        </div>
      </div> */}
    <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-8">
          <div className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#be64ff] text-white '
                      : 'hover:text-[#9810FA] hover:border-l-4 hover:border-[#9810FA] '
                  }`}
                >  
                  <Icon size={20} className="mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;