import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { authService } from "@/lib/auth";
import { MessageCircle, UserPlus, Search } from "lucide-react";

export default function Friends() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = authService.getCurrentUser();

  const { data: friends, isLoading } = useQuery<User[]>({
    queryKey: ["/api/friends", currentUser?.id],
    enabled: !!currentUser?.id
  });

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const filteredFriends = friends?.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-metro-gray">
      <TopNavigation onToggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <Sidebar 
            isMobile 
            isOpen={showMobileSidebar} 
            onClose={() => setShowMobileSidebar(false)} 
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-metro-dark mb-4">Friends</h1>
              
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>
            </div>

            {/* Friends List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-metro-dark mb-4">
                My Friends ({friends?.length || 0})
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metro-green"></div>
                </div>
              ) : filteredFriends?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-metro-muted">
                    {searchQuery ? "No friends found matching your search." : "You don't have any friends yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFriends?.map((friend) => (
                    <div key={friend.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3 mb-3">
                        <img 
                          src={friend.profileImage || "/api/placeholder/48/48"}
                          alt={friend.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-metro-dark truncate">
                            {friend.fullName}
                          </h3>
                          <p className="text-sm text-metro-muted truncate">
                            @{friend.username}
                          </p>
                          <p className="text-sm text-metro-muted truncate">
                            {friend.course}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-metro-green hover:bg-green-700 text-white"
                        >
                          <MessageCircle size={14} className="mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-metro-green text-metro-green hover:bg-metro-green hover:text-white"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Friend Suggestions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-metro-dark mb-4">
                People You May Know
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Example suggestions - you can enhance this with actual suggestions */}
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      JS
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-metro-dark truncate">
                        John Smith
                      </h3>
                      <p className="text-sm text-metro-muted truncate">
                        Computer Science
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-metro-green hover:bg-green-700 text-white"
                    >
                      <UserPlus size={14} className="mr-1" />
                      Add Friend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}