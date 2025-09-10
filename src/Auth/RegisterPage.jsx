import axios from "axios";
import { BookOpenText, ClipboardList, GraduationCap, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [view, setView] = useState("signup"); // 'signup' or 'confirmEmail'
  const [showPassword, setShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const[loading,setLoading]=useState(false)
  const [otp, setOtp] = useState(""); // User's OTP input
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    reg_no: "",
    confirmPassword: "",
    role: "student",
    gender: "",
    dob: "",
    contact_no: "",
  });

  // const { register, loading } = useAuth(); // From your context

  const roles = [
    { role: "student", icon: GraduationCap },
    { role: "lecturer", icon: BookOpenText },
    { role: "registor", icon: ClipboardList },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailVerification = async () => {
    setErrMessage("");
    setSuccessMessage("");
    setLoading(true)
    try {
      
      const res = await axios.post(
        "https://attendance-uni-backend.vercel.app/users/sendmail",
        { email: formData.email, otp: otp }
      );
      if (res.data.success) {
        setSuccessMessage("Verification Success! Pending Admin Approval. Redirecting to login...");
        setLoading(false)
        setTimeout(() => {
          navigate("/login"); // Redirect to login after a short delay
        }, 3000);
      } else {
        setLoading(false)

        setErrMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrMessage("An error occurred during verification.");
      setLoading(false)
      console.error("OTP verification error:", error);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    setErrMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true)
      const res = await axios.post("https://attendance-uni-backend.vercel.app/users/signup", formData);
      
      if (res.data.success) {
        setLoading(false)
        setView("confirmEmail");
        setSuccessMessage("An OTP has been sent to your email.");
      } else {
      setLoading(false)

        setErrMessage(res.data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false)

      setErrMessage(
       "An unexpected server error occurred."
      );
    }
  };

  if (view === "confirmEmail") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-2xl font-bold text-center mb-2 text-gray-800">
            Confirm Your Email
          </div>
          <p className="text-center text-gray-600 text-sm mb-6">
            An OTP has been sent to {formData.email}
          </p>

          <div className="flex flex-col gap-4">
            <InputField
              label="Enter OTP"
              name="otp"
              placeholder="Check your email for the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {errMessage && <div className="border border-red-500 bg-red-50 text-red-600 px-4 py-2 rounded text-center text-sm">{errMessage}</div>}
            {successMessage && <div className="border border-green-500 bg-green-50 text-green-600 px-4 py-2 rounded text-center text-sm">{successMessage}</div>}

            <button
              onClick={handleEmailVerification}
              className="bg-purple-600 w-full rounded-lg h-11 text-white font-semibold hover:bg-purple-700 transition-colors duration-300"
            >
              Verify Email
            </button>
            
            <div className="text-center text-sm text-gray-600">
              Wrong email?{" "}
              <span
                className="text-purple-600 font-bold cursor-pointer hover:underline"
                onClick={() => setView("signup")}
              >
                Go Back
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={signUp}>
          <div className="flex flex-col gap-3 p-6">
            <div className="text-2xl font-bold text-center mb-4 text-gray-800">
              Create an Account
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2 pl-1 pb-1">
              <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <InputField label="Reg No" name="reg_no" value={formData.reg_no} onChange={handleInputChange} />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <InputField label="Contact No" name="contact_no" value={formData.contact_no} onChange={handleInputChange} />
              <InputField label="Date Of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
  Gender
</label>
<select
  id="gender"
  name="gender"
  value={formData.gender}
  onChange={handleInputChange}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:outline-0  focus:ring-2 sm:text-sm py-2.5"
>
  <option value="" disabled>Select gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>
              </div>
              
              <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} />
              <InputField label="Confirm Password" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} />
            </div>

            <div className="flex flex-col mt-1">
              <label className="mb-1 font-semibold text-gray-600">Role</label>
              <div className="flex flex-wrap gap-2">
                {roles.map(({ role, icon: Icon }) => (
                  <div key={role} onClick={() => setFormData({ ...formData, role })} className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 border-2 rounded-lg cursor-pointer transition ${formData.role === role ? "border-purple-600 bg-purple-50" : "border-gray-300"}`}>
                    <Icon size={24} className={formData.role === role ? "text-purple-600" : "text-gray-500"} />
                    <span className={`capitalize font-semibold ${formData.role === role ? "text-purple-600" : "text-gray-600"}`}>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {errMessage && <div className="border border-red-500 bg-red-50 text-red-600 px-4 py-2 rounded text-center text-sm mt-2">{errMessage}</div>}

            <div className="mt-4">
              <button type="submit" className={`${loading?'hidden':'bg-purple-500 w-full rounded-lg h-11 text-white font-semibold hover:bg-purple-800 transition-colors duration-300'}`}>
                Register
              </button>
              <button type="submit" className={`${loading ?'bg-purple-600 w-full rounded-lg h-11 text-center text-white font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center':'hidden'}`}>
                <LoaderCircle  size={24} className="animate-spin text-center"></LoaderCircle>
              </button>
            </div>

            <div className="text-center text-sm mt-2 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-bold cursor-pointer hover:underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-semibold text-gray-600">{label}</label>
    <input {...props} required className="w-full rounded-lg px-3 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" />
  </div>
);

export default RegisterPage;

