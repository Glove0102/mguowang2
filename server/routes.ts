import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertActivitySchema, insertLotteryTicketSchema, insertDatingMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { password } = req.body;
      const hardcodedPassword = "america2024";
      
      if (password !== hardcodedPassword) {
        return res.status(401).json({ message: "密码错误" });
      }

      // Get or create the single user
      let user = await storage.getUserByUsername("americauser");
      if (!user) {
        user = await storage.createUser({
          username: "americauser",
          password: "america2024"
        });
      }

      res.json({ user, token: "authenticated" });
    } catch (error) {
      res.status(500).json({ message: "登录失败" });
    }
  });

  // User profile
  app.get("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "获取用户信息失败" });
    }
  });

  // Update user XP and balance
  app.post("/api/user/update", async (req, res) => {
    try {
      const { xpGain, dollarGain, activityType, description } = req.body;
      const user = await storage.getUserByUsername("americauser");
      
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      const newXp = user.xp + (xpGain || 0);
      const newBalance = user.balance + (dollarGain || 0);
      
      // Calculate new level
      let newLevel = user.level;
      if (newXp >= 1000) newLevel = 5;
      else if (newXp >= 600) newLevel = 4;
      else if (newXp >= 300) newLevel = 3;
      else if (newXp >= 100) newLevel = 2;

      const updatedUser = await storage.updateUser(user.id, {
        xp: newXp,
        balance: newBalance,
        level: newLevel
      });

      // Record activity
      if (activityType && description) {
        await storage.createActivity({
          userId: user.id,
          type: activityType,
          description,
          xpEarned: xpGain || 0,
          dollarEarned: dollarGain || 0
        });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "更新用户信息失败" });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      const activities = await storage.getActivitiesByUserId(user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "获取活动记录失败" });
    }
  });

  // Lottery endpoints
  app.post("/api/lottery/scratch", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      if (user.balance < 5) {
        return res.status(400).json({ message: "余额不足" });
      }

      // Deduct cost
      await storage.updateUser(user.id, { balance: user.balance - 5 });

      // Generate random result
      const winChance = Math.random();
      const won = winChance < 0.3; // 30% win chance
      const winAmount = won ? Math.floor(Math.random() * 1000) + 10 : 0;

      const result = { won, amount: winAmount, prize: won ? `$${winAmount}` : "谢谢参与" };

      // Record lottery ticket
      await storage.createLotteryTicket({
        userId: user.id,
        type: "scratch",
        result
      });

      // Update balance if won
      if (won) {
        await storage.updateUser(user.id, { balance: user.balance - 5 + winAmount });
        await storage.createActivity({
          userId: user.id,
          type: "lottery_win",
          description: `刮刮乐中奖 $${winAmount}`,
          xpEarned: 20,
          dollarEarned: winAmount
        });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "刮刮乐失败" });
    }
  });

  app.post("/api/lottery/wheel", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      // Check if already spun today
      const today = new Date().toDateString();
      const lastSpin = await storage.getLastLotteryTicket(user.id, "wheel");
      
      if (lastSpin && lastSpin.createdAt && new Date(lastSpin.createdAt).toDateString() === today) {
        return res.status(400).json({ message: "今日已转动过转盘" });
      }

      // Generate random result
      const prizes = [
        { amount: 10, xp: 5, text: "$10" },
        { amount: 25, xp: 10, text: "$25" },
        { amount: 50, xp: 20, text: "$50" },
        { amount: 100, xp: 50, text: "$100" },
        { amount: 5, xp: 5, text: "$5" },
        { amount: 0, xp: 10, text: "10 XP" }
      ];

      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      
      await storage.updateUser(user.id, { 
        balance: user.balance + randomPrize.amount,
        xp: user.xp + randomPrize.xp
      });

      await storage.createLotteryTicket({
        userId: user.id,
        type: "wheel",
        result: randomPrize
      });

      await storage.createActivity({
        userId: user.id,
        type: "wheel_spin",
        description: `幸运转盘获得 ${randomPrize.text}`,
        xpEarned: randomPrize.xp,
        dollarEarned: randomPrize.amount
      });

      res.json(randomPrize);
    } catch (error) {
      res.status(500).json({ message: "转盘失败" });
    }
  });

  app.post("/api/lottery/checkin", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      // Check if already checked in today
      const today = new Date().toDateString();
      const lastCheckin = await storage.getLastLotteryTicket(user.id, "daily");
      
      if (lastCheckin && lastCheckin.createdAt && new Date(lastCheckin.createdAt).toDateString() === today) {
        return res.status(400).json({ message: "今日已签到" });
      }

      const reward = { amount: 20, xp: 15, text: "每日签到奖励" };
      
      await storage.updateUser(user.id, { 
        balance: user.balance + reward.amount,
        xp: user.xp + reward.xp
      });

      await storage.createLotteryTicket({
        userId: user.id,
        type: "daily",
        result: reward
      });

      await storage.createActivity({
        userId: user.id,
        type: "daily_checkin",
        description: "每日签到",
        xpEarned: reward.xp,
        dollarEarned: reward.amount
      });

      res.json(reward);
    } catch (error) {
      res.status(500).json({ message: "签到失败" });
    }
  });

  // Dating chat endpoint
  app.post("/api/dating/chat", async (req, res) => {
    try {
      const { profileId, message } = req.body;
      const user = await storage.getUserByUsername("americauser");
      
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      // Save user message
      await storage.createDatingMessage({
        userId: user.id,
        profileId,
        message,
        isFromUser: true
      });

      // Generate AI response in Chinese
      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "你是一个友好的美国女孩，正在和中国男用户聊天。请用简单自然的中文回复，保持友好和真实的语气。回复要简短（1-2句话），就像真正的约会对话一样。"
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 100
      });

      const aiReply = response.choices[0].message.content || "抱歉，我现在无法回复。";

      // Save AI response
      await storage.createDatingMessage({
        userId: user.id,
        profileId,
        message: aiReply,
        isFromUser: false
      });

      res.json({ reply: aiReply });
    } catch (error) {
      res.status(500).json({ message: "聊天失败" });
    }
  });

  // Get dating messages
  app.get("/api/dating/messages/:profileId", async (req, res) => {
    try {
      const { profileId } = req.params;
      const user = await storage.getUserByUsername("americauser");
      
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      const messages = await storage.getDatingMessages(user.id, profileId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "获取消息失败" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
