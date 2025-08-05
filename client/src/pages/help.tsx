import { useState } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, MessageCircle, Mail, Phone, Book, Video, FileText, Users, ExternalLink } from "lucide-react";

export default function Help() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // FAQ categories and items
  const faqCategories = [
    {
      id: "account",
      name: "Account & Login",
      icon: Users,
      items: [
        {
          question: "How do I reset my password?",
          answer: "Contact your system administrator or use the 'Forgot Password' link on the login page. You'll need your student ID and email address to verify your identity."
        },
        {
          question: "Why can't I log in with my credentials?",
          answer: "Make sure you're using your correct username and student ID. The password is case-sensitive. If you're still having trouble, contact technical support."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your profile page by clicking your profile picture in the top navigation, then click 'Edit Profile' to update your information."
        }
      ]
    },
    {
      id: "posting",
      name: "Posts & Content",
      icon: FileText,
      items: [
        {
          question: "What file types can I upload in posts?",
          answer: "You can upload images (JPG, PNG, GIF), videos (MP4, MOV), and documents (PDF). Each file must be under 10MB."
        },
        {
          question: "How do I edit or delete my posts?",
          answer: "Click the three dots menu on your post to access edit and delete options. You can only edit posts within 24 hours of posting."
        },
        {
          question: "Can I save posts from other users?",
          answer: "Yes! Click the bookmark icon on any post to save it to your 'Saved' section for easy access later."
        }
      ]
    },
    {
      id: "courses",
      name: "Courses & Learning",
      icon: Book,
      items: [
        {
          question: "How do I enroll in a new course?",
          answer: "Go to the Courses section, browse available courses, and click 'Enroll Now' on the course you want to join. Some courses may require prerequisites."
        },
        {
          question: "Where can I see my course progress?",
          answer: "Your course progress is available in both the Courses section and the Progress dashboard. You can track completed lessons, assignments, and grades."
        },
        {
          question: "How do I access course materials?",
          answer: "All course materials including videos, documents, and assignments are available in the respective course page. Click 'Continue' to access the latest content."
        }
      ]
    },
    {
      id: "social",
      name: "Friends & Groups",
      icon: Users,
      items: [
        {
          question: "How do I add friends?",
          answer: "Go to the Friends section, search for users by name or username, and click 'Add Friend'. You can also add friends from their profile pages."
        },
        {
          question: "How do I join study groups?",
          answer: "Visit the Groups section to browse available study groups. You can join public groups directly or request to join private groups."
        },
        {
          question: "Can I create my own group?",
          answer: "Yes! Click 'Create Group' in the Groups section. You can set it as public or private and invite specific members."
        }
      ]
    }
  ];

  // Contact information
  const contactOptions = [
    {
      title: "Technical Support",
      description: "For login issues, bugs, or technical problems",
      icon: MessageCircle,
      contact: "support@metrocity.edu",
      hours: "24/7 Online Support"
    },
    {
      title: "Academic Support",
      description: "Course-related questions and learning assistance",
      icon: Book,
      contact: "academic@metrocity.edu",
      hours: "Mon-Fri, 9 AM - 5 PM"
    },
    {
      title: "Student Services",
      description: "General inquiries and student affairs",
      icon: Phone,
      contact: "(555) 123-4567",
      hours: "Mon-Fri, 8 AM - 6 PM"
    }
  ];

  // Quick links
  const quickLinks = [
    { title: "User Guide", description: "Complete platform tutorial", icon: Book, url: "#" },
    { title: "Video Tutorials", description: "Step-by-step video guides", icon: Video, url: "#" },
    { title: "System Status", description: "Check platform status", icon: ExternalLink, url: "#" },
    { title: "Feature Requests", description: "Suggest new features", icon: HelpCircle, url: "#" }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqCategories.filter(category => {
    if (selectedCategory !== "all" && category.id !== selectedCategory) return false;
    if (!searchQuery) return true;
    
    return category.items.some(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
              <h1 className="text-2xl font-bold text-metro-dark mb-4">Help Center</h1>
              
              {/* Search */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={selectedCategory === "all" ? "bg-metro-green text-white" : ""}
                >
                  All Topics
                </Button>
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-metro-green text-white" : ""}
                  >
                    <category.icon size={14} className="mr-1" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {quickLinks.map((link, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-metro-green bg-opacity-10 rounded-lg flex items-center justify-center">
                      <link.icon className="text-metro-green" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-metro-dark">{link.title}</h3>
                      <p className="text-sm text-metro-muted">{link.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              {filteredFAQs.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-metro-green bg-opacity-10 rounded-lg flex items-center justify-center">
                      <category.icon className="text-metro-green" size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-metro-dark">{category.name}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h3 className="font-medium text-metro-dark mb-2 flex items-center">
                          <HelpCircle size={16} className="mr-2 text-metro-green" />
                          {item.question}
                        </h3>
                        <p className="text-metro-muted ml-6">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-metro-dark mb-4">Need More Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactOptions.map((option, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-metro-green bg-opacity-10 rounded-full flex items-center justify-center">
                      <option.icon className="text-metro-green" size={24} />
                    </div>
                    <h3 className="font-medium text-metro-dark mb-2">{option.title}</h3>
                    <p className="text-sm text-metro-muted mb-3">{option.description}</p>
                    <p className="font-medium text-metro-dark text-sm mb-2">{option.contact}</p>
                    <p className="text-xs text-metro-muted">{option.hours}</p>
                    <Button size="sm" className="mt-3 bg-metro-green hover:bg-green-700 text-white">
                      Contact
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-metro-dark mb-3">💡 Getting Started Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-metro-muted">
                <div>
                  <h4 className="font-medium text-metro-dark mb-2">New to MetroCity?</h4>
                  <ul className="space-y-1">
                    <li>• Complete your profile setup</li>
                    <li>• Add friends and join groups</li>
                    <li>• Explore available courses</li>
                    <li>• Set up your study schedule</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-metro-dark mb-2">Best Practices:</h4>
                  <ul className="space-y-1">
                    <li>• Keep your profile information updated</li>
                    <li>• Use appropriate content in posts</li>
                    <li>• Participate in group discussions</li>
                    <li>• Check notifications regularly</li>
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