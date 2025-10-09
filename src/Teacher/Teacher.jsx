import { BookOpen, Eye, Menu, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Header from '../Layout/Header';

// --- PLACEHOLDER HEADER COMPONENT ---
// This component replaces the external import to make the file self-contained.



// --- CHART HELPER COMPONENTS ---
// These are lightweight SVG components to build the chart without external libraries.

const ResponsiveContainer = ({ children }) => (
  <div className="w-full h-full">{children}</div>
);

const LineChart = ({ width, height, data, margin, children }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="font-sans">
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { data, width: width - margin.left - margin.right, height: height - margin.top - margin.bottom })
      )}
    </g>
  </svg>
);

const CartesianGrid = ({ width, height }) => {
  const lines = [];
  for (let i = 1; i <= 4; i++) {
    const y = height - (height / 5) * i;
    lines.push(<line key={`h-${i}`} x1="0" x2={width} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="3 3" />);
  }
  return <g>{lines}</g>;
};

const XAxis = ({ data, dataKey, width, height }) => {
  const itemWidth = width / data.length;
  return (
    <g transform={`translate(0, ${height})`}>
      {data.map((entry, index) => (
        <text
          key={`x-label-${index}`}
          x={index * itemWidth + itemWidth / 2}
          y="20"
          textAnchor="middle"
          className="text-xs fill-current text-gray-600"
        >
          {entry[dataKey]}
        </text>
      ))}
    </g>
  );
};

const YAxis = ({ height }) => {
  const ticks = [0, 25, 50, 75, 100];
  return (
    <g>
      {ticks.map(tick => (
        <text
          key={`y-label-${tick}`}
          x="-10"
          y={height - (height * tick) / 100}
          textAnchor="end"
          dy="0.355em"
          className="text-xs fill-current text-gray-600"
        >
          {tick}%
        </text>
      ))}
    </g>
  );
};

const Tooltip = () => null; // Tooltip logic is handled inside the Line component

const Line = ({ data, dataKey, stroke, width, height }) => {
  if (!data || data.length === 0) return null;

  const itemWidth = width / data.length;

  const linePath = data
    .map((entry, index) => {
      const x = index * itemWidth + itemWidth / 2;
      const y = height - (entry[dataKey] / 100) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <g>
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" />
      {data.map((entry, index) => {
        const x = index * itemWidth + itemWidth / 2;
        const y = height - (entry[dataKey] / 100) * height;
        return (
          <g key={`point-${index}`} className="group cursor-pointer">
            <circle cx={x} cy={y} r="10" fill="transparent" />
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke={stroke}
              strokeWidth="2"
              className="transition-transform duration-200 group-hover:scale-125"
            />
            <g className="tooltip opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect x={x - 60} y={y - 55} width="120" height="40" rx="4" fill="black" fillOpacity="0.7"/>
                <text x={x} y={y - 38} textAnchor="middle" fill="white" className="text-xs font-semibold">{entry.subjectCode}</text>
                <text x={x} y={y - 24} textAnchor="middle" fill="white" className="text-xs">{`Avg. Attend: ${entry[dataKey].toFixed(1)}%`}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

// --- ATTENDANCE GRAPH COMPONENT ---
// This component fetches subject data and renders the line chart.

const AttendanceGraph = ({ lecturerId }) => {
  const [subjectsData, setSubjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lecturerId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`https://attendance-uni-backend.vercel.app/lecturer/getsubjects/${lecturerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const processedData = data.map(subject => ({
            ...subject,
            attendancePercentage: subject.studentCount > 0 ? (subject.avgAttendance / subject.studentCount) * 100 : 0,
          }));
          setSubjectsData(processedData);
        } else {
            console.error("API response is not an array:", data);
            setSubjectsData([]);
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lecturerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-red-50 text-red-700 rounded-lg p-4">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold">Failed to load attendance data.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (subjectsData.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-80 bg-gray-50 text-gray-500 rounded-lg p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 014 4v2" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7a4 4 0 00-4 4" />
             </svg>
             <p className="font-semibold">No Subject Data Found</p>
             <p className="text-sm">There are no subjects with attendance records to display.</p>
         </div>
      )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Subject Attendance Overview</h2>
      <p className="text-sm text-gray-500">Average student attendance percentage for each subject.</p>
      <div className="h-80 w-full">
        <ResponsiveContainer>
           <LineChart width={500} height={320} data={subjectsData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid />
              <XAxis dataKey="subjectCode" />
              <YAxis />
              <Tooltip />
              <Line dataKey="attendancePercentage" stroke="#8b5cf6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---

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
    // This fetch is still needed for the "My Courses" tab
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
        // The AttendanceGraph component is now rendered here
        return user?.reg_no ? (
          <AttendanceGraph lecturerId={user.reg_no} />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        );

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
      <Header/>
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

