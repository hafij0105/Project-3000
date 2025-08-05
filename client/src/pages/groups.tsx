import { useState } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus, MessageCircle, Settings, Crown, Star } from "lucide-react";

export default function Groups() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("joined");

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Mock groups data
  const myGroups = [
    {
      id: 1,
      name: "Computer Science Students",
      description: "Official group for CS department students",
      members: 245,
      avatar: "assets/1.jpg",
      isAdmin: false,
      lastActivity: "2 hours ago",
      unreadMessages: 5,
      category: "Academic"
    },
    {
      id: 2,
      name: "React Developers",
      description: "Sharing React tips, projects, and learning resources",
      members: 89,
      avatar: "/api/placeholder/64/64", 
      isAdmin: true,
      lastActivity: "30 minutes ago",
      unreadMessages: 12,
      category: "Technology"
    },
    {
      id: 3,
      name: "Study Group - Database Systems",
      description: "Preparing for Database Systems final exam",
      members: 15,
      avatar: "/api/placeholder/64/64",
      isAdmin: false,
      lastActivity: "1 day ago",
      unreadMessages: 0,
      category: "Study Group"
    }
  ];

  const suggestedGroups = [
    {
      id: 4,
      name: "Web Development Club",
      description: "Learn and build web applications together",
      members: 156,
      avatar: "/api/placeholder/64/64",
      category: "Technology"
    },
    {
      id: 5,
      name: "Programming Contest Team",
      description: "Competitive programming practice and contests",
      members: 67,
      avatar: "/api/placeholder/64/64",
      category: "Competition"
    }
  ];

  return (
    <div className="min-h-screen bg-metro-gray">
      <TopNavigation onToggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        {showMobileSidebar && (
          <Sidebar 
            isMobile 
            isOpen={showMobileSidebar} 
            onClose={() => setShowMobileSidebar(false)} 
          />
        )}
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-metro-dark mb-4 md:mb-0">Groups</h1>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button 
                  size="sm" 
                  variant={activeTab === "joined" ? "default" : "ghost"}
                  onClick={() => setActiveTab("joined")}
                  className={`flex-1 ${activeTab === "joined" ? "bg-white shadow-sm" : ""}`}
                >
                  My Groups ({myGroups.length})
                </Button>
                <Button 
                  size="sm" 
                  variant={activeTab === "discover" ? "default" : "ghost"}
                  onClick={() => setActiveTab("discover")}
                  className={`flex-1 ${activeTab === "discover" ? "bg-white shadow-sm" : ""}`}
                >
                  Discover
                </Button>
              </div>
            </div>

            {/* My Groups Tab */}
            {activeTab === "joined" && (
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img 
                          src={group.avatar} 
                          alt={group.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        {group.isAdmin && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                            <Crown size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-metro-dark mb-1">
                              {group.name}
                            </h3>
                            <p className="text-metro-muted text-sm mb-2 line-clamp-2">
                              {group.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-metro-muted">
                              <div className="flex items-center">
                                <Users size={14} className="mr-1" />
                                {group.members} members
                              </div>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {group.category}
                              </span>
                              <span>Active {group.lastActivity}</span>
                            </div>
                          </div>
                          
                          
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4">
                          <Button size="sm" className="bg-metro-green hover:bg-green-700 text-white">
                            <MessageCircle size={14} className="mr-1" />
                            Open Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {group.isAdmin && (
                            <Button size="sm" variant="outline">
                              <Settings size={14} className="mr-1" />
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Discover Tab */}
            {activeTab === "discover" && (
              <div className="space-y-6">
                {/* Suggested Groups */}
                <div>
                  <h2 className="text-lg font-semibold text-metro-dark mb-4">Suggested for You</h2>
                  <div className="space-y-4">
                    {suggestedGroups.map((group) => (
                      <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={group.avatar} 
                            alt={group.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-metro-dark mb-1">
                                  {group.name}
                                </h3>
                                <p className="text-metro-muted text-sm mb-2 line-clamp-2">
                                  {group.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-metro-muted">
                                  <div className="flex items-center">
                                    <Users size={14} className="mr-1" />
                                    {group.members} members
                                  </div>
                                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {group.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-4">
                              <Button size="sm" className="bg-metro-green hover:bg-green-700 text-white">
                                Join Group
                              </Button>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <h2 className="text-lg font-semibold text-metro-dark mb-4">Browse by Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Academic", "Technology", "Study Groups", "Sports", "Arts", "Science", "Language", "Career"].map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center hover:bg-metro-green hover:text-white transition-colors"
                      >
                        <Star size={20} className="mb-2" />
                        <span className="text-sm">{category}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-metro-dark mb-3">💡 Group Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-metro-muted">
                <div>
                  <h4 className="font-medium text-metro-dark mb-2">For Members:</h4>
                  <ul className="space-y-1">
                    <li>• Real-time group messaging</li>
                    <li>• Share files and resources</li>
                    <li>• Event notifications</li>
                    <li>• Study collaboration tools</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-metro-dark mb-2">For Admins:</h4>
                  <ul className="space-y-1">
                    <li>• Manage member permissions</li>
                    <li>• Create group events</li>
                    <li>• Moderate discussions</li>
                    <li>• Analytics and insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}