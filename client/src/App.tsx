import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Friends from "@/pages/friends";
import Videos from "@/pages/videos";
import Saved from "@/pages/saved";
import Groups from "@/pages/groups";
import Courses from "@/pages/courses";
import Events from "@/pages/events";
import Progress from "@/pages/progress";
import Help from "@/pages/help";
import { authService } from "@/lib/auth";
import { useEffect, useState } from "react";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const interval = setInterval(checkAuth, 100);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metro-green"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/friends" component={Friends} />
          <Route path="/videos" component={Videos} />
          <Route path="/saved" component={Saved} />
          <Route path="/groups" component={Groups} />
          <Route path="/courses" component={Courses} />
          <Route path="/events" component={Events} />
          <Route path="/progress" component={Progress} />
          <Route path="/help" component={Help} />
          <Route path="/profile" component={Profile} />
        </>
      ) : (
        <Route path="/" component={Login} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
