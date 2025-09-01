import AdminDashboard from './Admin/Admin';
import LoginPage from './Auth/LoginPage';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Header from './Layout/Header';
import RegistrarDashboard from './Registrar/Registrar';
import StudentDashboard from './Student/Student';
import TeacherDashboard from './Teacher/Teacher';

const AppContent=() => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'registrar':
      return <RegistrarDashboard />;
    default:
      return <LoginPage />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Header title=''/>
      <AppContent />
    </AuthProvider>
  );
}

export default App;