import { 
  users, 
  activities, 
  lotteryTickets, 
  stockPortfolio, 
  datingMessages,
  creators,
  creatorPosts,
  type User, 
  type InsertUser,
  type Activity,
  type InsertActivity,
  type LotteryTicket,
  type InsertLotteryTicket,
  type StockPortfolio,
  type InsertStockPortfolio,
  type DatingMessage,
  type InsertDatingMessage,
  type Creator,
  type InsertCreator,
  type CreatorPost,
  type InsertCreatorPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUserId(userId: string): Promise<Activity[]>;
  
  // Lottery operations
  createLotteryTicket(ticket: InsertLotteryTicket): Promise<LotteryTicket>;
  getLastLotteryTicket(userId: string, type: string): Promise<LotteryTicket | undefined>;
  
  // Stock portfolio operations
  createStockHolding(holding: InsertStockPortfolio): Promise<StockPortfolio>;
  getStockPortfolio(userId: string): Promise<StockPortfolio[]>;
  updateStockHolding(id: string, updates: Partial<StockPortfolio>): Promise<StockPortfolio>;
  
  // Dating message operations
  createDatingMessage(message: InsertDatingMessage): Promise<DatingMessage>;
  getDatingMessages(userId: string, profileId: string): Promise<DatingMessage[]>;

  // Creator operations
  getCreators(): Promise<Creator[]>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  getCreatorPosts(): Promise<CreatorPost[]>;
  createCreatorPost(post: InsertCreatorPost): Promise<CreatorPost>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(10);
  }

  async createLotteryTicket(insertTicket: InsertLotteryTicket): Promise<LotteryTicket> {
    const [ticket] = await db
      .insert(lotteryTickets)
      .values(insertTicket)
      .returning();
    return ticket;
  }

  async getLastLotteryTicket(userId: string, type: string): Promise<LotteryTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(lotteryTickets)
      .where(and(
        eq(lotteryTickets.userId, userId),
        eq(lotteryTickets.type, type)
      ))
      .orderBy(desc(lotteryTickets.createdAt))
      .limit(1);
    return ticket || undefined;
  }

  async createStockHolding(insertHolding: InsertStockPortfolio): Promise<StockPortfolio> {
    const [holding] = await db
      .insert(stockPortfolio)
      .values(insertHolding)
      .returning();
    return holding;
  }

  async getStockPortfolio(userId: string): Promise<StockPortfolio[]> {
    return await db
      .select()
      .from(stockPortfolio)
      .where(eq(stockPortfolio.userId, userId))
      .orderBy(desc(stockPortfolio.createdAt));
  }

  async updateStockHolding(id: string, updates: Partial<StockPortfolio>): Promise<StockPortfolio> {
    const [holding] = await db
      .update(stockPortfolio)
      .set(updates)
      .where(eq(stockPortfolio.id, id))
      .returning();
    return holding;
  }

  async createDatingMessage(insertMessage: InsertDatingMessage): Promise<DatingMessage> {
    const [message] = await db
      .insert(datingMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getDatingMessages(userId: string, profileId: string): Promise<DatingMessage[]> {
    return await db
      .select()
      .from(datingMessages)
      .where(and(
        eq(datingMessages.userId, userId),
        eq(datingMessages.profileId, profileId)
      ))
      .orderBy(datingMessages.createdAt);
  }

  async getCreators(): Promise<Creator[]> {
    return await db.select().from(creators).orderBy(desc(creators.createdAt));
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db
      .insert(creators)
      .values(insertCreator)
      .returning();
    return creator;
  }

  async createCreatorPost(insertPost: InsertCreatorPost): Promise<CreatorPost> {
    const [post] = await db
      .insert(creatorPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getCreatorPosts(): Promise<CreatorPost[]> {
    return await db.select().from(creatorPosts).orderBy(desc(creatorPosts.createdAt));
  }
}

export const storage = new DatabaseStorage();
