import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  studentId: text("student_id").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  birthday: text("birthday"),
  profileImage: text("profile_image").default("attached_assets/9_1753197423895.jpg"),
  course: text("course").default("Computer Science"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  mediaType: text("media_type"), // 'image', 'video', 'pdf', null
  mediaUrl: text("media_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  timestamp: text("timestamp").notNull(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
  isRead: boolean("is_read").default(false),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'like', 'comment', 'friend_request', 'general'
  content: text("content").notNull(),
  fromUserId: integer("from_user_id"),
  timestamp: text("timestamp").notNull(),
  isRead: boolean("is_read").default(false),
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  studentId: true,
  password: true,
  fullName: true,
  email: true,
  birthday: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  mediaType: true,
  mediaUrl: true,
});

export const insertChatSchema = createInsertSchema(chats).pick({
  toUserId: true,
  message: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  studentId: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
export type FriendRequest = {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
};
