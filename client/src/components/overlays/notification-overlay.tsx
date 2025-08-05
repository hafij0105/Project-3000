import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/auth";
import { Notification, User } from "@shared/schema";

interface NotificationOverlayProps {
  onClose: () => void;
}

export default function NotificationOverlay({ onClose }: NotificationOverlayProps) {
  const currentUser = authService.getCurrentUser();

  const { data: notifications, isLoading } = useQuery<(Notification & { fromUser?: User })[]>({
    queryKey: ["/api/notifications", currentUser?.id],
    enabled: !!currentUser?.id
  });

  return (
    <div className="fixed top-20 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-metro-dark">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="text-metro-muted" />
          </Button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metro-green mx-auto"></div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {notifications?.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                {notification.fromUser ? (
                  <img 
                    src={notification.fromUser.profileImage || "/api/placeholder/40/40"}
                    alt={notification.fromUser.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-metro-green rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📅</span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-metro-dark">{notification.content}</p>
                  <p className="text-xs text-metro-muted mt-1">{notification.timestamp}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
            
            {(!notifications || notifications.length === 0) && (
              <div className="text-center py-8 text-metro-muted">
                No notifications yet
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full text-metro-green hover:bg-gray-50">
          View All Notifications
        </Button>
      </div>
    </div>
  );
}
