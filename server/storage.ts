import { 
  users, posts, chats, notifications, friendships,
  type User, type Post, type Chat, type Notification, type Friendship,
  type InsertUser, type InsertPost, type InsertChat 
} from "@shared/schema";


export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByCredentials(username: string, studentId: string, password: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  
  // Posts
  getPosts(): Promise<(Post & { user: User })[]>;
  createPost(userId: number, post: InsertPost): Promise<Post>;
  likePost(userId: number, postId: number): Promise<void>;
  unlikePost(userId: number, postId: number): Promise<void>;
  hasUserLikedPost(userId: number, postId: number): Promise<boolean>;
  
  // Chats
  getChatsByUserId(userId: number): Promise<(Chat & { fromUser: User; toUser: User })[]>;
  createChat(fromUserId: number, chat: InsertChat): Promise<Chat>;
  
  // Notifications
  getNotificationsByUserId(userId: number): Promise<(Notification & { fromUser?: User })[]>;
  createNotification(userId: number, type: string, content: string, fromUserId?: number): Promise<Notification>;
  
  // Friends
  getFriendsByUserId(userId: number): Promise<User[]>;
  sendFriendRequest(fromUserId: number, toUserId: number): Promise<any>;
  acceptFriendRequest(fromUserId: number, toUserId: number): Promise<void>;
  rejectFriendRequest(fromUserId: number, toUserId: number): Promise<void>;
  removeFriend(userId: number, friendId: number): Promise<void>;
  getFriendSuggestions(userId: number): Promise<User[]>;
  getFriendRequests(userId: number): Promise<any[]>;
  removeSuggestion(userId: number, suggestionId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private posts: Map<number, Post> = new Map();
  private chats: Map<number, Chat> = new Map();
  private notifications: Map<number, Notification> = new Map();
  private friendships: Map<number, Friendship> = new Map();
  
  private currentUserId = 1;
  private currentPostId = 1;
  private currentChatId = 1;
  private currentNotificationId = 1;
  private currentFriendshipId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const user1: User = {
      id: 1,
      username: "Hafij",
      studentId: "115002",
      password: "1234",
      fullName: "Hafij Al Asad",
      email: "hafij@university.edu",
      birthday: "1998-05-15",
      profileImage: "assets/1.jpg",
      course: "Computer Science"
    };

    const user2: User = {
      id: 2,
      username: "Rukshana",
      studentId: "CS002", 
      password: "1234",
      fullName: "Rukshana Begum",
      email: "rukshana@university.edu",
      birthday: "1999-03-22",
      profileImage: "assets/2.webp",
      course: "Computer Science"
    };

    const user3: User = {
      id: 3,
      username: "Noyon",
      studentId: "CS003",
      password: "1234", 
      fullName: "Md. Noyon",
      email: "noyon@university.edu",
      birthday: "1998-11-08",
      profileImage: "assets/3.jpg",
      course: "Computer Science"
    };

    const user4: User = {
      id: 4,
      username: "aarav",
      studentId: "CS004",
      password: "1234",
      fullName: "Aarav Sharma", 
      email: "aarav@university.edu",
      birthday: "1999-07-14",
      profileImage: "assets/10.jpg",
      course: "Computer Science"
    };

    const user5: User = {
      id: 5,
      username: "farhan",
      studentId: "CS005",
      password: "1234",
      fullName: "Farhan Ahmed",
      email: "farhan@university.edu",
      birthday: "1998-11-08",
      profileImage: "assets/9.jpg",
      course: "Computer Science"
    };

    this.users.set(1, user1);
    this.users.set(2, user2);
    this.users.set(3, user3);
    this.users.set(4, user4);
    this.users.set(5, user5);
    this.currentUserId = 6;

    // Create sample posts
    const post1: Post = {
      id: 1,
      userId: 2,
      content: "Just finished my Computer Networks assignment! The concepts of TCP/IP protocols are fascinating. Anyone else working on similar projects? Would love to discuss and share insights! 📚💻",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago"
    };

    const post2: Post = {
      id: 2,
      userId: 3,
      content: "Sharing my Data Structures notes for the upcoming exam. Hope this helps everyone! 📖✨",
      mediaType: "pdf",
      mediaUrl: "Data Structures - Complete Notes.pdf",
      likes: 42,
      comments: 15,
      timestamp: "5 hours ago"
    };

    const post3: Post = {
      id: 3,
      userId: 4,
      content: "Quick tutorial on React Hooks I made for our web development study group! 🚀",
      mediaType: "video",
      mediaUrl: "assets/React.mp4",
      likes: 67,
      comments: 23,
      timestamp: "1 day ago"
    };

    this.posts.set(1, post1);
    this.posts.set(2, post2);
    this.posts.set(3, post3);
    this.currentPostId = 4;

    // Create sample chats
    const now = new Date();
    const chat1: Chat = {
      id: 1,
      fromUserId: 2,
      toUserId: 1,
      message: "Hey! Did you complete the assignment?",
      timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // "2m" ago
      isRead: false
    };

    const chat2: Chat = {
      id: 2,
      fromUserId: 4,
      toUserId: 1,
      message: "Thanks for sharing the notes!",
      timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // "1h" ago
      isRead: false
    };

    this.chats.set(1, chat1);
    this.chats.set(2, chat2);
    this.currentChatId = 3;

    // Create sample notifications
    const notification1: Notification = {
      id: 1,
      userId: 1,
      type: "like",
      content: "Aarav Sharma liked your post about Computer Networks",
      fromUserId: 2,
      timestamp: "2 minutes ago",
      isRead: false
    };

    const notification2: Notification = {
      id: 2,
      userId: 1,
      type: "comment",
      content: "Sarah Wilson commented on your post",
      fromUserId: 4,
      timestamp: "1 hour ago",
      isRead: false
    };

    const notification3: Notification = {
      id: 3,
      userId: 1,
      type: "general",
      content: "Reminder: Tech Symposium tomorrow at 2 PM",
      fromUserId: null,
      timestamp: "3 hours ago",
      isRead: false
    };

    // Add a friend request notification
    const notification4: Notification = {
      id: 4,
      userId: 1,
      type: "friend_request",
      content: "sent you a friend request",
      fromUserId: 4, // Aarav Sharma
      timestamp: "1 hour ago",
      isRead: false
    };

    this.notifications.set(1, notification1);
    this.notifications.set(2, notification2);
    this.notifications.set(3, notification3);
    this.notifications.set(4, notification4);
    this.currentNotificationId = 5;

    // Create sample friendships - only 2 friends for user 1
    const friendship1: Friendship = { id: 1, userId: 1, friendId: 2 };
    const friendship2: Friendship = { id: 2, userId: 1, friendId: 3 };
    // Also create reverse friendships
    const friendship3: Friendship = { id: 3, userId: 2, friendId: 1 };
    const friendship4: Friendship = { id: 4, userId: 3, friendId: 1 };

    this.friendships.set(1, friendship1);
    this.friendships.set(2, friendship2);
    this.friendships.set(3, friendship3);
    this.friendships.set(4, friendship4);
    this.currentFriendshipId = 5;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByCredentials(username: string, studentId: string, password: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username && user.studentId === studentId && user.password === password
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      profileImage: "assets/9.jpg",
      course: "Computer Science",
      email: insertUser.email || null,
      birthday: insertUser.birthday || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.password = newPassword;
      this.users.set(userId, user);
    }
  }

  async getPosts(): Promise<(Post & { user: User })[]> {
    const postsWithUsers: (Post & { user: User })[] = [];
    
    for (const post of this.posts.values()) {
      const user = this.users.get(post.userId);
      if (user) {
        postsWithUsers.push({ ...post, user });
      }
    }
    
    return postsWithUsers.sort((a, b) => b.id - a.id); // Sort by newest first
  }

  async createPost(userId: number, insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      ...insertPost,
      id,
      userId,
      likes: 0,
      comments: 0,
      timestamp: "now",
      mediaType: insertPost.mediaType || null,
      mediaUrl: insertPost.mediaUrl || null
    };
    this.posts.set(id, post);
    return post;
  }

  async getChatsByUserId(userId: number): Promise<(Chat & { fromUser: User; toUser: User })[]> {
    const userChats: (Chat & { fromUser: User; toUser: User })[] = [];
    
    for (const chat of this.chats.values()) {
      if (chat.toUserId === userId || chat.fromUserId === userId) {
        const fromUser = this.users.get(chat.fromUserId);
        const toUser = this.users.get(chat.toUserId);
        
        if (fromUser && toUser) {
          userChats.push({ ...chat, fromUser, toUser });
        }
      }
    }
    
    return userChats;
  }

  async createChat(fromUserId: number, insertChat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const chat: Chat = {
      ...insertChat,
      id,
      fromUserId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getNotificationsByUserId(userId: number): Promise<(Notification & { fromUser?: User })[]> {
    const userNotifications: (Notification & { fromUser?: User })[] = [];
    
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId) {
        const fromUser = notification.fromUserId ? this.users.get(notification.fromUserId) : undefined;
        userNotifications.push({ ...notification, fromUser });
      }
    }
    
    return userNotifications.sort((a, b) => b.id - a.id);
  }

  async createNotification(userId: number, type: string, content: string, fromUserId?: number): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      id,
      userId,
      type,
      content,
      fromUserId,
      timestamp: "now",
      isRead: false
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getFriendsByUserId(userId: number): Promise<User[]> {
    const friends: User[] = [];
    
    for (const friendship of this.friendships.values()) {
      if (friendship.userId === userId) {
        const friend = this.users.get(friendship.friendId);
        if (friend) {
          friends.push(friend);
        }
      }
    }
    
    return friends;
  }

  async likePost(userId: number, postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.posts.set(postId, post);
    }
  }

  async unlikePost(userId: number, postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post && post.likes && post.likes > 0) {
      post.likes = post.likes - 1;
      this.posts.set(postId, post);
    }
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    // For simplicity, we'll assume users can like posts multiple times
    // In a real app, you'd track individual user likes
    return false;
  }

  async sendFriendRequest(fromUserId: number, toUserId: number): Promise<any> {
    // Check if friendship already exists
    for (const friendship of this.friendships.values()) {
      if ((friendship.userId === fromUserId && friendship.friendId === toUserId) ||
          (friendship.userId === toUserId && friendship.friendId === fromUserId)) {
        return { message: "Already friends or request pending" };
      }
    }
    
    // Check if request already exists
    for (const notification of this.notifications.values()) {
      if (notification.userId === toUserId && 
          notification.fromUserId === fromUserId && 
          notification.type === "friend_request" && 
          !notification.isRead) {
        return { message: "Friend request already sent" };
      }
    }
    
    // Create a notification for friend request
    await this.createNotification(
      toUserId,
      "friend_request",
      "sent you a friend request",
      fromUserId
    );
    return { message: "Friend request sent" };
  }

  async acceptFriendRequest(fromUserId: number, toUserId: number): Promise<void> {
    // Check if friendship already exists
    for (const friendship of this.friendships.values()) {
      if ((friendship.userId === fromUserId && friendship.friendId === toUserId) ||
          (friendship.userId === toUserId && friendship.friendId === fromUserId)) {
        return; // Already friends
      }
    }
    
    // Create friendship in both directions
    const friendship1: Friendship = { 
      id: this.currentFriendshipId++, 
      userId: fromUserId, 
      friendId: toUserId 
    };
    const friendship2: Friendship = { 
      id: this.currentFriendshipId++, 
      userId: toUserId, 
      friendId: fromUserId 
    };
    
    this.friendships.set(friendship1.id, friendship1);
    this.friendships.set(friendship2.id, friendship2);
    
    // Mark the friend request notification as read
    for (const notification of this.notifications.values()) {
      if (notification.userId === toUserId && 
          notification.fromUserId === fromUserId && 
          notification.type === "friend_request" && 
          !notification.isRead) {
        notification.isRead = true;
        break;
      }
    }
    
    // Create notification for acceptance
    await this.createNotification(
      fromUserId,
      "friend_request",
      "accepted your friend request",
      toUserId
    );
  }

  async rejectFriendRequest(fromUserId: number, toUserId: number): Promise<void> {
    // Mark the friend request notification as read
    for (const notification of this.notifications.values()) {
      if (notification.userId === toUserId && 
          notification.fromUserId === fromUserId && 
          notification.type === "friend_request" && 
          !notification.isRead) {
        notification.isRead = true;
        break;
      }
    }
    
    // Create notification for rejection
    await this.createNotification(
      fromUserId,
      "friend_request",
      "rejected your friend request",
      toUserId
    );
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    // Remove friendships in both directions
    for (const [id, friendship] of this.friendships.entries()) {
      if ((friendship.userId === userId && friendship.friendId === friendId) ||
          (friendship.userId === friendId && friendship.friendId === userId)) {
        this.friendships.delete(id);
      }
    }
  }

  async getFriendSuggestions(userId: number): Promise<User[]> {
    const currentFriends = await this.getFriendsByUserId(userId);
    const currentFriendIds = new Set(currentFriends.map(f => f.id));
    
    const suggestions: User[] = [];
    for (const user of this.users.values()) {
      if (user.id !== userId && !currentFriendIds.has(user.id)) {
        suggestions.push(user);
      }
    }
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  async getFriendRequests(userId: number): Promise<any[]> {
    const requests: any[] = [];
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId && 
          notification.type === "friend_request" && 
          !notification.isRead) {
        const fromUser = this.users.get(notification.fromUserId!);
        if (fromUser) {
          requests.push({
            id: notification.id,
            fromUser,
            timestamp: notification.timestamp
          });
        }
      }
    }
    return requests;
  }

  async removeSuggestion(userId: number, suggestionId: number): Promise<void> {
    // For now, we'll just return success
    // In a real app, you might want to track removed suggestions in a separate table
    // or modify the suggestions logic to exclude removed suggestions
    return Promise.resolve();
  }
}

export const storage = new MemStorage();
