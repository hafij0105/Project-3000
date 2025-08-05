import { useState } from "react";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Clock, Users, Star, Play, FileText, Calendar, Award } from "lucide-react";

const gradeToGpa = (grade: string) => {
  const map: { [key: string]: number } = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0,
  };
  return map[grade] ?? 0;
};

const gpaToGrade = (gpa: number) => {
  if (gpa >= 3.85) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.15) return "B+";
  if (gpa >= 2.85) return "B";
  if (gpa >= 2.5) return "B-";
  if (gpa >= 2.15) return "C+";
  if (gpa >= 1.85) return "C";
  if (gpa >= 1.5) return "C-";
  if (gpa >= 1.15) return "D+";
  if (gpa >= 0.85) return "D";
  return "F";
};

export default function Courses() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("enrolled");

  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 1,
      title: "Database Systems",
      code: "CS-301",
      instructor: "Prof. Ahmed Khan",
      progress: 75,
      nextClass: "2024-01-20T10:00:00",
      totalLessons: 24,
      completedLessons: 18,
      assignment: "ER Diagram Design",
      assignmentDue: "2024-01-25",
      grade: "A-",
    },
    {
      id: 2,
      title: "Web Development",
      code: "CS-205",
      instructor: "Dr. Sarah Wilson",
      progress: 60,
      nextClass: "2024-01-21T14:00:00",
      totalLessons: 20,
      completedLessons: 12,
      assignment: "React Portfolio Project",
      assignmentDue: "2024-01-30",
      grade: "B+",
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      code: "CS-202",
      instructor: "Dr. Michael Chen",
      progress: 85,
      nextClass: "2024-01-22T09:00:00",
      totalLessons: 16,
      completedLessons: 14,
      assignment: "Binary Tree Implementation",
      assignmentDue: "2024-01-28",
      grade: "A",
    },
  ]);

  const [availableCourses, setAvailableCourses] = useState([
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      code: "CS-401",
      instructor: "Dr. Lisa Park",
      duration: "12 weeks",
      students: 89,
      rating: 4.8,
      level: "Advanced",
      price: "Free",
      description: "Introduction to machine learning algorithms and applications",
    },
    {
      id: 5,
      title: "Mobile App Development",
      code: "CS-305",
      instructor: "Prof. James Rodriguez",
      duration: "10 weeks",
      students: 156,
      rating: 4.6,
      level: "Intermediate",
      price: "Free",
      description: "Build native mobile applications for iOS and Android",
    },
  ]);

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Calculate average GPA and grade for enrolled courses
  const averageGpa =
    enrolledCourses.length > 0
      ? enrolledCourses.reduce((acc, course) => acc + gradeToGpa(course.grade), 0) / enrolledCourses.length
      : 0;
  const averageGrade = gpaToGrade(averageGpa);

  const handleIncreaseProgress = (id: number) => {
    setEnrolledCourses((prev) =>
      prev.map((course) => {
        if (course.id === id) {
          const newProgress = Math.min(course.progress + 5, 100);
          const newCompletedLessons = Math.min(course.completedLessons + 1, course.totalLessons);
          return { ...course, progress: newProgress, completedLessons: newCompletedLessons };
        }
        return course;
      }),
    );
  };

  const handleGradeChange = (id: number, newGrade: string) => {
    setEnrolledCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, grade: newGrade } : course)),
    );
  };

  const handleUnenroll = (id: number) => {
    setEnrolledCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const handleEnroll = (course) => {
    setEnrolledCourses((prev) => [...prev, { ...course, progress: 0, completedLessons: 0, grade: "F" }]);
    setAvailableCourses((prev) => prev.filter((c) => c.id !== course.id));
  };

  return (
    <div className="min-h-screen bg-metro-gray">
      <TopNavigation onToggleMobileSidebar={toggleMobileSidebar} />

      <div className="max-w-7xl mx-auto flex">
        <Sidebar />

        {showMobileSidebar && (
          <Sidebar isMobile isOpen={showMobileSidebar} onClose={() => setShowMobileSidebar(false)} />
        )}

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-metro-dark mb-4">My Courses</h1>

              {/* Average Grade Display */}
              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center space-x-1 text-green-600">
                  <Star size={24} />
                  <span className="text-xl font-semibold">{averageGrade}</span>
                </div>
                <div className="text-metro-muted">
                  Average GPA: <span className="font-semibold">{averageGpa.toFixed(2)}</span>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search courses..."
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
                  variant={activeTab === "enrolled" ? "default" : "ghost"}
                  onClick={() => setActiveTab("enrolled")}
                  className={`flex-1 ${activeTab === "enrolled" ? "bg-white shadow-sm" : ""}`}
                >
                  Enrolled ({enrolledCourses.length})
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "browse" ? "default" : "ghost"}
                  onClick={() => setActiveTab("browse")}
                  className={`flex-1 ${activeTab === "browse" ? "bg-white shadow-sm" : ""}`}
                >
                  Browse Courses
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "completed" ? "default" : "ghost"}
                  onClick={() => setActiveTab("completed")}
                  className={`flex-1 ${activeTab === "completed" ? "bg-white shadow-sm" : ""}`}
                >
                  Completed
                </Button>
              </div>
            </div>

            {/* Enrolled Courses Tab */}
            {activeTab === "enrolled" && (
              <div className="space-y-6">
                {enrolledCourses
                  .filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 bg-metro-green text-white text-xs rounded-full">
                              {course.code}
                            </span>
                            <span className="text-sm text-metro-muted">
                              Current Grade:{" "}
                              <select
                                className="ml-1 bg-transparent border-b border-metro-muted text-metro-dark font-medium text-sm outline-none"
                                value={course.grade}
                                onChange={(e) => handleGradeChange(course.id, e.target.value)}
                              >
                                {[
                                  "A+",
                                  "A",
                                  "A-",
                                  "B+",
                                  "B",
                                  "B-",
                                  "C+",
                                  "C",
                                  "C-",
                                  "D+",
                                  "D",
                                  "F",
                                ].map((grade) => (
                                  <option key={grade} value={grade}>
                                    {grade}
                                  </option>
                                ))}
                              </select>
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold text-metro-dark mb-2">{course.title}</h3>

                          <p className="text-metro-muted mb-3">{course.instructor}</p>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-metro-muted mb-1">
                              <span>Progress</span>
                              <span>
                                {course.completedLessons}/{course.totalLessons} lessons
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-metro-green h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-metro-muted">
                              <Calendar size={14} className="mr-2" />
                              Next: {new Date(course.nextClass).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-metro-muted">
                              <FileText size={14} className="mr-2" />
                              Due: {course.assignment}
                            </div>
                            <div className="flex items-center text-metro-muted">
                              <Clock size={14} className="mr-2" />
                              {course.assignmentDue}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                          <Button
                            size="xs"
                            className="bg-metro-green hover:bg-green-700 text-white px-2 py-1 text-xs"
                            onClick={() => handleIncreaseProgress(course.id)}
                            disabled={course.progress >= 100}
                          >
                            + Progress
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-xs px-2 py-1"
                            onClick={() => handleUnenroll(course.id)}
                          >
                            Unenroll
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Browse Courses Tab */}
            {activeTab === "browse" && (
              <div className="space-y-6">
                {/* Course Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                  {["All", "Computer Science", "Mathematics", "Physics", "Engineering", "Business"].map(
                    (category) => (
                      <Button
                        key={category}
                        variant={category === "All" ? "default" : "outline"}
                        size="sm"
                        className={category === "All" ? "bg-metro-green text-white" : ""}
                      >
                        {category}
                      </Button>
                    ),
                  )}
                </div>

                {/* Available Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableCourses
                    .filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((course) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-metro-dark text-xs rounded-full">
                                {course.code}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {course.level}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold text-metro-dark mb-2">{course.title}</h3>

                            <p className="text-metro-muted text-sm mb-3">{course.description}</p>

                            <div className="space-y-2 text-sm text-metro-muted">
                              <div className="flex items-center">
                                <BookOpen size={14} className="mr-2" />
                                {course.instructor}
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-2" />
                                {course.duration}
                              </div>
                              <div className="flex items-center">
                                <Users size={14} className="mr-2" />
                                {course.students} students enrolled
                              </div>
                              <div className="flex items-center">
                                <Star size={14} className="mr-2 text-yellow-400" />
                                {course.rating} ({Math.floor(course.students * 0.8)} reviews)
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-metro-green mb-2">{course.price}</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-metro-green hover:bg-green-700 text-white"
                            onClick={() => handleEnroll(course)}
                          >
                            Enroll Now
                          </Button>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Completed Courses Tab */}
            {activeTab === "completed" && (
              <div className="text-center py-12">
                <Award className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-metro-dark mb-2">No Completed Courses Yet</h3>
                <p className="text-metro-muted mb-6">Complete your enrolled courses to see your achievements here.</p>
                <Button
                  onClick={() => setActiveTab("enrolled")}
                  className="bg-metro-green hover:bg-green-700 text-white"
                >
                  View Current Courses
                </Button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-metro-green mb-1">{enrolledCourses.length}</div>
                <div className="text-sm text-metro-muted">Courses Enrolled</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round(
                    enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / (enrolledCourses.length || 1),
                  )}
                  %
                </div>
                <div className="text-sm text-metro-muted">Average Progress</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
                </div>
                <div className="text-sm text-metro-muted">Lessons Completed</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{averageGrade}</div>
                <div className="text-sm text-metro-muted">Average Grade</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
