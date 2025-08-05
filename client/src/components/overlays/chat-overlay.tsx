import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/auth";
import { Chat, User } from "@shared/schema";

interface ChatOverlayProps {
  onClose: () => void;
}

export default function ChatOverlay({ onClose }: ChatOverlayProps) {
  const currentUser = authService.getCurrentUser();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const { data: chats, isLoading } = useQuery<(Chat & { fromUser: User; toUser: User })[]>({
    queryKey: ["/api/chats", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser || !messageInput.trim()) return;
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUser?.id,
          toUserId: selectedUser.id,
          message: messageInput.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/chats", currentUser?.id] });
    },
  });

  const conversations = chats?.reduce((acc, chat) => {
    const partnerId = chat.fromUserId === currentUser?.id ? chat.toUserId : chat.fromUserId;
    const partner = chat.fromUserId === currentUser?.id ? chat.toUser : chat.fromUser;

    if (!acc[partnerId]) {
      acc[partnerId] = {
        partner,
        messages: [],
      };
    }
    acc[partnerId].messages.push(chat);
    return acc;
  }, {} as Record<number, { partner: User; messages: Chat[] }>);

  const currentMessages = selectedUser ? conversations?.[selectedUser.id]?.messages || [] : [];

  return (
    <div className="fixed top-20 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[90vh]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-metro-dark">
          {selectedUser ? selectedUser.fullName : "Messages"}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="text-metro-muted" />
        </Button>
      </div>

      {/* Chat list or messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedUser ? (
          isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metro-green mx-auto"></div>
            </div>
          ) : (
            conversations &&
            Object.values(conversations).map(({ partner, messages }) => {
              const lastMessage = messages[messages.length - 1];
              return (
                <div
                  key={partner.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setSelectedUser(partner)}
                >
                  <img
                    src={partner.profileImage || "/api/placeholder/40/40"}
                    alt={partner.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-metro-dark">{partner.fullName}</h4>
                      <span className="text-xs text-metro-muted">{lastMessage.timestamp}</span>
                    </div>
                    <p className="text-sm text-metro-muted truncate">
                      {lastMessage.message}
                    </p>
                  </div>
                </div>
              );
            })
          )
        ) : (
          [...currentMessages]
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.fromUserId === currentUser?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    msg.fromUserId === currentUser?.id
                      ? "bg-metro-green text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
        )}
        {!selectedUser && (!conversations || Object.keys(conversations).length === 0) && (
          <div className="text-center py-8 text-metro-muted">No messages yet</div>
        )}
      </div>

      {/* Input box */}
      {selectedUser && (
        <div className="p-3 border-t border-gray-200">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <input
              className=" flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button  size="sm" type="submit" disabled={mutation.isPending} className="bg-metro-green hover:bg-metro-green/90 text-white">
              Send
            </Button>
          </form>
          <Button
            variant="ghost"
            className="mt-2 text-xs text-metro-muted"
            onClick={() => setSelectedUser(null)}
          >
            ← Back to all chats
          </Button>
        </div>
      )}
    </div>
  );
}
