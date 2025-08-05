import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { User, Settings, Key, HelpCircle, LogOut } from "lucide-react";
import { authService } from "@/lib/auth";

interface ProfileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileMenu({ onClose, onLogout }: ProfileMenuProps) {
  const [, setLocation] = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleProfileClick = () => {
    setLocation("/profile");
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed top-20 right-4 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={currentUser?.profileImage || "/api/placeholder/48/48"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-metro-dark">{currentUser?.fullName}</h3>
            <p className="text-sm text-metro-muted">{currentUser?.email}</p>
          </div>
        </div>
        
        <hr className="border-gray-200 mb-4" />
        
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3"
            onClick={handleProfileClick}
          >
            <User className="text-metro-muted" size={20} />
            <span className="text-metro-dark">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3"
            onClick={onClose}
          >
            <Settings className="text-metro-muted" size={20} />
            <span className="text-metro-dark">Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3"
            onClick={handleProfileClick}
          >
            <Key className="text-metro-muted" size={20} />
            <span className="text-metro-dark">Change Password</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3"
            onClick={onClose}
          >
            <HelpCircle className="text-metro-muted" size={20} />
            <span className="text-metro-dark">Help & Support</span>
          </Button>
        </nav>
        
        <hr className="border-gray-200 my-4" />
        
        <Button 
          variant="ghost"
          className="w-full justify-start space-x-3 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogoutClick}
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}
