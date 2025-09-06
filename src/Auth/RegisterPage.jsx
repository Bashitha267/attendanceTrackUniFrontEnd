import axios from "axios";
import { BookOpenText, ClipboardList, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [view, setView] = useState("signup"); // 'signup' or 'confirmEmail'
  const [showPassword, setShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    { role: "registrar", icon: ClipboardList },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailVerification = async () => {
    setErrMessage("");
    setSuccessMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/users/sendmail",
        { email: formData.email, otp: otp }
      );
      if (res.data.success) {
        setSuccessMessage("Verification Success! Pending Admin Approval. Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login after a short delay
        }, 5000);
      } else {
        setErrMessage(res.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrMessage(error.response?.data?.message || "An error occurred during verification.");
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
      // This single call now handles user creation and sending the OTP email
      const res = await axios.post("http://localhost:5000/users/signup", formData);
      
      if (res.data.success) {
        setView("confirmEmail");
        setSuccessMessage("Registration initiated! An OTP has been sent to your email.");
      } else {
        // Handle backend-specific errors like "Email already registered"
        setErrMessage(res.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrMessage(
        err.response?.data?.message || "An unexpected error occurred."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
              <InputField label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <InputField label="Reg No" name="reg_no" value={formData.reg_no} onChange={handleInputChange} />
              <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <InputField label="Contact No" name="contact_no" value={formData.contact_no} onChange={handleInputChange} />
              <InputField label="Date Of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
              <InputField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} />
              <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} />
              <InputField label="Confirm Password" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} />
            </div>

            <div className="flex flex-col mt-2">
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
              <button type="submit" className="bg-purple-600 w-full rounded-lg h-11 text-white font-semibold hover:bg-purple-700 transition-colors duration-300">
                Register
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

