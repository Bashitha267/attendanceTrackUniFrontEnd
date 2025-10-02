import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

// interface HeaderProps {
//   title: string;
// }

const Header = ({ title,requests }) => {
  const { user, logout } = useAuth();
   const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.error("User not found in localStorage.");
      return;
    }

    try {
      const userProfile = JSON.parse(storedUser);
      setProfileData(userProfile);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);
  console.log(requests)
  return (
    <header className="bg-white shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#9810FA]">Attendoo</div>
            {/* <div className="ml-8 text-lg font-medium text-gray-800">{title}</div> */}
          </div>
          
          <div className="flex items-center space-x-4">
             {/* {profileData.role && profileData.role ==="admin" ? <button className="text-gray-500 hover:text-red-600 transition-colors ">
             
              <Bell size={24}  color='#9810FA' className='transition-transform duration-100'/>
              <span className={`absolute top-0 w-3 h-3 translate-y-4  -translate-x-0  rounded-full ${requests>0 ? 'bg-purple-600':'hidden'}`}></span>
            </button> :"" }
            */}
            
            <div className="flex items-center space-x-2">
              <img
                src={profileData?.avatar || ''}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover "
              />
              {/* <User size={24} color='black'></User> */}
              <span className="text-sm font-medium text-purple-700 lg:mx-4">{profileData?.reg_no}</span>
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