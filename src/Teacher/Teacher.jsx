import { BookOpen, Edit, Eye, Plus, Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

import Header from '../Layout/Header';

const TeacherDashboard= () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEnrollStudent, setShowEnrollStudent] = useState(false);

  // Mock data
  const courses = [
    {
      id: '1',
      name: 'Computer Science 101',
      code: 'CS101',
      enrolledStudents: 35,
      averageAttendance: 87,
      schedule: 'Mon, Wed, Fri 9:00-10:30 AM'
    },
    {
      id: '2',
      name: 'Data Structures',
      code: 'CS201',
      enrolledStudents: 28,
      averageAttendance: 82,
      schedule: 'Tue, Thu 2:00-3:30 PM'
    },
  ];

  const enrolledStudents = [
    { id: '1', name: 'John Doe', studentId: 'STU001', attendance: 85, email: 'john@edu.com' },
    { id: '2', name: 'Jane Smith', studentId: 'STU002', attendance: 92, email: 'jane@edu.com' },
    { id: '3', name: 'Mike Johnson', studentId: 'STU003', attendance: 78, email: 'mike@edu.com' },
    { id: '4', name: 'Sarah Wilson', studentId: 'STU004', attendance: 90, email: 'sarah@edu.com' },
  ];
//ADDCOURSE
  const AddCourseForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
        <button
          onClick={() => setShowAddCourse(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
              placeholder="Enter course name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
              placeholder="Enter course code"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
            rows={3}
            placeholder="Enter course description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
              placeholder="e.g., Mon, Wed, Fri 9:00 AM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
              placeholder="Enter room number"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddCourse(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );





  const EnrollStudentForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Enroll Student</h3>
        <button
          onClick={() => setShowEnrollStudent(false)}
          className="text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Course</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black">
            <option>Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Student ID or Email</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
            placeholder="Enter student ID or email"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowEnrollStudent(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-purple-800"
          >
            Enroll Student
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-900">My Courses</h2>
              <button
                onClick={() => setShowAddCourse(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
              >
                <Plus size={20} className="mr-2" />
                Add Course
              </button>
            </div>

            {showAddCourse && <AddCourseForm />}

            <div className="grid gap-6 mt-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-600">{course.code}</p>
                      <p className="text-sm text-gray-500">{course.schedule}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold text-pink-800">{course.averageAttendance}%</div>
                      <div className="text-sm text-gray-800">Avg Attendance</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <Users className="text-blue-600 mx-auto mb-1" size={30} />
                      <div className="font-semibold text-blue-600">{course.enrolledStudents}</div>
                      <div className="text-xs text-gray-800">Students</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <BookOpen className="text-green-600 mx-auto mb-1" size={30} />
                      <div className="font-semibold text-green-600">24</div>
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
                      View Details
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
              <button
                onClick={() => setShowEnrollStudent(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
              >
                <UserPlus size={18} className="mr-2" />
                Enroll Student
              </button>
            </div>

            {showEnrollStudent && <EnrollStudentForm />}

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
                      <option key={course.id} value={course.id}>
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
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrolledStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-purple-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                              alt=""
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div className="text-sm font-medium text-gray-600">
                              {student.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            student.attendance >= 85 ? 'bg-green-100 text-green-800' :
                            student.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button className="text-blue-600 hover:text-blue-950">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-900">Attendance Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-gray-800">Overall Attendance</div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">63</div>
                  <div className="text-sm text-gray-800">Total Students</div>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">48</div>
                  <div className="text-sm text-gray-800">Classes Held</div>
                </div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-800">Low Attendance</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Course-wise Attendance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{course.enrolledStudents} students</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            course.averageAttendance >= 85 ? 'bg-green-100 text-green-800' : 
                            course.averageAttendance >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {course.averageAttendance}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            course.averageAttendance >= 85 ? 'bg-green-600' : 
                            course.averageAttendance >= 75 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${course.averageAttendance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

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
                    <p className="text-gray-700">Dr. Sarah Johnson</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Teacher Code</label>
                    <p className="text-gray-700">TCH001</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                    <p className="text-gray-700">sarah.johnson@university.edu</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Department</label>
                    <p className="text-gray-700">Computer Science</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Specialization</label>
                    <p className="text-gray-700">Database Systems, AI</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Experience</label>
                    <p className="text-gray-700">8 years</p>
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
  //DEFAULT LOADING 
  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-600">Teacher Dashboard</h1>
          </div> */}
        </div>
      </div>

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

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>


  );
};

export default TeacherDashboard;
