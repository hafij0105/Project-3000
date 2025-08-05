import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/top-navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@shared/schema";
import { authService } from "@/lib/auth";
import { MessageCircle, UserPlus, Search, UserMinus, Eye, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Friends() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "suggestions" | "requests">("friends");
  const currentUser = authService.getCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: friends, isLoading: friendsLoading } = useQuery<User[]>({
    queryKey: ["/api/friends", currentUser?.id],
    enabled: !!currentUser?.id
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<User[]>({
    queryKey: ["/api/friends/suggestions", currentUser?.id],
    enabled: !!currentUser?.id
  });

  const { data: friendRequests, isLoading: requestsLoading } = useQuery<any[]>({
    queryKey: ["/api/friends/requests", currentUser?.id],
    enabled: !!currentUser?.id
  });

  // Mutations
  const sendFriendRequestMutation = useMutation({
    mutationFn: async ({ fromUserId, toUserId }: { fromUserId: number; toUserId: number }) => {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId, toUserId })
      });
      if (!response.ok) throw new Error("Failed to send friend request");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data.message || "Friend request sent!" });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send friend request. Please try again.", variant: "destructive" });
    }
  });

  const acceptFriendRequestMutation = useMutation({
    mutationFn: async ({ fromUserId, toUserId }: { fromUserId: number; toUserId: number }) => {
      const response = await fetch("/api/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId, toUserId })
      });
      if (!response.ok) throw new Error("Failed to accept friend request");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Friend request accepted!", description: "You are now friends!" });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/suggestions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to accept friend request. Please try again.", variant: "destructive" });
    }
  });

  const rejectFriendRequestMutation = useMutation({
    mutationFn: async ({ fromUserId, toUserId }: { fromUserId: number; toUserId: number }) => {
      const response = await fetch("/api/friends/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId, toUserId })
      });
      if (!response.ok) throw new Error("Failed to reject friend request");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Friend request rejected", description: "The request has been declined." });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/suggestions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject friend request. Please try again.", variant: "destructive" });
    }
  });

  const removeFriendMutation = useMutation({
    mutationFn: async ({ userId, friendId }: { userId: number; friendId: number }) => {
      const response = await fetch(`/api/friends/${userId}/${friendId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to remove friend");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Friend removed", description: "The user has been removed from your friends list." });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/suggestions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove friend. Please try again.", variant: "destructive" });
    }
  });

  const removeSuggestionMutation = useMutation({
    mutationFn: async ({ userId, suggestionId }: { userId: number; suggestionId: number }) => {
      const response = await fetch(`/api/friends/suggestions/${userId}/${suggestionId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to remove suggestion");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Suggestion removed", description: "This suggestion has been removed from your list." });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/suggestions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove suggestion. Please try again.", variant: "destructive" });
    }
  });

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const filteredFriends = friends?.filter(friend =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (friendId: number) => {
    // Navigate to chat or open chat overlay
    toast({ title: "Message", description: "Opening chat with friend..." });
    // You can implement navigation to chat page here
  };

  const handleViewProfile = (friendId: number) => {
    // Navigate to profile page
    toast({ title: "Profile", description: "Opening friend's profile..." });
    // You can implement navigation to profile page here
  };

  const handleAddFriend = (toUserId: number) => {
    if (!currentUser?.id) return;
    sendFriendRequestMutation.mutate({ fromUserId: currentUser.id, toUserId });
  };

  const handleAcceptRequest = (fromUserId: number) => {
    if (!currentUser?.id) return;
    acceptFriendRequestMutation.mutate({ fromUserId, toUserId: currentUser.id });
  };

  const handleRejectRequest = (fromUserId: number) => {
    if (!currentUser?.id) return;
    rejectFriendRequestMutation.mutate({ fromUserId, toUserId: currentUser.id });
  };

  const handleRemoveFriend = (friendId: number) => {
    if (!currentUser?.id) return;
    removeFriendMutation.mutate({ userId: currentUser.id, friendId });
  };

  const handleRemoveSuggestion = (suggestionId: number) => {
    if (!currentUser?.id) return;
    removeSuggestionMutation.mutate({ userId: currentUser.id, suggestionId });
  };

  const isLoading = friendsLoading || suggestionsLoading || requestsLoading;

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
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-metro-dark mb-4">Friends</h1>
              
              {/* Search */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-metro-green"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metro-muted" size={16} />
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "friends"
                      ? "bg-white text-metro-dark shadow-sm"
                      : "text-metro-muted hover:text-metro-dark"
                  }`}
                >
                  Friends ({friends?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("suggestions")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "suggestions"
                      ? "bg-white text-metro-dark shadow-sm"
                      : "text-metro-muted hover:text-metro-dark"
                  }`}
                >
                  Suggestions ({suggestions?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "requests"
                      ? "bg-white text-metro-dark shadow-sm"
                      : "text-metro-muted hover:text-metro-dark"
                  }`}
                >
                  Requests ({friendRequests?.length || 0})
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-metro-green"></div>
              </div>
            ) : (
              <>
                {/* Friends Tab */}
                {activeTab === "friends" && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-metro-dark mb-4">
                      My Friends ({friends?.length || 0})
                    </h2>
                    
                    {filteredFriends?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-metro-muted">
                          {searchQuery ? "No friends found matching your search." : "You don't have any friends yet."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFriends?.map((friend) => (
                          <div key={friend.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 mb-3">
                              <img 
                                src={friend.profileImage || "/api/placeholder/48/48"}
                                alt={friend.fullName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-metro-dark truncate">
                                  {friend.fullName}
                                </h3>
                                <p className="text-sm text-metro-muted truncate">
                                  @{friend.username}
                                </p>
                                <p className="text-sm text-metro-muted truncate">
                                  {friend.course}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-metro-green hover:bg-green-700 text-white"
                                onClick={() => handleSendMessage(friend.id)}
                              >
                                <MessageCircle size={14} className="mr-1" />
                                Message
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-metro-green text-metro-green hover:bg-metro-green hover:text-white"
                                onClick={() => handleViewProfile(friend.id)}
                              >
                                <Eye size={14} className="mr-1" />
                                Profile
                              </Button>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => handleRemoveFriend(friend.id)}
                            >
                              <UserMinus size={14} className="mr-1" />
                              Remove Friend
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions Tab */}
                {activeTab === "suggestions" && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-metro-dark mb-4">
                      People You May Know ({suggestions?.length || 0})
                    </h2>
                    
                    {suggestions?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-metro-muted">No suggestions available at the moment.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions?.map((suggestion) => (
                          <div key={suggestion.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 mb-3">
                              <img 
                                src={suggestion.profileImage || "/api/placeholder/48/48"}
                                alt={suggestion.fullName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-metro-dark truncate">
                                  {suggestion.fullName}
                                </h3>
                                <p className="text-sm text-metro-muted truncate">
                                  @{suggestion.username}
                                </p>
                                <p className="text-sm text-metro-muted truncate">
                                  {suggestion.course}
                                </p>
                              </div>
                            </div>
                            
                                                         <div className="flex space-x-2">
                               <Button
                                 size="sm"
                                 className="flex-1 bg-metro-green hover:bg-green-700 text-white"
                                 onClick={() => handleAddFriend(suggestion.id)}
                                 disabled={sendFriendRequestMutation.isPending}
                               >
                                 <UserPlus size={14} className="mr-1" />
                                 Add Friend
                               </Button>
                               <Button
                                 size="sm"
                                 variant="outline"
                                 className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                 onClick={() => handleRemoveSuggestion(suggestion.id)}
                               >
                                 <UserMinus size={14} className="mr-1" />
                                 Remove
                               </Button>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Requests Tab */}
                {activeTab === "requests" && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-metro-dark mb-4">
                      Friend Requests ({friendRequests?.length || 0})
                    </h2>
                    
                    {friendRequests?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-metro-muted">No pending friend requests.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friendRequests?.map((request) => (
                          <div key={request.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 mb-3">
                              <img 
                                src={request.fromUser.profileImage || "/api/placeholder/48/48"}
                                alt={request.fromUser.fullName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-metro-dark truncate">
                                  {request.fromUser.fullName}
                                </h3>
                                <p className="text-sm text-metro-muted truncate">
                                  @{request.fromUser.username}
                                </p>
                                <p className="text-sm text-metro-muted truncate">
                                  {request.fromUser.course}
                                </p>
                                <p className="text-xs text-metro-muted">
                                  {request.timestamp}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAcceptRequest(request.fromUser.id)}
                                disabled={acceptFriendRequestMutation.isPending}
                              >
                                <Check size={14} className="mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => handleRejectRequest(request.fromUser.id)}
                                disabled={rejectFriendRequestMutation.isPending}
                              >
                                <X size={14} className="mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}