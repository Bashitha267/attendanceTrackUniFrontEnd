import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

// interface HeaderProps {
//   title: string;
// }

const Header = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#9810FA]">Attendoo</div>
            {/* <div className="ml-8 text-lg font-medium text-gray-800">{title}</div> */}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-red-600 transition-colors">
              <Bell size={24}  color='#9810FA'/>
            </button>
            
            <div className="flex items-center space-x-2">
              <img
                src={user?.img || 'https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover "
              />
              {/* <User size={24} color='black'></User> */}
              {/* <span className="text-sm font-medium text-gray-700">{user?.name}</span> */}
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={24} color='#9810FA' />
              
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;