import {
    BarChart3,
    BookOpen,
    Calendar,
    ClipboardList,
    PlusCircle,
    QrCode,
    Settings,
    User,
    UserPlus,
    Users
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

const Sidebar=({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'subjects', label: 'My Subjects', icon: BookOpen },
          { id: 'attendance', label: 'Attendance', icon: BarChart3 },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'teacher':
        return [
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: BarChart3 },
          { id: 'add-course', label: 'Add Course', icon: PlusCircle },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'add-teacher', label: 'Add Teacher', icon: UserPlus },
          { id: 'courses', label: 'All Courses', icon: BookOpen },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'registrar':
        return [
          { id: 'mark-register', label: 'Mark Register', icon: ClipboardList },
          { id: 'attendance', label: 'Attendance Records', icon: BarChart3 },
          { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-sm border-r-2 border-red-100">
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;