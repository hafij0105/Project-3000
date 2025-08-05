import { useState, useRef, useEffect } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, Heart, MessageCircle, Share2, Filter, Calendar, User } from "lucide-react";

type SavedItem = {
  id: number;
  type: "post" | "video" | "document";
  title: string;
  content: string;
  author: string;
  savedDate: string;
  category: string;
  likes?: number;
  comments?: number;
  duration?: string;
  views?: string;
  size?: string;
};

export default function Saved() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "post" | "video" | "document">("all");
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const shareButtonRefs = useRef<{[key: number]: HTMLButtonElement | null}>({});

  const savedItems: SavedItem[] = [
    {
      id: 1,
      type: "post",
      title: "Advanced JavaScript Concepts",
      content: "Understanding closures, promises, and async/await patterns...",
      author: "Dr. Sarah Wilson",
      savedDate: "2024-01-15",
      likes: 45,
      comments: 12,
      category: "Educational"
    },
    {
      id: 2,
      type: "video",
      title: "Campus Tour - Engineering Building",
      content: "Complete walkthrough of the new engineering facilities...",
      author: "Campus Media",
      savedDate: "2024-01-10", 
      duration: "12:34",
      views: "2.1k",
      category: "Campus"
    },
    {
      id: 3,
      type: "document",
      title: "Database Design Guidelines.pdf",
      content: "Comprehensive guide to database normalization and design...",
      author: "Prof. Ahmed Khan",
      savedDate: "2024-01-08",
      size: "2.5 MB",
      category: "Study Material"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu !== null && 
          shareButtonRefs.current[showShareMenu] && 
          !shareButtonRefs.current[showShareMenu]?.contains(event.target as Node)) {
        setShowShareMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter: "all" | "post" | "video" | "document") => {
    setActiveFilter(filter);
  };

  const handleShareClick = (id: number) => {
    setShowShareMenu(showShareMenu === id ? null : id);
  };

  const handleWhatsAppShare = (item: SavedItem) => {
    const shareText = `${item.title}\n\n${item.content}\n\nShared via MetroCity`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    console.log("WhatsApp Share URL:", shareUrl);
    window.open(shareUrl, '_blank');
    setShowShareMenu(null);
  };

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const TypeBadge = ({ type }: { type: string }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${
      type === "post" ? "bg-blue-100 text-blue-700" :
      type === "video" ? "bg-purple-100 text-purple-700" :
      "bg-orange-100 text-orange-700"
    }`}>
      {type}
    </span>
  );

  const ItemStats = ({ item }: { item: SavedItem }) => (
    <div className="flex items-center space-x-4 text-sm text-metro-muted">
      <div className="flex items-center">
        <User size={14} className="mr-1" />
        {item.author}
      </div>
      <div className="flex items-center">
        <Calendar size={14} className="mr-1" />
        Saved {new Date(item.savedDate).toLocaleDateString()}
      </div>
      {item.type === "post" && (
        <>
          <div className="flex items-center">
            <Heart size={14} className="mr-1" />
            {item.likes} likes
          </div>
          <div className="flex items-center">
            <MessageCircle size={14} className="mr-1" />
            {item.comments} comments
          </div>
        </>
      )}
      {item.type === "video" && (
        <>
          <span>{item.duration}</span>
          <span>{item.views} views</span>
        </>
      )}
      {item.type === "document" && (
        <span>{item.size}</span>
      )}
    </div>
  );

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
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-metro-dark mb-4">Saved Items</h1>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search saved items..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
                </div>
                
                <div className="flex space-x-2">
                  {(["all", "post", "video", "document"] as const).map((filter) => (
                    <Button 
                      key={filter}
                      size="sm" 
                      variant={activeFilter === filter ? "default" : "outline"}
                      onClick={() => handleFilterChange(filter)}
                      className={activeFilter === filter ? "bg-metro-green text-white" : ""}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Bookmark className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-metro-dark mb-2">No saved items found</h3>
                  <p className="text-metro-muted">
                    {searchQuery ? "Try adjusting your search terms." : "Start saving posts, videos, and documents to see them here."}
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <TypeBadge type={item.type} />
                          <span className="text-xs text-metro-muted">{item.category}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-metro-dark mb-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-metro-muted mb-3 line-clamp-2">
                          {item.content}
                        </p>
                        
                        <ItemStats item={item} />
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="relative">
                          <Button 
                            ref={el => shareButtonRefs.current[item.id] = el}
                            size="sm" 
                            variant="outline"
                            onClick={() => handleShareClick(item.id)}
                          >
                            <Share2 size={14} className="mr-1" />
                            Share
                          </Button>

                          {showShareMenu === item.id && (
                            <div 
                              className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                                onClick={() => handleWhatsAppShare(item)}
                              >
                                <span className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:fill-[#128c7e] mr-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512"
                                  >
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                  </svg>
                                </span>
                                Whatsapp
                              </button>
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Bookmark size={14} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            
          </div>
        </main>
      </div>
    </div>
  );
}