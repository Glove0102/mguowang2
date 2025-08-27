import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertActivitySchema, insertLotteryTicketSchema, insertDatingMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

import { generateNewsContent } from "./openai";
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to read news data
async function readNewsFile() {
  const filePath = path.join(process.cwd(), 'data', 'news.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write news data
async function writeNewsFile(data: any) {
  const filePath = path.join(process.cwd(), 'data', 'news.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to read models data
async function readModelsFile() {
  const filePath = path.join(process.cwd(), 'data', 'models.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to read fun content data
async function readFunFile() {
  const filePath = path.join(process.cwd(), 'data', 'fun.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to read vehicles data
async function readVehiclesFile() {
  const filePath = path.join(process.cwd(), 'data', 'vehicles.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to read sports data
async function readSportsFile() {
  const filePath = path.join(process.cwd(), 'data', 'sports.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

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

  // Serve news data
  app.get("/api/news", async (req, res) => {
    try {
      const news = await readNewsFile();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "获取新闻失败" });
    }
  });

  // Serve models data
  app.get("/api/models", async (req, res) => {
    try {
      const models = await readModelsFile();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "获取模特信息失败" });
    }
  });

  // Serve fun content data
  app.get("/api/fun", async (req, res) => {
    try {
      const funContent = await readFunFile();
      res.json(funContent);
    } catch (error) {
      res.status(500).json({ message: "获取娱乐内容失败" });
    }
  });

  // Serve vehicles data
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await readVehiclesFile();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "获取车辆信息失败" });
    }
  });

  // Serve sports data
  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await readSportsFile();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ message: "获取体育赛事失败" });
    }
  });

  // Admin endpoint to generate news
  app.post("/api/admin/generate-news", async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      // 1. Generate content from OpenAI
      const generatedContent = await generateNewsContent(topic);

      // Simple parsing to extract title and summary
      const [title, ...summaryParts] = generatedContent.split('\n');
      const summary = summaryParts.join(' ').trim();

      // 2. Read existing news
      const news = await readNewsFile();

      // 3. Create new article object
      const newArticle = {
        id: news.length > 0 ? Math.max(...news.map((a: any) => a.id)) + 1 : 1,
        title: title.replace('标题：', '').trim(),
        summary,
        category: "综合", // Default category
        time: "刚刚",
        image: "📰",
        hot: true,
      };

      // 4. Add to the beginning of the list and write back
      const updatedNews = [newArticle, ...news];
      await writeNewsFile(updatedNews);

      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error generating news:", error);
      res.status(500).json({ message: "生成新闻失败" });
    }
  });

  // Creator endpoints
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      res.json(creators);
    } catch (error) {
      res.status(500).json({ message: "获取创作者失败" });
    }
  });

  app.get("/api/creator-posts", async (req, res) => {
    try {
      const posts = await storage.getCreatorPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "获取帖子失败" });
    }
  });

  app.post("/api/admin/creators", async (req, res) => {
    try {
      const { name, bio, avatarUrl } = req.body;
      const newCreator = await storage.createCreator({ name, bio, avatarUrl });
      res.status(201).json(newCreator);
    } catch (error) {
      res.status(500).json({ message: "创建创作者失败" });
    }
  });

  app.post("/api/admin/creator-posts", async (req, res) => {
    try {
      const { creatorId, title, content, isPaid, cost } = req.body;
      const newPost = await storage.createCreatorPost({
        creatorId,
        title,
        content,
        isPaid,
        cost,
      });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "创建帖子失败" });
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

  // Sports betting endpoint
  app.post("/api/sports/bet", async (req, res) => {
    try {
      const { matchId, selectedTeam, betAmount } = req.body;
      
      const user = await storage.getUserByUsername("americauser");
      if (!user) {
        return res.status(404).json({ message: "用户未找到" });
      }

      if (user.balance < betAmount) {
        return res.status(400).json({ message: "余额不足" });
      }

      // Deduct bet amount
      await storage.updateUser(user.id, { balance: user.balance - betAmount });

      // Simulate match result (randomly pick winner)
      const sports = await readSportsFile();
      const match = sports.find((m: any) => m.id === matchId);
      
      if (!match) {
        return res.status(404).json({ message: "比赛未找到" });
      }

      const winner = match.teams[Math.floor(Math.random() * 2)];
      const userWon = winner === selectedTeam;
      
      let winnings = 0;
      let xpGain = 10; // Base XP for participating

      if (userWon) {
        const odds = match.odds[selectedTeam];
        winnings = Math.floor(betAmount * odds);
        xpGain = 50;
        
        // Add winnings to balance
        await storage.updateUser(user.id, { 
          balance: user.balance - betAmount + winnings,
          xp: user.xp + xpGain
        });
        
        await storage.createActivity({
          userId: user.id,
          type: "sports_bet_win",
          description: `${selectedTeam} 获胜，赢得 $${winnings}`,
          xpEarned: xpGain,
          dollarEarned: winnings - betAmount
        });
      } else {
        await storage.updateUser(user.id, { xp: user.xp + xpGain });
        
        await storage.createActivity({
          userId: user.id,
          type: "sports_bet_loss",
          description: `${selectedTeam} 失败，损失 $${betAmount}`,
          xpEarned: xpGain,
          dollarEarned: -betAmount
        });
      }

      res.json({
        userWon,
        winner,
        winnings,
        xpGain,
        selectedTeam,
        match: match.teams.join(" vs ")
      });
    } catch (error) {
      res.status(500).json({ message: "投注失败" });
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