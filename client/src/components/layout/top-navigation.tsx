import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, UsersRound, MessageCircle, Bell, Menu, ChevronDown, Home } from "lucide-react";
import { authService } from "@/lib/auth";
import NotificationOverlay from "@/components/overlays/notification-overlay";
import ChatOverlay from "@/components/overlays/chat-overlay";
import ProfileMenu from "@/components/overlays/profile-menu";

interface TopNavigationProps {
  onToggleMobileSidebar: () => void;
}

export default function TopNavigation({ onToggleMobileSidebar }: TopNavigationProps) {
  const [, setLocation] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    setLocation("/login");
  };

  const closeAllOverlays = () => {
    setShowNotifications(false);
    setShowChat(false);
    setShowProfileMenu(false);
  };

  const toggleNotifications = () => {
    closeAllOverlays();
    setShowNotifications(!showNotifications);
  };

  const toggleChat = () => {
    closeAllOverlays();
    setShowChat(!showChat);
  };

  const toggleProfileMenu = () => {
    closeAllOverlays();
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={onToggleMobileSidebar}
              >
                <Menu className="text-metro-dark" />
              </Button>
              
              {/* Logo */}
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setLocation("/")}>
                <div className="w-8 h-8 bg-metro-green rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold text-metro-dark hidden sm:block">MetroCity</span>
              </div>
            </div>
            
            {/* Center Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for friends, posts, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-100 rounded-full focus:ring-2 focus:ring-metro-green focus:bg-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Navigation Links (Desktop) */}
              <div className="hidden lg:flex items-center space-x-6">
                <button 
                  className="text-metro-dark hover:text-metro-green transition"
                  onClick={() => setLocation("/")}
                >
                  <Home className="text-metro-muted" size={20} />
                </button>
                
              </div>
              
              
              <div className="flex items-center space-x-2">
                {/* Messages */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={toggleChat}
                >
                  <MessageCircle className="text-metro-muted" size={20} />
                  
                </Button>
                
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={toggleNotifications}
                >
                  <Bell className="text-metro-muted" size={20} />
                  
                </Button>
              </div>
              
              {/* Profile Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-1"
                  onClick={toggleProfileMenu}
                >
                  <img 
                    src={currentUser?.profileImage || "/api/placeholder/32/32"}
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <ChevronDown className="text-metro-muted text-sm hidden sm:block" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlays */}
      {showNotifications && <NotificationOverlay onClose={closeAllOverlays} />}
      {showChat && <ChatOverlay onClose={closeAllOverlays} />}
      {showProfileMenu && <ProfileMenu onClose={closeAllOverlays} onLogout={handleLogout} />}
    </>
  );
}
