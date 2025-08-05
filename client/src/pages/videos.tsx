import { useState } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Search, Eye, ThumbsUp, Share2, MoreVertical } from "lucide-react";

export default function Videos() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Mock video data 
  const videoCategories = [
    {
      title: "Computer Science Lectures",
      videos: [
        {
          id: 1,
          title: "Introduction to Data Structures",
          mediaUrl: "assets/SQL.mp4",
          views: "2.1k",
          author: "Dr. Sarah Wilson",
          uploadDate: "2 days ago"
        },
        {
          id: 2,
          title: "React.js Fundamentals",
          mediaUrl: "assets/React.mp4",
          views: "5.8k",
          author: "Aarav Sharma",
          uploadDate: "1 week ago"
        }
      ]
    },
    {
      title: "Campus Events",
      videos: [
        {
          id: 3,
          title: "Annual Tech Fest 2024 Highlights",
          mediaUrl: "assets/JS.mp4",
          views: "12.3k",
          author: "MetroCity Media Team",
          uploadDate: "3 days ago"
        }
      ]
    }
  ];

  // Filter videos based on search query
  const filteredCategories = videoCategories.map(category => ({
    ...category,
    videos: category.videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.videos.length > 0);

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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-metro-dark mb-4">Videos</h1>

              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted"
                  size={16}
                />
              </div>
            </div>

            {/* Video Grid */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <h2 className="text-xl font-semibold text-metro-dark mb-4">{category.title}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Video Player */}
                        <video
                          className="w-full h-48 object-cover"
                          controls
                          preload="metadata"
                          src={`/${video.mediaUrl}`}
                        >
                          Your browser does not support the video tag.
                        </video>

                        {/* Video Info */}
                        <div className="p-4">
                          <h3 className="font-medium text-metro-dark mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-sm text-metro-muted mb-1">{video.author}</p>
                          <div className="flex items-center justify-between text-xs text-metro-muted">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye size={12} className="mr-1" />
                                {video.views}
                              </span>
                              <span>{video.uploadDate}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={14} />
                            </Button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" className="text-xs">
                                <ThumbsUp size={12} className="mr-1" />
                                Like
                              </Button>
                              <Button size="sm" variant="ghost" className="text-xs">
                                <Share2 size={12} className="mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-metro-muted">No videos found matching your search.</p>
              </div>
            )}

            
          </div>
        </main>
      </div>
    </div>
  );
}