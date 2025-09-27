import axios from 'axios';
import { Calendar, ClipboardList, Loader2Icon, Menu, Plus, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../Layout/Header';

const RegistrarDashboard = () => {
  const [activeTab, setActiveTab] = useState('mark-register');
  const [addClass, setAddClass] = useState(false);
  const [data, setData] = useState("Not Found");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState({ message: "", success: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  // const[activeClasses,setActiveClasses]=useState([])
  const[ongoingClasses,setOngoingClasses]=useState([])
  const [classesLoading, setClassesLoading] = useState(false);

  // State for courses and filtering
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filterBatchYear, setFilterBatchYear] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState({
    subjectID: "",
    lecturer: "",
  });

  const [formDataClass, setFormDataClass] = useState({
    startTime: "",
    endTime: "",
    subjectID: "",
    lecturer: "",
    date: "",
    registor: "",
    pinCode: ""
  });

  // --- MOCK DATA ---
  const attendanceRecords = [
    { id: '1', course: 'Computer Science 101', date: '2025-01-20', present: 32, absent: 3, total: 35, percentage: 91 },
    { id: '2', course: 'Mathematics', date: '2025-01-20', present: 26, absent: 2, total: 28, percentage: 93 },
  ];
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await axios.get("https://attendance-uni-backend.vercel.app/subjects/getsubjects");
        if (response.data.success) {
          setCourses(response.data.subjects);
        }
      } catch (err) {
        console.log("Error fetching courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);
  
  useEffect(() => {
  const fetchClasses = async () => {
    try {
      setClassesLoading(true);
      const response = await axios.get("https://attendance-uni-backend.vercel.app/class/getActive");
      if (response.data.success) {
        // correctly update state
        setOngoingClasses(response.data.classes);
        if(ongoingClasses.length>0){
        console.log("Fetched classes:", ongoingClasses);
          
        }
        console.log(response.data.classes._id)
        // If you want to log the response immediately:
      }
    } catch (err) {
      console.log("Error fetching classes:", err);
    } finally {
      setClassesLoading(false);
    }
  };

  fetchClasses();
}, []);

  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchBatchYear = filterBatchYear ? course.batchYear === Number(filterBatchYear) : true;
      const matchYear = filterYear ? course.year === Number(filterYear) : true;
      const matchSemester = filterSemester ? course.semester === Number(filterSemester) : true;
      return matchBatchYear && matchYear && matchSemester;
    });
    setFilteredCourses(filtered);
  }, [courses, filterBatchYear, filterYear, filterSemester]);

  const handleInputChangeCourse = (e) => {
    setFormDataClass({ ...formDataClass, [e.target.name]: e.target.value });
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    try {
      setIsSubmiting(true);
      const payload = {
        startTime: formDataClass.startTime,
        endTime: formDataClass.endTime,
        subjectID: selectedCourse.subjectID,
        lecturer: selectedCourse.lecturer,
        date: formDataClass.date,
        registor: formDataClass.registor,
        pinCode: formDataClass.pinCode
      };
      const res = await axios.post("https://attendance-uni-backend.vercel.app/class/addclass", payload);
      
      if (res.data.success) {
        setSubmitSuccess({ success: true, message: res.data.message || "Class added successfully!" });
        setFormDataClass({ startTime: "", endTime: "", subjectID: "", lecturer: "", date: "", registor: "", pinCode: "" });
        setAddClass(false);
      } else {
        setSubmitSuccess({ success: false, message: res.data.message || "Failed to add class." });
      }
    } catch (e) {
      console.log(e);
      setSubmitSuccess({ success: false, message: "A server error occurred." });
    } finally {
      setIsSubmiting(false);
      setTimeout(() => {
        setSubmitSuccess({ success: false, message: "" });
      }, 3000);
    }
  };

  // --- RENDER COMPONENTS ---
  // const QRScanner = () => ( /* ... QRScanner content ... */ );
  // const AttendanceRecords = () => ( /* ... AttendanceRecords content ... */ );
  // const Reports = () => ( /* ... Reports content ... */ );

  const renderContent = () => {
    switch (activeTab) {
      case 'mark-register':
        return (
          <div className="space-y-6 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm py-2 px-2 sm:p-6">
              <div className='flex flex-row justify-between items-center mb-6'>
                <h3 className="text-xl font-semibold text-green-900">Lectures</h3>
                <button
                  className='bg-pink-600 flex flex-row items-center px-3 text-white py-2 rounded-xl cursor-pointer hover:bg-pink-700 transition-colors'
                  onClick={() => { setAddClass(true); }}
                >
                  <Plus size={20} color='white' className='mr-1'/>
                  <span className="hidden sm:inline">Add New Lecture</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>

              {addClass && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
                    <button onClick={() => setAddClass(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={28} className="text-gray-600 hover:text-gray-900"/>
                    </button>
                  </div>
                  <form className="space-y-4" onSubmit={handleSubmitClass}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" name="registor" placeholder="Registrar ID" value={formDataClass.registor} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0"/>
                      <input type="number" name="startTime" placeholder="Start Time" value={formDataClass.startTime} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <input type="number" name="endTime" placeholder="End Time" value={formDataClass.endTime} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0"/>
                       <input type="number" name="pinCode" placeholder="Pin code" value={formDataClass.pinCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0"/>
                    </div>
                    <div className="grid grid-cols-1">
                      <input type="date" name="date" placeholder="Date" value={formDataClass.date} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0"/>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
                      <h2 className="text-lg font-semibold text-gray-900">Select a Course</h2>
                      <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        {/* Filter Selects */}
                        <select value={filterBatchYear} onChange={(e) => setFilterBatchYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                           <option value="">Batch</option>
                           <option value="2021">2021</option>
                           <option value="2022">2022</option>
                           <option value="2023">2023</option>
                           <option value="2024">2024</option>
                        </select>
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                          <option value="">Year</option>
                           <option value="1">1st</option>
                           <option value="2">2nd</option>
                           <option value="3">3rd</option>
                           <option value="4">4th</option>
                        </select>
                        <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                           <option value="">Semester</option>
                           <option value="1">1st</option>
                           <option value="2">2nd</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {coursesLoading ? (
                        <div className="flex justify-center mt-14"><Loader2Icon size={40} className="animate-spin text-pink-700" /></div>
                      ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <div
                            key={course._id}
                            className={`rounded-lg shadow-sm hover:shadow-md p-4 border border-gray-200 hover:border-pink-400 cursor-pointer transition-all ${selectedCourse.subjectID === course._id ? "bg-pink-600 text-white" : "bg-white text-black"}`}
                            onClick={() => setSelectedCourse({ subjectID: course._id, lecturer: course.lecturerId })}
                          >
                           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                 <h3 className="text-lg font-semibold">{course.name}</h3>
                                 <p className="font-mono text-sm">{course.subjectCode}</p>
                                 <p className="text-sm">Year: {course.year}, Sem: {course.semester}, Batch: {course.batchYear}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm">Lecturer ID: {course.lecturerId}</p>
                                 <p className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${selectedCourse.subjectID === course._id ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-700"}`}>
                                   {course.studentsEnrolled?.length || 0} Students
                                 </p>
                              </div>
                           </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500"><p>No courses match the selected filters.</p></div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button type="button" onClick={() => setAddClass(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                      <button type="submit" disabled={isSubmiting} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 flex items-center justify-center min-w-[120px]">
                        {isSubmiting ? <Loader2Icon size={24} className='text-white animate-spin'/> : "Add Lecture"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {/* active classes */}
            <div className='bg-white rounded-lg shadow-sm py-2 px-2 sm:p-6 flex flex-col'>
              <div className='flex flex-row justify-between items-center mb-6'>
                <h3 className="text-xl font-semibold text-green-900">Active Lectures</h3>
                {/* <button
                  className='bg-pink-600 flex flex-row items-center px-3 text-white py-2 rounded-xl cursor-pointer hover:bg-pink-700 transition-colors'
                  onClick={() => { setAddClass(true); }}
                >
                  <Plus size={20} color='white' className='mr-1'/>
                  <span className="hidden sm:inline">Add New Lecture</span>
                  <span className="sm:hidden">New</span>
                </button> */}
              </div>
            {/* classes */}
             <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {classesLoading ? (
                        <div className="flex justify-center mt-14"><Loader2Icon size={40} className="animate-spin text-pink-700" /></div>
                      ) : ongoingClasses.length > 0 ? (
                        ongoingClasses.map((classes) => (
                          <div
                            key={classes._id}
                            className={`rounded-lg shadow-sm hover:shadow-md p-4 border border-gray-200 hover:border-pink-400 cursor-pointer transition-all ${selectedCourse.subjectID === classes._id ? "bg-pink-600 text-white" : "bg-white text-black"}`}
                           
                          >
                           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                 <h3 className="text-lg font-semibold">{classes.subjectID.name}</h3>
                                 <p className="font-mono text-sm ">{classes.lecturer.name}</p>
                                 <p className="text-sm text-gray-700">{classes.startTime}:00 - {classes.endTime}:00</p>
                                 <p className='text-sm text-gray-700'>
                                  {new Date(classes.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
                                 </p>
                              </div>
                              <div className="text-right ">
                                 {/* <p className="text-sm">Lecturer ID: {classes.lecturer.reg_no}</p> */}
                                 <p className="text-sm mb-1">{classes.registor.name}</p>

                                 <p className="text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 bg-pink-600 text-white">
                                   {classes.studentsAttended?.length || 0} Students
                                 </p>
                              </div>
                           </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500"><p>No Active Classes ongoing .</p></div>
                      )}
                    </div>
            </div>
          </div>
        );
      case 'qr-scanner': return <QRScanner />;
      case 'attendance': return <AttendanceRecords />;
      case 'reports': return <Reports />;
      case 'profile': return (<div className="bg-white rounded-lg shadow-sm p-6"> Profile Content </div>);
      default: return null;
    }
  };

  const tabs = [
    { id: 'mark-register', label: 'Classes', icon: ClipboardList },
    { id: 'attendance', label: 'Records', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: Users },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-white shadow-sm text-purple-800"
          >
            <Menu size={20} className="mr-3" />
            {tabs.find((tab) => tab.id === activeTab)?.label || "Menu"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:relative lg:w-64 lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:p-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false); // Close menu on selection
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pink-100 text-pink-600 font-semibold border-l-4 border-pink-600'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
            {submitSuccess.message && (
              <div
                className={`fixed top-24 right-4 z-50 px-4 py-2 rounded shadow-lg max-w-xs text-white ${
                  submitSuccess.success ? "bg-green-500" : "bg-red-500"
                } transition-all duration-300`}
              >
                {submitSuccess.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default RegistrarDashboard;