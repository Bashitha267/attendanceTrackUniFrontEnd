import axios from 'axios';
import { Check, ClipboardList, Database, Edit2, Loader2, Loader2Icon, Menu, Plus, PlusIcon, QrCode, Trash2, Users, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Header from '../Layout/Header';

const RegistrarDashboard = () => {
  const [activeTab, setActiveTab] = useState('mark-register');
  const [addClass, setAddClass] = useState(false);
  const [allClasses, setAllClasses] = useState([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState({ message: "", success: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ongoingClasses, setOngoingClasses] = useState([]);
  const [inputCode, setInputCode] = useState('');
  const[isCompleting,setIsCompleting]=useState(false)
  const [classesLoading, setClassesLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");

  // marking attendance
  const [userData, setUserData] = useState({});
  const [gotID, setGotId] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // filtering course 
  const [inputDate, setInputDate] = useState("");
  const [inputYear, setInputYear] = useState("");

  const updateClass = async () => {
    try {
      setIsCompleting(true)
      const response = await axios.patch(
        `https://attendance-uni-backend.vercel.app/class/setComplete/${selectedClass._id}`
      );

      if (response.data.success) {
        setIsCompleting(false)
        setSubmitSuccess({ success: true, message: "Lecture Marked as Complete" });
        setTimeout(() => {
          setSubmitSuccess({ success: false, message: "" });
        }, 3000);
        setActiveTab("mark-register");
        setSelectedClass("");
      } else {
        setIsCompleting(false)
        setSubmitSuccess({ success: false, message: response.data.message });
        setTimeout(() => {
          setSubmitSuccess({ success: false, message: "" });
        }, 3000);
        console.log("Update failed:");
      }
    } catch (error) {
      setIsCompleting(false)
      console.error("Error updating student:", error);
    }
  }

  const handleAddAttendance = async () => {
    try {
      setIsSubmiting(true)
      const response = await axios.post(
        `https://attendance-uni-backend.vercel.app/class/addattendance/${selectedClass._id}`,
        { "studentId": userData._id }
      );

      if (response.data.success) {
        setIsSubmiting(false)
        setSubmitSuccess({ success: true, message: "Student Added Successfully" });
        setSelectedClass(prevClass => ({
          ...prevClass,
          studentsAttended: [
            ...prevClass.studentsAttended,
            { reg_no: userData.reg_no, name: userData.name }
          ]
        }));
        setUserData("");
        setGotId("");
        setTimeout(() => {
          setSubmitSuccess({ success: false, message: "" });
        }, 3000);
      } else {
        setSubmitSuccess({ success: false, message: response.data.message });
        setIsSubmiting(false)
        setTimeout(() => {
          setSubmitSuccess({ success: false, message: "" });
        }, 3000);
      }
    } catch (error) {
      setIsSubmiting(false)
      setSubmitSuccess({ success: false, message: "Server Error" });
      setTimeout(() => {
        setSubmitSuccess({ success: false, message: "" });
      }, 3000);
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setUserLoading(true);
        if (!gotID) {
          return;
        }
        const response = await axios.get(`https://attendance-uni-backend.vercel.app/users/getbyid/${gotID}`);
        if (response.data.success) {
          setUserData(response.data.user);
        }
      } catch (err) {
        console.log("Error fetching courses:", err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchCourses();
  }, [gotID]);

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get(`https://attendance-uni-backend.vercel.app/class/getAll`);
        if (response.data.success) {
          setAllClasses(response.data.data);
        }
      } catch (err) {
        console.log("Error fetching all classes:", err);
      }
    };
    fetchAllClasses();
  }, [addClass, submitSuccess,isCompleting]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User not found in localStorage.");
        const userProfile = JSON.parse(storedUser);
        setProfileData(userProfile);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const [formDataClass, setFormDataClass] = useState({
    startTime: "",
    endTime: "",
    subjectID: "",
    lecturer: "",
    date: "",
    registor: profileData ?profileData.reg_no :"",
    pinCode: ""
  });

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
          setOngoingClasses(response.data.classes);
        }
      } catch (err) {
        console.log("Error fetching classes:", err);
      } finally {
        setClassesLoading(false);
      }
    };
    fetchClasses();
  }, [addClass]);

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
        setActiveTab("mark-register")
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

  const checkPinCode = () => {
    setSubmitSuccess({ message: "", success: false });
    if (inputCode === selectedClass.pinCode) {
      setSubmitSuccess({ success: true, message: "Pincode Verified" });
      setInputCode("");
      setActiveTab("attendance");
      setTimeout(() => {
        setSubmitSuccess({ message: "", success: false });
      }, 3000);
      return;
    }
    setSubmitSuccess({ success: false, message: "Invalid Pincode" });
    setInputCode("");
    setActiveTab("mark-register");
    setTimeout(() => {
      setSubmitSuccess({ message: "", success: false });
    }, 3000);
  };

  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const handleScan = (err, result) => {
    if (result) {
      setScannedData(result.text);
      setGotId(result.text);
      setScanning(false);
    }
  };
//delete method
const deleteClass =async (id)=>{
  try{
if(!id){
    setSubmitSuccess("Id Required")
  }
  setIsSubmiting(true)
  const res=await axios.delete(`https://attendance-uni-backend.vercel.app/class/deletebyid/${id}`)
  if(res.data.success){
     setSubmitSuccess({ success: true, message: "class Deleted Successfully" });
     setActiveTab("mark-register")
     setSelectedClass("")
     setIsSubmiting(false)
     setTimeout(() => {
      setSubmitSuccess({ message: "", success: false });
    }, 3000);
    return
  }
    setSubmitSuccess({ success: false, message: "Cannot delete Class" });
     setIsSubmiting(false)

 setTimeout(() => {
        setSubmitSuccess({ message: "", success: false });
      }, 3000);
      return;
  }catch(e){
    console.log(e)
     setIsSubmiting(false)

  }
  
}
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
                  <Plus size={20} color='white' className='mr-1' />
                  <span className="hidden sm:inline">Add New Lecture</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>

              {addClass && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
                    <button onClick={() => setAddClass(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={28} className="text-gray-600 hover:text-gray-900" />
                    </button>
                  </div>
                  <form className="space-y-4" onSubmit={handleSubmitClass}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" name="registor" placeholder="Registrar ID" value={formDataClass.registor} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0" />
                      <input type="number" name="startTime" placeholder="Start Time" value={formDataClass.startTime} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="number" name="endTime" placeholder="End Time" value={formDataClass.endTime} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0" />
                      <input type="number" name="pinCode" placeholder="Pin code" value={formDataClass.pinCode} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0" />
                    </div>
                    <div className="grid grid-cols-1">
                      <input type="date" name="date" placeholder="Date" value={formDataClass.date} onChange={handleInputChangeCourse} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-0" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
                      <h2 className="text-lg font-semibold text-gray-900">Select a Course</h2>
                      <div className="flex flex-wrap gap-3 w-full md:w-auto">
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
                        {isSubmiting ? <Loader2Icon size={24} className='text-white animate-spin' /> : "Add Lecture"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {
              selectedClass && (
                <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Go to Class</h2>
                    <p className="mb-4 text-gray-600">
                      Enter the PIN code for <strong className="text-pink-700">{selectedClass.subjectID.name}</strong> to take attendance.
                    </p>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Enter PIN Code here"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-3">
                      <button onClick={() => {
                        setSelectedClass("")
                      }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                      </button>
                      <button onClick={checkPinCode} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
            <div className='bg-white rounded-lg shadow-sm py-2 px-2 sm:p-6 flex flex-col'>
              <div className='flex flex-row justify-between items-center mb-6'>
                <h3 className="text-xl font-semibold text-green-900">Active Lectures</h3>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {classesLoading ? (
                  <div className="flex justify-center mt-14"><Loader2Icon size={40} className="animate-spin text-pink-700" /></div>
                ) : ongoingClasses.length > 0 ? (
                  ongoingClasses.map((classes) => (
                    <div
                      key={classes._id}
                      className={`rounded-lg shadow-sm hover:shadow-md p-4 border border-gray-200 hover:border-pink-400 cursor-pointer transition-all bg-white text-black`}
                      onClick={() => {
                        setSelectedClass(classes)
                      }}>
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
                        <div className="text-left  lg:text-right ">
                          <p className="text-sm mb-1">Registor Name:{classes.registor.name}</p>
                          <p className="text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 bg-pink-600 text-white">
                            {classes.studentsAttended?.length || 0} Students
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500"><p>No Active Classes ongoing.</p></div>
                )}
              </div>
            </div>
          </div>
        );

      case 'records': return (
        <div className="space-y-6">
          <div className='bg-white rounded-lg shadow-sm p-4'></div>
        </div>
      );

      case 'attendance': return (
        <div className="space-y-6">
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className=" flex flex-col sm:flex-row lgS:items-center lg:justify-between ">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedClass.subjectID.name}</h2>
                <p className="text-sm text-gray-500">Lecturer Name:{selectedClass.lecturer.name}</p>
                <p className="text-sm text-gray-500">Registor Name:{selectedClass.registor.name}</p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Start Time</p>
                  <p className="text-sm font-medium text-gray-800">{selectedClass.startTime}:00</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">End Time</p>
                  <p className="text-sm font-medium text-gray-800">{selectedClass.endTime}:00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-pink-800">
            <div className='flex lg:flex-row justify-between flex-col gap-3'>
              <div className='items-center text-lg font-semibold text-green-900 lg:w-fit px-2 '>Add Attendance</div>
              <button
                onClick={() => setScanning((prev) => !prev)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg w-fit hover:bg-pink-700 transition duration-200 items-center"
              >
                {scanning ? <X size={24}></X> : <PlusIcon size={24}></PlusIcon>}
              </button>
            </div>

            {scanning && (
              <div className="mt-4  rounded-lg overflow-hidden max-w-3xl justify-center items-center flex flex-row">
                <BarcodeScannerComponent
                  width={450}
                  height={50}
                  onUpdate={handleScan}
                />
              </div>
            )}

            {scannedData && (
              <div className="mt-4">
                <p className="font-medium text-green-600">
                  Scanned Data: {scannedData}
                </p>
              </div>
            )}
          </div>
          {
            gotID && (
              <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
                {userLoading && (
                  <div className='animate-spin text-pink-800'><Loader2Icon size={35} ></Loader2Icon></div>
                )}
                {!userLoading && (<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col border-2 border-pink-800">
                  <h2 className="text-xl text-center font-semibold mb-3 text-green-900 ">Student Information</h2>
                  <div className="  justify-center flex flex-row items-center mb-2 mt-2">
                    <div className='bg-pink-300 w-32 h-32'></div>
                  </div>
                  <h3 className='text-lg font-semibold mb-2 text-gray-800'>Student Name: {userData.name || ""}</h3>
                  <p className='text-lg font-semibold mb-2 text-gray-800'>Registration Number: {userData.reg_no || ""}</p>
                  <div className="flex justify-center space-x-3 mt-2">
                    <button onClick={() => {
                      setGotId("")
                    }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                     Cancel
                    </button>
                    <button onClick={handleAddAttendance} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors">
                      {isSubmiting ? <Loader2 className='animate-spin text-white'></Loader2> :<div className='flex gap-2'> <span>Add</span></div> }
                    </button>
                  </div>
                </div>)}
              </div>
            )
          }
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className='flex flex-row justify-between'>
              <h2 className="text-lg font-semibold mb-3 text-green-800">Students ID</h2>
              <h2 className="text-lg font-semibold mb-3 text-pink-700">Students Count:<span className='text-pink-700 mx-1'>{selectedClass.studentsAttended.length}</span></h2>
            </div>
            {selectedClass.studentsAttended && selectedClass.studentsAttended.length > 0 ? (
              <ol className="space-y-2  px-2">
                {selectedClass.studentsAttended.map((student) => (
                  <li
                    key={student.reg_no}
                    className=" items-center  py-3 px-4 bg-gray-50 rounded shadow-sm "
                  >
                    <span className="text-lg">{student.reg_no}</span>
                  </li>
                ))}
              </ol>
              
            ) : (
              <p className="text-gray-500 italic">No students have attended this class yet.</p>
              
            )}
               <div className='flex flex-row gap-4 lg:justify-end justify-center mt-2 mb-2 '>
            <div className='flex flex-row gap-2 bg-red-600 hover:bg-red-800 text-white py-2 items-center px-3 rounded-2xl ' onClick={()=>{
              
              deleteClass(selectedClass._id)
            }} > { isSubmiting ?<Loader2 className='text-white animate-spin '></Loader2>:<Trash2></Trash2> } </div>
            <div className='flex flex-row gap-2 bg-green-600 hover:bg-green-800 py-2 px-3 rounded-2xl items-center text-white' onClick={updateClass}>{isCompleting ? <Loader2 className='text-white animate-spin '></Loader2> :<Check className='text-white'></Check>}  </div>
          </div>
          </div>
       
        </div>
      );

      case 'reports':
        const filteredReportClasses = allClasses.filter(cls => {
            if (!cls || !cls.subjectID) return false;
            const matchesDate = inputDate ? cls.date.slice(0, 10) === inputDate : true;
            const matchesYear = inputYear ? cls.subjectID.year === Number(inputYear) : true;
            return matchesDate && matchesYear;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); 

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className='flex flex-col sm:flex-row justify-between'>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4">
                            <label htmlFor="class-date" className="text-gray-700 font-medium">
                                Select Date:
                            </label>
                            <input
                                type="date"
                                id="class-date"
                                value={inputDate}
                                onChange={(e) => setInputDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none w-fit"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4">
                            <label htmlFor="class-year" className="text-gray-700 font-medium">
                                Select Year:
                            </label>
                            <select
                                id="class-year"
                                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none'
                                value={inputYear}
                                onChange={(e) => setInputYear(e.target.value)}
                            >
                                <option value="">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4 pr-2">
                        {classesLoading ? (
                            <div className="flex justify-center mt-14"><Loader2Icon size={40} className="animate-spin text-pink-700" /></div>
                        ) : filteredReportClasses.length > 0 ? (
                            filteredReportClasses.map((classes) => (
                                <div
                                    key={classes._id}
                                    className={`rounded-lg shadow-sm hover:shadow-md p-4 border border-gray-200 hover:border-pink-400 cursor-pointer transition-all bg-white text-black`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                          <div className='flex flex-row items-center gap-5'>
                                            <div className="text-lg font-semibold">{classes.subjectID.name}</div>
                                             {/* <div className=' bg-green-500 rounded-2xl px-3 text-white text-md'>Active</div> */}
                                          </div>
                                            
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
                                        <div className='flex lg:flex-row lg:gap-20 w-fit items-center flex-row-reverse justify-between  lg:justify-end'>
                                          <div className='flex flex-row gap-3 '>
  <div><Edit2 className='text-green-500 hover:text-green-800' size={24} onClick={()=>{
    setSelectedClass(classes)
    checkPinCode()

  }}></Edit2></div>
                                          <div onClick={()=>{
                                            deleteClass(classes._id)
                                          }}>{isSubmiting ? <Loader2 size={24} className='text-white anima'></Loader2>:<Trash2 size={24} className='text-red-500 hover:text-red-900' ></Trash2>}</div>
                                          </div>
                                        
                                          
    <div className="text-left lg:text-right ">
                                            <p className="text-sm mb-1">Registrar: {classes.registor.name}</p>
                                            <p className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1  bg-pink-600 text-white`}>
                                                {classes.studentsAttended?.length || 0} Students
                                            </p>
                                        </div>
                                        </div>
                                    
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500"><p>No classes match the selected filters.</p></div>
                        )}
                    </div>
                </div>
            </div>
        );

      case 'profile': return (
        profileData && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-6">Register Information</h3>
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8">
                <img src={profileData.img} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-900">Name</label><p className="text-gray-700">{profileData.name}</p></div>
                    <div><label className="block text-sm font-medium text-gray-900">Register ID</label><p className="text-gray-700">{profileData.reg_no}</p></div>
                    <div><label className="block text-sm font-medium text-gray-900">Email</label><p className="text-gray-700">{profileData.email}</p></div>
                    <div><label className="block text-sm font-medium text-gray-900">Department</label><p className="text-gray-700">Computer Science</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><QrCode className="mr-2" size={20} /> Register QR Code</h3>
              <div className="text-center">
                <div className="bg-gray-100 p-8 rounded-lg inline-block">
                  <div className="mt-4 flex flex-col items-center">
                    <QRCodeCanvas
                      value={profileData.reg_no}
                      size={240}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                    />
                    <p className="mt-2 text-sm text-gray-700">Registrar ID:{profileData.reg_no}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      );
      default: return null;
    }
  };

  const tabs = [
    { id: 'mark-register', label: 'Classes', icon: ClipboardList },
    // { id: 'records', label: 'Records', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: Database},
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

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
          <div className={`fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:relative lg:w-64 lg:translate-x-0 lg:shadow-none lg:bg-transparent lg:p-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedClass("")
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
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

          <div className="flex-1">
            {renderContent()}
            {submitSuccess.message && (
              <div
                className={`fixed top-24 right-4 z-50 px-4 py-2 rounded shadow-lg max-w-xs text-white ${submitSuccess.success ? "bg-green-500" : "bg-red-500"
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