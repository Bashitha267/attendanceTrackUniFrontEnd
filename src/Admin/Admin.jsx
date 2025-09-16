import axios from 'axios';
import { BookOpen, ClipboardList, GraduationCapIcon, Grid2X2, Hourglass, Loader2Icon, MailIcon, Menu, PhoneIcon, Plus, ShieldIcon, Trash2Icon, User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../Layout/Header';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [profileData, setProfileData] = useState([]);
  const [openApproveFilter, setOpenApprovefilter] = useState(false);
  const [activeApprove, setActiveApprove] = useState("all");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [toast, setToast] = useState({ message: "", type: '' });
  const [courseLoading, setCourseLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectsloading, setSubjectsloading] = useState(false);
  const [filterBatchYear, setFilterBatchYear] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [pendingApprovels, setPendingApprovels] = useState([]);
  const [filteredApprovels, setFilterdApprovels] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeroles = [
    { id: 'all', icon: Grid2X2 },
    { id: 'student', icon: GraduationCapIcon },
    { id: 'lecturer', icon: BookOpen },
    { id: 'registrar', icon: ClipboardList }
  ];

  const [formDataCourse, setFormDataCourse] = useState({
    subjectCode: "",
    name: "",
    year: "",
    semester: "",
    lecturerId: "",
    batchYear: "",
    subpinCode:"",
  });

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setProfileData(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const getApprovels = async () => {
      try {
        const res = await fetch("https://attendance-uni-backend.vercel.app/users/getnotapproved");
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setPendingApprovels(data.users);
          setFilterdApprovels(data.users);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getApprovels();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsloading(true);
        const response = await axios.get('https://attendance-uni-backend.vercel.app/subjects/getsubjects');
        if (response.data.success) setSubjects(response.data.subjects);
      } catch (err) {
        console.log(err);
      } finally {
        setSubjectsloading(false);
      }
    };
    fetchSubjects();
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

  useEffect(() => {
    if (pendingApprovels.length > 0) {
      if (activeApprove === "all") setFilterdApprovels(pendingApprovels);
      else setFilterdApprovels(pendingApprovels.filter(item => item.role === activeApprove));
    } else setFilterdApprovels([]);
  }, [activeApprove, pendingApprovels]);

  const handleInputChangeCourse = (e) => setFormDataCourse({ ...formDataCourse, [e.target.name]: e.target.value });

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      setCourseLoading(true);
      const res = await axios.post("https://attendance-uni-backend.vercel.app/subjects/create", formDataCourse);
      setCourseLoading(false);
      if (res.data.success) {
        setToast({ message: "Course added successfully", type: true });
        setShowAddCourse(false);
        setFormDataCourse({ subjectCode: "", name: "", year: "", semester: "", lecturerId: "", batchYear: "" });
      } else setToast({ message: "Failed to add course", type: false });
    } catch (error) {
      setCourseLoading(false);
      setToast({ message: "Enter valid details", type: false });
    }
  };

  const addApprove = async (reg_no) => {
    try {
      const response = await axios.put(`https://attendance-uni-backend.vercel.app/users/approve/${reg_no}`);
      if (response.data.success) {
        setToast({ message: "Approving success", type: true });
        setPendingApprovels(prev => prev.filter(u => u.reg_no !== reg_no));
        setFilterdApprovels(prev => prev.filter(u => u.reg_no !== reg_no));
      } else setToast({ message: "Error Cannot perform Approvel", type: false });
    } catch (error) {
      setToast({ message: "Error approving user", type: false });
    }
  };

  const removeUser = async (reg_no) => {
    try {
      const response = await axios.delete(`https://attendance-uni-backend.vercel.app/users/deleteuser/${reg_no}`);
      if (response.data.success) {
        setToast({ message: "User removed successfully", type: true });
        setPendingApprovels(prev => prev.filter(u => u.reg_no !== reg_no));
        setFilterdApprovels(prev => prev.filter(u => u.reg_no !== reg_no));
      } else setToast({ message: "Error removing user", type: false });
    } catch (error) {
      setToast({ message: "Error removing user", type: false });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
              <button onClick={() => setShowAddCourse(true)} className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-900 text-white rounded-lg w-full sm:w-auto">
                <Plus size={18} className="mr-2" /> Add Course
              </button>
            </div>
            {showAddCourse && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
                  <button onClick={() => setShowAddCourse(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={28} className='text-gray-600 hover:text-gray-900' />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitCourse}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name='name' placeholder="Course Name" value={formDataCourse.name} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                    <input type="text" name='subjectCode' placeholder="Course ID" value={formDataCourse.subjectCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="number" name='batchYear' placeholder="Academic Year" value={formDataCourse.batchYear} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                    <select name='year' value={formDataCourse.year} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0">
                      <option disabled value="">Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    <select name='semester' value={formDataCourse.semester} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0">
                      <option disabled value="">Semester</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                    <input type="text" name='lecturerId' placeholder="Lecture ID" value={formDataCourse.lecturerId} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />
                  </div>
                  <div className='grid grid-cols-2'>
                    <input type="text" name='subpinCode' placeholder="Subject Pin Code" value={formDataCourse.subpinCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-0" />

                  </div>

                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-900 min-w-[110px]">
                      {courseLoading ? <Loader2Icon size={24} className='animate-spin mx-auto' /> : "Add Course"}
                    </button>
                  </div>

                </form>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select value={filterBatchYear} onChange={e => setFilterBatchYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Academic Year</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                </select>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Year</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                </select>
                <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Semester</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {subjectsloading && <div className='flex justify-center mt-14'><Loader2Icon size={40} className='animate-spin text-purple-700' /></div>}
              {!subjectsloading && filteredSubjects.map(course => (
                <div key={course._id} className="bg-white rounded-lg shadow-lg hover:bg-gray-50 p-4 border-2 border-purple-200 hover:border-purple-400">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-gray-800">Lecture ID: {course.lecturerId}</p>
                      <p className="text-gray-800">Subject Pin Code: {course.subpinCode}</p>

                      <p className="text-gray-800">{course.subjectCode}</p>
                      <p className="text-sm text-gray-700">Year: {course.year}, Semester: {course.semester}, Batch: {course.batchYear}</p>
                    </div>
                    <div className='flex gap-3 self-end sm:self-center'>
                      <button className="p-2 hover:bg-gray-200 rounded-full"><User size={24} className="text-green-500" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-full"><Trash2Icon size={24} className="text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden font-sans border border-gray-200/80">
            <div className="relative">
              <div className="h-32 bg-[#9810FA]"></div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 transform">
                <img className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md" src={profileData.img || 'https://res.cloudinary.com/dnfbik3if/image/upload/v1757522500/Gemini_Generated_Image_35u0bk35u0bk35u0_mbqnnr_og0ikh.png'} alt="Admin" />
              </div>
            </div>
            <div className="text-center px-6 pt-20 pb-8">
              <h2 className="text-2xl font-bold text-gray-800">{"Admin"}</h2>
              <p className="text-gray-500 mt-1 text-sm">System Administrator</p>
              <div className="mt-8 text-left space-y-5 max-w-sm mx-auto">
                <div className="flex items-center"><MailIcon /><div className="ml-4"><p className="text-xs text-gray-500">Email</p><a href={`mailto:${profileData.email}`} className="text-sm font-medium text-gray-700 hover:text-purple-600 break-all">{profileData.email}</a></div></div>
                <div className="flex items-center"><PhoneIcon /><div className="ml-4"><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-700">{profileData.contact_no || "Not Available"}</p></div></div>
                <div className="flex items-center"><ShieldIcon /><div className="ml-4"><p className="text-xs text-gray-500">Access Level</p><p className="text-sm font-medium text-gray-700">Full System Access</p></div></div>
              </div>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div className='text-xl font-semibold text-gray-900 '>Pending Requests</div>
              <div className="relative w-full sm:w-auto">
                <button onClick={() => setOpenApprovefilter(!openApproveFilter)} className="text-lg inline-flex items-center justify-between w-full sm:w-auto px-4 py-1 border-2 border-purple-600 rounded-lg">
                  Filter <svg className="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
                </button>
                <div className={`${openApproveFilter ? 'z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 absolute right-0 mt-2' : 'hidden'}`}>
                  <ul className="py-2 text-sm text-black">
                    {activeroles.map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <li key={role.id}>
                          <div onClick={() => { setActiveApprove(role.id); setOpenApprovefilter(false); }} className={`${activeApprove === role.id ? 'bg-purple-700 text-white' : ''} px-4 py-2 flex gap-4 items-center hover:bg-purple-400 hover:text-white cursor-pointer`}>
                            <RoleIcon size={20} /><span className="font-bold text-md capitalize">{role.id}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              {filteredApprovels.length === 0 && <p className="text-center text-gray-500">No pending Requests to approve.</p>}
              {filteredApprovels.map(request => (
                <div key={request.reg_no} className='flex flex-col md:flex-row justify-between gap-4 p-4 shadow-md rounded-lg bg-white hover:bg-gray-50'>
                  <div className="flex-grow space-y-2">
                    <div className="text-sm text-gray-500">Reg No: <span className="font-medium text-gray-800">{request.reg_no}</span></div>
                    <div className="text-sm text-gray-500">Name: <span className="font-medium text-gray-800">{request.name}</span></div>
                    <div className="text-sm text-gray-500">Email: <span className="font-medium text-gray-800 break-all">{request.email}</span></div>
                    <div className="text-sm text-gray-500">Role: <span className="font-medium text-purple-700 capitalize bg-purple-100 px-2 py-1 rounded-full">{request.role}</span></div>
                  </div>
                  <div className='flex gap-3 self-end md:self-center flex-shrink-0'>
                    <button className='bg-green-100 border-2 border-green-500 rounded-xl px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-200' onClick={() => addApprove(request.reg_no)}>Approve</button>
                    <button className='bg-red-100 border-2 border-red-500 rounded-xl px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200' onClick={() => removeUser(request.reg_no)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'pending', label: 'Pending Approval', icon: Hourglass }
  ];

  return (
   <div className="min-h-screen bg-gray-50">
  <Header />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Mobile Menu Button */}
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex items-center w-full px-4 py-3 text-left rounded-lg bg-white shadow-sm text-purple-800"
      >
        <Menu size={20} className="mr-3" />
        {tabs.find(tab => tab.id === activeTab)?.label || "Menu"}
      </button>
    </div>

    <div className="relative flex flex-col lg:flex-row lg:space-x-8">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:bg-transparent ${
          mobileMenuOpen ? "translate-x-0 z-20" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-2 p-4 lg:p-0 lg:bg-transparent rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false); // close on mobile
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-700 text-white font-semibold shadow"
                  : "text-purple-800 hover:bg-purple-100 hover:text-purple-600"
              }`}
            >
              <tab.icon size={20} className="mr-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-4 lg:mt-0">
        {renderContent()}
      </div>
    </div>
  </div>

  {/* Toast */}
  {toast.message && (
    <div
      className={`fixed top-24 right-4 z-50 px-4 py-2 rounded shadow-lg max-w-xs text-white ${
        toast.type ? "bg-green-500" : "bg-red-500"
      } transition-all duration-300`}
    >
      {toast.message}
    </div>
  )}
</div>

  );
};

export default AdminDashboard;