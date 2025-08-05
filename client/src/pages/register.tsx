import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertUser } from "@shared/schema";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    birthday: "",
    email: "",
    username: "",
    password: "1234" // Default password
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration submitted!",
        description: data.message
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-metro-green to-metro-green-light flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-metro-dark mb-2">Join MetroCity</h1>
          <p className="text-metro-muted">Request access to your academic community</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-metro-text mb-2">Full Name</Label>
              <Input 
                type="text" 
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
                className="focus:ring-metro-green focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-metro-text mb-2">Student ID</Label>
              <Input 
                type="text" 
                placeholder="Enter your student ID"
                value={formData.studentId}
                onChange={handleInputChange("studentId")}
                className="focus:ring-metro-green focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-metro-text mb-2">Username</Label>
            <Input 
              type="text" 
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleInputChange("username")}
              className="focus:ring-metro-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-metro-text mb-2">Date of Birth</Label>
            <Input 
              type="date"
              value={formData.birthday}
              onChange={handleInputChange("birthday")}
              className="focus:ring-metro-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-metro-text mb-2">Email Address</Label>
            <Input 
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange("email")}
              className="focus:ring-metro-green focus:border-transparent"
              required
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="text-blue-500 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Registration Process</h3>
                <p className="text-sm text-blue-700 mt-1">Your registration request will be reviewed by an administrator. You'll receive an email notification once your account is approved.</p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-metro-green hover:bg-metro-green-light"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Submitting Request..." : "Request Sign Up"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            className="text-metro-green hover:underline"
            onClick={() => setLocation("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
