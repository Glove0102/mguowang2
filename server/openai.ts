import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateChatResponse(message: string, profileName: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `你是${profileName}，一个友好的美国女孩，正在和中国男用户聊天。请用简单自然的中文回复，保持友好和真实的语气。回复要简短（1-2句话），就像真正的约会对话一样。不要提及你是AI，要表现得像真实的人一样。保持对话轻松愉快，展现美国女孩的开朗个性。`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_completion_tokens: 100,
      temperature: 0.8
    });

    return response.choices[0].message.content || "我现在有点忙，稍后回复你哦～";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "抱歉，我现在网络不好，稍后再聊吧～";
  }
}

export async function generateNewsContent(topic: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "你是一个专业的美国新闻编辑，请根据给定的主题生成一篇简短的新闻内容，用中文写作，内容要真实可信，避免敏感政治话题。"
        },
        {
          role: "user",
          content: `请为以下主题写一篇简短的新闻：${topic}`
        }
      ],
      max_completion_tokens: 300
    });

    return response.choices[0].message.content || "暂无相关新闻内容";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "新闻内容生成失败，请稍后重试";
  }
}

export { openai };
