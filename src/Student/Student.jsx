import { BookOpen, Calendar, CheckCircle, Clock, QrCode, XCircle } from 'lucide-react';
import { useState } from 'react';
import Header from "../Layout/Header";
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('subjects');

  // Mock data
  const subjects = [
    { 
      id: '1', 
      name: 'Computer Science 101', 
      code: 'CS101', 
      teacher: 'Dr. Smith',
      attendance: 85,
      totalClasses: 20,
      presentClasses: 17
    },
    { 
      id: '2', 
      name: 'Mathematics', 
      code: 'MATH201', 
      teacher: 'Prof. Johnson',
      attendance: 92,
      totalClasses: 18,
      presentClasses: 16
    },
    { 
      id: '3', 
      name: 'Database Systems', 
      code: 'CS301', 
      teacher: 'Dr. Brown',
      attendance: 78,
      totalClasses: 22,
      presentClasses: 17
    },
  ];

  const schedule = [
    { day: 'Monday', time: '9:00 AM', subject: 'Computer Science 101', room: 'A-101' },
    { day: 'Tuesday', time: '11:00 AM', subject: 'Mathematics', room: 'B-205' },
    { day: 'Wednesday', time: '2:00 PM', subject: 'Database Systems', room: 'C-301' },
    { day: 'Thursday', time: '10:00 AM', subject: 'Computer Science 101', room: 'A-101' },
    { day: 'Friday', time: '1:00 PM', subject: 'Mathematics', room: 'B-205' },
  ];

  const StudentProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="flex items-start space-x-6">
          <img
            src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">John Doe</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <p className="text-gray-900">STU001</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">john.doe@university.edu</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="text-gray-900">Computer Science</p>
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
            <QrCode size={120} className="text-red-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Use this QR code for attendance marking
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'subjects':
        return (
          <div className="grid gap-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                    <p className="text-gray-600">{subject.code} • {subject.teacher}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{subject.attendance}%</div>
                    <div className="text-sm text-gray-500">Attendance</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="text-green-600 mx-auto mb-1" size={20} />
                    <div className="font-semibold text-green-600">{subject.presentClasses}</div>
                    <div className="text-xs text-gray-600">Present</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <XCircle className="text-red-600 mx-auto mb-1" size={20} />
                    <div className="font-semibold text-red-600">{subject.totalClasses - subject.presentClasses}</div>
                    <div className="text-xs text-gray-600">Absent</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="text-blue-600 mx-auto mb-1" size={20} />
                    <div className="font-semibold text-blue-600">{subject.totalClasses}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-gray-600">Overall Attendance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">60</div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-600">Classes Missed</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{subject.name}</h4>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        subject.attendance >= 85 ? 'bg-green-100 text-green-800' : 
                        subject.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {subject.attendance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.attendance >= 85 ? 'bg-green-500' : 
                          subject.attendance >= 75 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${subject.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="mr-2" size={20} />
                Class Schedule
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="w-20 text-sm font-medium text-gray-600">{item.day}</div>
                    <div className="w-24 text-sm text-gray-900">{item.time}</div>
                    <div className="flex-1 text-sm font-medium text-gray-900">{item.subject}</div>
                    <div className="text-sm text-gray-600">{item.room}</div>
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
      <Header></Header>
     
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
                      ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
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

export default StudentDashboard;