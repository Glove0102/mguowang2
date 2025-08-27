import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").notNull().default(1000),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'news_read', 'lottery_win', 'dating_message', etc.
  description: text("description").notNull(),
  xpEarned: integer("xp_earned").default(0),
  dollarEarned: integer("dollar_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lotteryTickets = pgTable("lottery_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'scratch', 'wheel', 'daily'
  result: json("result"), // { won: boolean, amount: number, prize: string }
  createdAt: timestamp("created_at").defaultNow(),
});

export const stockPortfolio = pgTable("stock_portfolio", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  symbol: text("symbol").notNull(),
  shares: integer("shares").notNull(),
  avgPrice: integer("avg_price").notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow(),
});

export const datingMessages = pgTable("dating_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  profileId: text("profile_id").notNull(),
  message: text("message").notNull(),
  isFromUser: boolean("is_from_user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creatorPosts = pgTable("creator_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => creators.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  cost: integer("cost").notNull().default(0), // in dollars
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertLotteryTicketSchema = createInsertSchema(lotteryTickets).omit({
  id: true,
  createdAt: true,
});

export const insertStockPortfolioSchema = createInsertSchema(stockPortfolio).omit({
  id: true,
  createdAt: true,
});

export const insertDatingMessageSchema = createInsertSchema(datingMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorPostSchema = createInsertSchema(creatorPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertLotteryTicket = z.infer<typeof insertLotteryTicketSchema>;
export type LotteryTicket = typeof lotteryTickets.$inferSelect;
export type InsertStockPortfolio = z.infer<typeof insertStockPortfolioSchema>;
export type StockPortfolio = typeof stockPortfolio.$inferSelect;
export type InsertDatingMessage = z.infer<typeof insertDatingMessageSchema>;
export type DatingMessage = typeof datingMessages.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;
export type InsertCreatorPost = z.infer<typeof insertCreatorPostSchema>;
export type CreatorPost = typeof creatorPosts.$inferSelect;
