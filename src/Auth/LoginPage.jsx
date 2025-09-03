import axios from "axios";
import { BookOpenText, ClipboardList, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const LoginPage = () => {
  const [isSignin, setIsSignIn] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const[errMessage,setErrMessage]=useState("");
  const[successMessage,setSuccessMessage]=useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    reg_no: "",
    confirmPassword: "",
    role: "",
    gender: "",
    dob: "",
    contact_no: "",
  });

  const { login, register, loading } = useAuth();

  const roles = [
    { role: "student", icon: GraduationCap },
    { role: "lecturer", icon: BookOpenText },
    { role: "registrar", icon: ClipboardList },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const signIn=(e)=>{
    e.preventDefault();

  }
  const signUp = async (e) => {
  e.preventDefault();

  try {
    if(formData.confirmPassword!=formData.password)
    {
      setErrMessage("Passwords didnt match")
      return
    }
    const res = await axios.post("http://localhost:5000/users/signup", formData);
    if(res.data.success){
      setErrMessage(""),
      setSuccessMessage("User details send to admin success")
console.log("✅ Registered:");

    }
    else {
      setSuccessMessage(''),
      setErrMessage(res.data.message)}
    
    // Example: after successful signup, switch to login
    // setIsSignIn("login");
  } catch (err) {
    console.error("❌ Signup error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Something went wrong!");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full shadow-2xl">
        {isSignin === "login" && (
          <form onSubmit={signIn}>
            <div className="flex flex-col gap-3 pt-5 p-4 bg-white ">
            <div className="text-2xl font-bold text-center mb-6 ">
              Welcome Back
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="enter the email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col mt-2">
              <label className="mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="enter the password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-2 px-2 border-gray-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex-row flex justify-between mx-2 mb-4">
              <div>
                <input type="checkbox" /> Remember Me
              </div>
              <div className="text-purple-600">Forgot password</div>
            </div>

            <div className="flex flex-row ">
              <button className="bg-purple-600 w-full mx-2 rounded-lg h-10 text-white ">
                Login
              </button>
            </div>

            <div className="text-center">
              Don’t have an Account{" "}
              <span
                className="text-purple-600 font-bold cursor-pointer"
                onClick={() => setIsSignIn("signup")}
              >
                Sign Up
              </span>
            </div>
          </div>

          </form>
          
        )}

        {isSignin === "signup" && (
          <form onSubmit={signUp}>
              <div className="flex flex-col gap-3 pt-5 p-4 bg-white ">
            <div className="text-2xl font-bold text-center mb-6 ">Register</div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Reg No</label>
              <input
                type="text"
                name="reg_no"
                placeholder="enter registration number"
                value={formData.reg_no}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="enter the email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Contact No</label>
              <input
                type="text"
                name="contact_no"
                placeholder="enter contact number"
                value={formData.contact_no}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Role Selection */}
            <div className="mx-2 flex flex-col">
              <label className="mb-1 flex flex-row">Role</label>
              <div className="flex flex-row gap-3 ">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedRole(role.role);
                        setFormData({ ...formData, role: role.role });
                      }}
                      className={`flex flex-row mx-2 items-center py-2 px-2 border-2 rounded-lg cursor-pointer ${
                        selectedRole === role.role
                          ? "border-purple-600 bg-purple-100"
                          : "border-gray-300"
                      }`}
                    >
                      <Icon
                        size={32}
                        className={`${
                          selectedRole === role.role
                            ? "text-purple-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`mx-1 ${
                          selectedRole === role.role
                            ? "text-purple-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {role.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Date Of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col">
              <label className="mb-1">Gender</label>
              <input
                type="text"
                name="gender"
                placeholder="enter gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-lg px-2 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col mt-2">
              <label className="mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="enter password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-2 px-2 border-gray-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="mx-2 flex flex-col mt-2">
              <label className="mb-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full py-2 px-2 border-gray-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
               {errMessage && (
  <div className="border border-red-500 text-red-600 px-4 py-2 rounded mb-4 mx-2 text-center">
    {errMessage}
  </div>
)}

{successMessage && (
  <div className="border border-green-500 text-green-600 px-4 py-2 rounded mb-4 text-center">
    {successMessage}
  </div>
)}

            <div className="flex-row flex justify-between mx-2 mb-4">
              <div>
                <input type="checkbox" /> Remember Me
              </div>
            </div>

            <div className="flex flex-row ">
              <button className="bg-purple-600 w-full mx-2 rounded-lg h-10 text-white " type="submit">
                Register
              </button>
            </div>

            <div className="text-center">
              Already have an account?{" "}
              <span
                className="text-purple-600 font-bold cursor-pointer"
                onClick={() => setIsSignIn("login")}
              >
                Login
              </span>
            </div>
          </div>
          </form>
        
        )}
      </div>
    </div>
  );
};

export default LoginPage;
