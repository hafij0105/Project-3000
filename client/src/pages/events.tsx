import { useState } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Clock, Users, Plus, Star, Bookmark } from "lucide-react";

export default function Events() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Filter out past events (unless they're featured)
  const filterEvents = (events) => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return event.isFeatured || eventDate >= now;
    });
  };

  // Mock events data with updated future dates
  const events = [
    {
      id: 1,
      title: "Tech Career Fair 2025",
      description: "Meet with top tech companies and explore career opportunities",
      date: "2025-10-25T09:00:00",
      endDate: "2025-10-25T17:00:00",
      location: "Student Center Hall A",
      organizer: "Career Services",
      attendees: 245,
      maxAttendees: 300,
      category: "Career",
      isRegistered: true,
      isFeatured: true,
      tags: ["Tech", "Career", "Networking"]
    },
    {
      id: 2,
      title: "Database Systems Final Review",
      description: "Final exam preparation session with practice problems",
      date: "2025-09-22T18:00:00",
      endDate: "2025-09-22T20:00:00",
      location: "Engineering Building Room 301",
      organizer: "Prof. Ahmed Khan",
      attendees: 45,
      maxAttendees: 60,
      category: "Academic",
      isRegistered: true,
      isFeatured: false,
      tags: ["Study", "Database", "Exam"]
    },
    {
      id: 3,
      title: "React.js Workshop",
      description: "Hands-on workshop building modern web applications",
      date: "2025-11-15T14:00:00",
      endDate: "2025-11-15T17:00:00",
      location: "Computer Lab B",
      organizer: "Web Development Club",
      attendees: 32,
      maxAttendees: 40,
      category: "Workshop",
      isRegistered: false,
      isFeatured: true,
      tags: ["React", "Web Development", "Coding"]
    },
    {
      id: 4,
      title: "Annual University Sports Day",
      description: "Inter-department sports competition and fun activities",
      date: "2025-12-05T08:00:00",
      endDate: "2025-12-05T18:00:00",
      location: "University Sports Complex",
      organizer: "Sports Committee",
      attendees: 156,
      maxAttendees: 500,
      category: "Sports",
      isRegistered: false,
      isFeatured: false,
      tags: ["Sports", "Competition", "Fun"]
    }
  ];

  const filteredEvents = filterEvents(events).filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || event.category.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <h1 className="text-2xl font-bold text-metro-dark mb-4 md:mb-0">Campus Events</h1>
                <Button className="bg-metro-green hover:bg-green-700 text-white">
                  <Plus size={16} className="mr-2" />
                  Create Event
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {["all", "academic", "career", "workshop", "sports", "social"].map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={activeFilter === filter ? "default" : "outline"}
                    onClick={() => setActiveFilter(filter)}
                    className={activeFilter === filter ? "bg-metro-green text-white" : ""}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Featured Events */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-metro-dark mb-4">Featured Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filterEvents(events).filter(event => event.isFeatured).map((event) => (
    <div 
      key={event.id} 
      className="relative overflow-hidden rounded-xl shadow-lg border border-metro-green/20 bg-white"
    >
      {/* Featured badge */}
      <div className="absolute top-4 right-4 bg-yellow-400 text-metro-dark px-2 py-1 rounded-full text-xs font-semibold flex items-center">
        <Star size={14} className="mr-1" />
        Featured
      </div>

      {/* Event content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-metro-dark mb-3">{event.title}</h3>
        <p className="text-gray-600 mb-5 line-clamp-2">{event.description}</p>
        
        {/* Event details */}
        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center text-gray-700">
            <Calendar size={16} className="mr-2 text-metro-green" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin size={16} className="mr-2 text-metro-green" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-700">
            <Users size={16} className="mr-2 text-metro-green" />
            <span className="font-medium">{event.attendees}</span>
            <span className="mx-1">/</span>
            <span>{event.maxAttendees} attending</span>
          </div>
        </div>
        
        {/* Action button */}
        <Button 
          size="sm" 
          className={`w-full ${event.isRegistered 
            ? 'bg-gray-200 text-gray-600 hover:bg-gray-200 cursor-not-allowed' 
            : 'bg-metro-green hover:bg-green-700 text-white'}`}
        >
          {event.isRegistered ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Registered
            </span>
          ) : (
            "Register Now"
          )}
        </Button>
      </div>
      
      {/* Metro green accent at bottom */}
      <div className="h-2 bg-gradient-to-r from-metro-green to-green-600"></div>
    </div>
  ))}
</div>
            </div>

            {/* All Events */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-metro-dark">All Events</h2>
              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-metro-dark mb-2">No events found</h3>
                  <p className="text-metro-muted">
                    {searchQuery ? "Try adjusting your search terms." : "Check back later for upcoming events."}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.category === "Academic" ? "bg-blue-100 text-blue-700" :
                            event.category === "Career" ? "bg-purple-100 text-purple-700" :
                            event.category === "Workshop" ? "bg-orange-100 text-orange-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {event.category}
                          </span>
                          {event.isRegistered && (
                            <span className="px-2 py-1 bg-metro-green text-white text-xs rounded-full">
                              Registered
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-metro-dark mb-2">
                          {event.title}
                        </h3>
                        
                        <p className="text-metro-muted mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-metro-muted">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2" />
                            {formatDate(event.endDate)}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-2" />
                            {event.attendees}/{event.maxAttendees} attending
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 mt-3">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                        <Button 
                          size="sm" 
                          className={event.isRegistered ? 
                            "bg-gray-400 text-white cursor-not-allowed" : 
                            "bg-metro-green hover:bg-green-700 text-white"
                          }
                          disabled={event.isRegistered}
                        >
                          {event.isRegistered ? "Registered" : "Register"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark size={14} className="mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-metro-green mb-1">
                  {filterEvents(events).filter(e => e.isRegistered).length}
                </div>
                <div className="text-sm text-metro-muted">Events Registered</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {filterEvents(events).length}
                </div>
                <div className="text-sm text-metro-muted">Upcoming Events</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {events.filter(e => {
                    const eventDate = new Date(e.date);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && 
                           eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
                <div className="text-sm text-metro-muted">Events This Month</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}