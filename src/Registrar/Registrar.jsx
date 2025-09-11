import { Calendar, CheckCircle, ClipboardList, QrCode, Search, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const RegistrarDashboard = () => {
  const [activeTab, setActiveTab] = useState('mark-register');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState("Not Found");

  // Mock data
  const courses = [
    { id: '1', name: 'Computer Science 101', code: 'CS101', teacher: 'Dr. Smith' },
    { id: '2', name: 'Mathematics', code: 'MATH201', teacher: 'Prof. Johnson' },
    { id: '3', name: 'Database Systems', code: 'CS301', teacher: 'Dr. Brown' },
  ];

  const students = [
    { 
      id: '1', 
      name: 'John Doe', 
      studentId: 'STU001',
      status: '',
      qrScanned: false 
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      studentId: 'STU002',
      status: '',
      qrScanned: false 
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      studentId: 'STU003',
      status: '',
      qrScanned: false 
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      studentId: 'STU004',
      status: '',
      qrScanned: false 
    },
  ];

  const attendanceRecords = [
    {
      id: '1',
      course: 'Computer Science 101',
      date: '2025-01-20',
      present: 32,
      absent: 3,
      total: 35,
      percentage: 91
    },
    {
      id: '2',
      course: 'Mathematics',
      date: '2025-01-20',
      present: 26,
      absent: 2,
      total: 28,
      percentage: 93
    },
    {
      id: '3',
      course: 'Database Systems',
      date: '2025-01-19',
      present: 38,
      absent: 4,
      total: 42,
      percentage: 90
    },
  ];

  const handleAttendanceChange = (studentId, status) => {
    // Handle attendance marking logic here
    console.log(`Student ${studentId} marked as ${status}`);
  };

  const MarkRegister = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Mark Attendance</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Select Course</label>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
            >
              <option value="">Choose course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {selectedCourse && selectedDate && (
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Student List</h4>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                  Mark All Present
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">
                  Mark All Absent
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      QR Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face"
                            alt=""
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.qrScanned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.qrScanned ? 'Scanned' : 'Not Scanned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAttendanceChange(student.id, 'present')}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              student.status === 'present'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student.id, 'absent')}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              student.status === 'absent'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const QRScanner = () => (
    <div className="space-y-6">
    



    <div>
      <BarcodeScannerComponent
        width={600}
        height={600}
        onUpdate={(err, result) => {
          if (result){
            console.log("correct")
          };
        }}
      />
      <p>{data}</p>
    </div>


      
    </div>
  );

  const AttendanceRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-900">Attendance Records</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search records..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {attendanceRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-black">{record.course}</h3>
                <p className="text-gray-600  flex items-center">
                  <Calendar className="mr-1" size={16} />
                  {record.date}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-800">{record.percentage}%</div>
                <div className="text-sm text-gray-550">Attendance</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600 mx-auto mb-1" size={30} />
                <div className="font-semibold text-green-600">{record.present}</div>
                <div className="text-xs text-gray-800">Present</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <XCircle className="text-red-600 mx-auto mb-1" size={30} />
                <div className="font-semibold text-red-600">{record.absent}</div>
                <div className="text-xs text-gray-800">Absent</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="text-blue-600 mx-auto mb-1" size={30} />
                <div className="font-semibold text-blue-600">{record.total}</div>
                <div className="text-xs text-gray-800">Total</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Reports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-green-900">Attendance Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-800">Overall Attendance</div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-800">Classes Held</div>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">23</div>
            <div className="text-sm text-gray-800">Low Attendance Cases</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course-wise Attendance Summary</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{course.name}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                  {Math.floor(Math.random() * 20 + 80)}%
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Teacher: {course.teacher} • Code: {course.code}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.floor(Math.random() * 20 + 80)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'mark-register':
        return <MarkRegister />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'attendance':
        return <AttendanceRecords />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-6">Registrar Profile</h3>
            <div className="flex items-start space-x-8">
              <img
                src="https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-35 h-35 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                    <p className="text-gray-700">Jane Wilson</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Employee ID</label>
                    <p className="text-gray-700">REG001</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                    <p className="text-gray-700">jane.wilson@university.edu</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Department</label>
                    <p className="text-gray-700">Registry Office</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Access Level</label>
                    <p className="text-gray-700">Attendance Management</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Joining Date</label>
                    <p className="text-gray-700">March 15, 2020</p>
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
    { id: 'mark-register', label: 'Mark Register', icon: ClipboardList },
    { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'attendance', label: 'Records', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: Users },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-red-600">Registrar Dashboard</h1>
          </div>
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
                      ? 'bg-purple-50 text-purple-600 border-l-5 border-purple-600'
                      : 'text-purple-800 hover:bg-pink-50 hover:text-pink-600'
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

export default RegistrarDashboard;