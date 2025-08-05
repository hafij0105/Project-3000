import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import { authService } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMutation = useMutation({
    mutationFn: async (password: string) => {
      if (!currentUser) throw new Error("Not authenticated");
      const response = await apiRequest("PATCH", `/api/users/${currentUser.id}/password`, {
        newPassword: password
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated!",
        description: "Your password has been successfully changed"
      });
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({
        title: "Failed to update password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "Password too short",
        description: "Password must be at least 4 characters long",
        variant: "destructive"
      });
      return;
    }

    passwordMutation.mutate(newPassword);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-metro-dark mb-4">Not Authenticated</h1>
          <Button onClick={() => setLocation("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-metro-gray">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-metro-dark">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-6">
              <img 
                src={currentUser.profileImage || "/api/placeholder/100/100"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-metro-dark">{currentUser.fullName}</h2>
                <p className="text-metro-muted">{currentUser.course}</p>
                <p className="text-sm text-metro-muted">Student ID: {currentUser.studentId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={currentUser.fullName} disabled />
              </div>
              <div>
                <Label>Username</Label>
                <Input value={currentUser.username} disabled />
              </div>
              <div>
                <Label>Student ID</Label>
                <Input value={currentUser.studentId} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={currentUser.email || ""} disabled />
              </div>
              <div>
                <Label>Birthday</Label>
                <Input value={currentUser.birthday || ""} disabled />
              </div>
              <div>
                <Label>Course</Label>
                <Input value={currentUser.course || ""} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-metro-green hover:bg-metro-green-light"
                disabled={passwordMutation.isPending}
              >
                <Save size={16} className="mr-2" />
                {passwordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
