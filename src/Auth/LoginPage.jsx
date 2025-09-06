import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading, error } = useAuth(); 
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // The login function from AuthContext will handle the state update.
    // The routing logic in App.jsx will automatically redirect upon successful login.
    navigate('/')
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSignIn}>
          <div className="flex flex-col gap-4 p-8">
            <div className="text-2xl font-bold text-center mb-4 text-gray-800">
              Welcome Back
            </div>

            

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 border-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-2 px-3 border-gray-300 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />
            </div>
    {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded relative text-center" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500"/> 
                Remember Me
              </label>
              <a href="#" className="text-purple-600 hover:underline">Forgot password?</a>
            </div>

            <div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-purple-600 w-full rounded-lg h-11 text-white font-semibold hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 font-bold cursor-pointer hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
