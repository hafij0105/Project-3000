import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import PostCreator from "@/components/feed/post-creator";
import PostCard from "@/components/feed/post-card";
import { Post, User } from "@shared/schema";
import { Cake } from "lucide-react";

export default function Home() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const { data: posts, isLoading } = useQuery<(Post & { user: User })[]>({
    queryKey: ["/api/posts"]
  });

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

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
        
        {/* Main Feed */}
        <main className="flex-1 p-4 md:p-6">
          <PostCreator />
          
          {/* Feed Posts */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metro-green"></div>
              </div>
            ) : (
              posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>
        
        {/* Right Sidebar */}
        <aside className="w-60 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16 hidden lg:block overflow-y-auto">
          <div className="p-6">
            
            {/* Birthday Reminder */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Cake className="text-pink-500" size={24} />
                <div>
                  <h3 className="font-semibold text-metro-dark">Birthdays Today</h3>
                  <p className="text-sm text-metro-muted">
                    It's <span className="font-medium">Aarav</span> and <span className="font-medium">Farhan's</span> birthday today! 🎉
                  </p>
                </div>
              </div>
            </div>
            
            {/* Campus Events */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-metro-dark text-sm">Campus Events</h3>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
                alt="University campus event"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-metro-dark mb-1">Tech Symposium 2024</h4>
                <p className="text-sm text-metro-muted">Join us for the annual technology symposium featuring industry leaders.</p>
              </div>
            </div>
            
            {/* Online Friends */}
            <div>
              <h3 className="font-semibold text-metro-dark mb-4">Online Friends</h3>
              <div className="space-y-3">
                {[
                  { name: "Alom", image: "assets/6.jpg" },
                  { name: "Farhan Ahmed", image: "assets/9.jpg" },
                  { name: "Aarav Sharma", image: "assets/10.jpg" }
                ].map((friend, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={friend.image}
                        alt={friend.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full online-indicator"></div>
                    </div>
                    <span className="text-sm text-metro-dark">{friend.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
