import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { LoginRequest } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    studentId: "", 
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      authService.setCurrentUser(data.user);
      toast({
        title: "Login successful!",
        description: "Welcome back to MetroCity"
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid username, student ID or password",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-metro-green to-metro-green-light flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-metro-green p-8 flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">MetroCity</h1>
          <p className="text-xl text-green-100 mb-8">Connect with your friends and Metropolitan Community in MetroCity.</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="text-2xl" />
              <span>Join your academic community</span>
            </div>
            <div className="flex items-center space-x-3">
              <GraduationCap className="text-2xl" />
              <span>Share academic resources</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="text-2xl" />
              <span>Connect with classmates</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-metro-dark mb-6">Sign In to Your Account</h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="block text-sm font-medium text-metro-text mb-2">Username</Label>
                <Input 
                  type="text" 
                  placeholder="Hafij"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                  className="focus:ring-metro-green focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-metro-text mb-2">Student ID</Label>
                <Input 
                  type="text" 
                  placeholder="115002"
                  value={formData.studentId}
                  onChange={handleInputChange("studentId")}
                  className="focus:ring-metro-green focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-metro-text mb-2">Password</Label>
                <Input 
                  type="password" 
                  placeholder="1234"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className="focus:ring-metro-green focus:border-transparent"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-metro-green hover:bg-metro-green-light"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Log In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button className="text-metro-green hover:underline text-sm">
                Forgot Password?
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-metro-muted mb-4">Don't have an account?</p>
              <Button 
                variant="outline"
                onClick={() => setLocation("/register")}
                className="border-metro-green text-metro-green hover:bg-metro-green hover:text-white"
              >
                Create New Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
