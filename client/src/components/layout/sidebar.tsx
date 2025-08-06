import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users,
  Video,
  Bookmark,
  Users as Groups,
  GraduationCap,
  Calendar,
  TrendingUp,
  HelpCircle,
  X 
} from "lucide-react";
import { authService } from "@/lib/auth";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const [location] = useLocation();
  const currentUser = authService.getCurrentUser();

  const sidebarClasses = isMobile 
    ? `fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "" : "hidden"}`
    : "w-64 bg-gradient-to-b from-green-600 to-green-700 shadow-xl h-screen sticky top-0 hidden md:block";

  const contentClasses = isMobile
    ? "w-64 bg-gradient-to-b from-green-600 to-green-700 h-full shadow-lg"
    : "";

  return (
    <aside className={sidebarClasses}>
      <div className={`${contentClasses} flex flex-col h-full overflow-y-auto`}>
        {/* Header */}
        <div className="p-6 border-b border-green-500 border-opacity-30">
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="text-white" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MetroCity</h1>
              <p className="text-green-200 text-sm">Social Network</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-green-500 border-opacity-30">
          <div className="flex items-center space-x-3">
            <img 
              src={currentUser?.profileImage || "/api/placeholder/40/40"}
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h3 className="font-semibold text-white">{currentUser?.fullName}</h3>
              <p className="text-green-200 text-sm">{currentUser?.course}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 space-y-1  py-4">
          <Link
            href="/"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <Home size={20} />
            <span className="font-medium">Feed</span>
          </Link>
          
          <Link
            href="/friends"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/friends" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <Users size={20} />
            <span className="font-medium">Friends</span>
          </Link>

          <Link
            href="/videos"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/videos" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <Video size={20} />
            <span className="font-medium">Videos</span>
          </Link>

          <Link
            href="/saved"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/saved" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <Bookmark size={20} />
            <span className="font-medium">Saved</span>
          </Link>

          

          <Link
            href="/events"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/events" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            
            <Calendar size={20} />
            <span className="font-medium">Events</span>
          </Link>

          <Link
            href="/progress"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/progress" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Progress</span>
          </Link>

          <Link
            href="/help"
            className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
              location === "/help" 
                ? "bg-white bg-opacity-15 text-white shadow-lg" 
                : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
            onClick={isMobile && onClose ? onClose : undefined}
          >
            <HelpCircle size={20} />
            <span className="font-medium">Help</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-green-500 border-opacity-30">
          <p className="text-green-200 text-xs text-center">
            © 2025 Metropolitan University
          </p>
        </div>
      </div>
    </aside>
  );
}
