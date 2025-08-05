import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertPostSchema, insertChatSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, studentId, password } = loginSchema.parse(req.body);
      console.log("Login attempt:", { username, studentId, password });
      
      const user = await storage.getUserByCredentials(username, studentId, password);
      console.log("User found:", user ? "YES" : "NO");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd create a session or JWT token here
      res.json({ user });
    } catch (error) {
      console.log("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or student ID already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user, message: "Registration request submitted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   // Placeholder route
app.get("/api/placeholder/:width/:height", (req, res) => {
  const { width, height } = req.params;
  res.redirect(`https://via.placeholder.com/${width}x${height}`);
});


    
    res.json(user);
  });

  app.patch("/api/users/:id/password", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { newPassword } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
      
      await storage.updateUserPassword(userId, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const { userId, ...postData } = req.body;
      const validatedPost = insertPostSchema.parse(postData);
      
      const post = await storage.createPost(userId, validatedPost);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/posts/:id/like", async (req, res) => {
  const postId = parseInt(req.params.id);
  const { userId } = req.body; // make sure you pass this from frontend

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const alreadyLiked = await storage.hasUserLikedPost(userId, postId);

  if (alreadyLiked) {
    await storage.unlikePost(userId, postId);
    return res.json({ message: "Post unliked", liked: false });
  } else {
    await storage.likePost(userId, postId);
    return res.json({ message: "Post liked", liked: true });
  }
});


  // Chat routes
  app.get("/api/chats/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const chats = await storage.getChatsByUserId(userId);
    res.json(chats);
  });

  app.post("/api/chats", async (req, res) => {
    try {
      const { fromUserId, ...chatData } = req.body;
      const validatedChat = insertChatSchema.parse(chatData);
      
      const chat = await storage.createChat(fromUserId, validatedChat);
      res.json(chat);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const notifications = await storage.getNotificationsByUserId(userId);
    res.json(notifications);
  });

  // Friends routes
  app.get("/api/friends/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friends = await storage.getFriendsByUserId(userId);
    res.json(friends);
  });

  const httpServer = createServer(app);
  return httpServer;
}
