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
  likePost(postId: number): Promise<void>;
  
  // Chats
  getChatsByUserId(userId: number): Promise<(Chat & { fromUser: User; toUser: User })[]>;
  createChat(fromUserId: number, chat: InsertChat): Promise<Chat>;
  
  // Notifications
  getNotificationsByUserId(userId: number): Promise<(Notification & { fromUser?: User })[]>;
  createNotification(userId: number, type: string, content: string, fromUserId?: number): Promise<Notification>;
  
  // Friends
  getFriendsByUserId(userId: number): Promise<User[]>;
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
      timestamp: "3 hours ago",
      isRead: false
    };

    this.notifications.set(1, notification1);
    this.notifications.set(2, notification2);
    this.notifications.set(3, notification3);
    this.currentNotificationId = 4;

    // Create sample friendships
    const friendship1: Friendship = { id: 1, userId: 1, friendId: 2 };
    const friendship2: Friendship = { id: 2, userId: 1, friendId: 3 };
    const friendship3: Friendship = { id: 3, userId: 1, friendId: 4 };
    const friendship4: Friendship = { id: 4, userId: 1, friendId: 5 };

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
      course: "Computer Science"
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
      timestamp: "now"
    };
    this.posts.set(id, post);
    return post;
  }

  async likePost(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.posts.set(postId, post);
    }
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
}

export const storage = new MemStorage();
