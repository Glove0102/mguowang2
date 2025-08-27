import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

export default function LotteryPage() {
  const [scratchCard, setScratchCard] = useState<any>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<any>(null);
  const [dailyCheckedIn, setDailyCheckedIn] = useState(false);
  const { user, updateUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already checked in today
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('lastCheckin');
    setDailyCheckedIn(lastCheckin === today);
  }, []);

  const handleScratchLottery = async () => {
    if (!user || user.balance < 5) {
      toast({
        title: "余额不足",
        description: "购买刮刮乐需要 $5",
        variant: "destructive"
      });
      return;
    }

    setIsScratching(true);
    
    try {
      const response = await fetch('/api/lottery/scratch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        setScratchCard(data);
        
        // Simulate scratching animation
        setTimeout(() => {
          setIsScratching(false);
          toast({
            title: data.won ? "🎉 恭喜中奖！" : "很遗憾",
            description: data.prize,
            variant: data.won ? "default" : "destructive"
          });
        }, 2000);

        // Update user balance
        const userResponse = await fetch('/api/user/profile');
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          updateUser(updatedUser);
        }
      } else {
        toast({
          title: "操作失败",
          description: data.message,
          variant: "destructive"
        });
        setIsScratching(false);
      }
    } catch (error) {
      toast({
        title: "网络错误",
        description: "请稍后重试",
        variant: "destructive"
      });
      setIsScratching(false);
    }
  };

  const handleWheelSpin = async () => {
    setWheelSpinning(true);
    setWheelResult(null);
    
    try {
      const response = await fetch('/api/lottery/wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Simulate wheel spinning
        setTimeout(() => {
          setWheelSpinning(false);
          setWheelResult(data);
          toast({
            title: "🎲 转盘结果",
            description: `获得 ${data.text}！`,
          });
        }, 3000);

        // Update user data
        const userResponse = await fetch('/api/user/profile');
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          updateUser(updatedUser);
        }
      } else {
        toast({
          title: "操作失败",
          description: data.message,
          variant: "destructive"
        });
        setWheelSpinning(false);
      }
    } catch (error) {
      toast({
        title: "网络错误",
        description: "请稍后重试",
        variant: "destructive"
      });
      setWheelSpinning(false);
    }
  };

  const handleDailyCheckin = async () => {
    if (dailyCheckedIn) {
      toast({
        title: "今日已签到",
        description: "明天再来签到吧！",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/lottery/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        setDailyCheckedIn(true);
        localStorage.setItem('lastCheckin', new Date().toDateString());
        
        toast({
          title: "✅ 签到成功",
          description: `获得 $${data.amount} 和 ${data.xp} XP！`,
        });

        // Update user data
        const userResponse = await fetch('/api/user/profile');
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          updateUser(updatedUser);
        }
      } else {
        toast({
          title: "签到失败",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "网络错误",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };

  const resetScratchCard = () => {
    setScratchCard(null);
    setIsScratching(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="lottery-card p-6 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-dice mr-3"></i>
          美国幸运大转盘
        </h1>
        <p className="opacity-90">试试你的运气，赢取丰厚奖励！</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-trophy mr-1"></i>
            <span>今日大奖: $10,000</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-users mr-1"></i>
            <span>参与人数: 24,573</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-gift mr-1"></i>
            <span>中奖率: 75%</span>
          </div>
        </div>
      </div>

      {/* User Balance */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-bold text-green-800">账户余额</h3>
                <p className="text-green-700">当前可用资金</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-800">${user?.balance?.toLocaleString()}</div>
              <div className="text-sm text-green-600">美元</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Lottery Games */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scratch Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">🎰</div>
            <CardTitle>刮刮乐</CardTitle>
            <p className="text-sm text-muted-foreground">最高奖金 $1,000</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {!scratchCard && !isScratching && (
              <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg border-4 border-yellow-400 border-dashed">
                <div className="text-4xl mb-2">?</div>
                <p className="text-sm text-yellow-800">点击购买刮刮乐</p>
                <p className="text-xs text-yellow-600">只需 $5</p>
              </div>
            )}

            {isScratching && (
              <div className="p-6 bg-gradient-to-br from-silver to-gray-200 rounded-lg border-4 border-gray-400">
                <div className="text-4xl mb-2 animate-pulse">⏳</div>
                <p className="text-sm">正在刮开...</p>
                <Progress value={66} className="mt-2" />
              </div>
            )}

            {scratchCard && !isScratching && (
              <div className={`p-6 rounded-lg border-4 ${
                scratchCard.won 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400' 
                  : 'bg-gradient-to-br from-red-100 to-red-200 border-red-400'
              }`}>
                <div className="text-4xl mb-2">
                  {scratchCard.won ? '🎉' : '😢'}
                </div>
                <p className="text-lg font-bold">
                  {scratchCard.prize}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={resetScratchCard}
                  data-testid="button-reset-scratch"
                >
                  再来一张
                </Button>
              </div>
            )}

            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleScratchLottery}
              disabled={isScratching || (user?.balance || 0) < 5}
              data-testid="button-buy-scratch"
            >
              {isScratching ? '刮开中...' : '$5 购买'}
            </Button>
          </CardContent>
        </Card>

        {/* Lucky Wheel */}
        <Card className="relative overflow-hidden">
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">🎲</div>
            <CardTitle>幸运转盘</CardTitle>
            <p className="text-sm text-muted-foreground">每日免费一次</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative">
              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400 flex items-center justify-center text-4xl ${
                wheelSpinning ? 'animate-spin-wheel' : ''
              }`}>
                🎯
              </div>
              {wheelResult && !wheelSpinning && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border">
                  <span className="text-sm font-bold text-primary">{wheelResult.text}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="bg-red-100 p-2 rounded">$100</div>
              <div className="bg-yellow-100 p-2 rounded">$50</div>
              <div className="bg-blue-100 p-2 rounded">$25</div>
              <div className="bg-green-100 p-2 rounded">$10</div>
              <div className="bg-purple-100 p-2 rounded">$5</div>
              <div className="bg-gray-100 p-2 rounded">10 XP</div>
            </div>

            <Button 
              className="w-full bg-secondary hover:bg-secondary/90"
              onClick={handleWheelSpin}
              disabled={wheelSpinning}
              data-testid="button-spin-wheel"
            >
              {wheelSpinning ? '转动中...' : '免费转动'}
            </Button>
          </CardContent>
        </Card>

        {/* Daily Check-in */}
        <Card className="relative overflow-hidden">
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">📅</div>
            <CardTitle>每日签到</CardTitle>
            <p className="text-sm text-muted-foreground">连续签到获得更多奖励</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-7 gap-1">
              {[1,2,3,4,5,6,7].map((day) => (
                <div key={day} className={`p-2 rounded text-xs ${
                  day <= 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className="font-bold">第{day}天</div>
                  <div>${day * 10}</div>
                  {day <= 3 && <div className="text-xs">✓</div>}
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
              <div className="text-2xl mb-1">
                {dailyCheckedIn ? '✅' : '🎁'}
              </div>
              <p className="text-sm font-medium text-blue-800">
                {dailyCheckedIn ? '今日已签到' : '今日奖励: $20 + 15 XP'}
              </p>
            </div>

            <Button 
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={handleDailyCheckin}
              disabled={dailyCheckedIn}
              data-testid="button-daily-checkin"
            >
              {dailyCheckedIn ? '已签到' : '签到领取'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lottery History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-history mr-2 text-primary"></i>
            中奖记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '2分钟前', game: '刮刮乐', result: '中奖 $50', amount: '+$50', color: 'text-green-600' },
              { time: '1小时前', game: '转盘', result: '获得 10 XP', amount: '+10 XP', color: 'text-blue-600' },
              { time: '昨天', game: '签到', result: '每日奖励', amount: '+$20', color: 'text-green-600' },
              { time: '2天前', game: '刮刮乐', result: '谢谢参与', amount: '-$5', color: 'text-red-600' }
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {record.game === '刮刮乐' ? '🎰' : record.game === '转盘' ? '🎲' : '📅'}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{record.result}</div>
                    <div className="text-xs text-muted-foreground">{record.time} • {record.game}</div>
                  </div>
                </div>
                <div className={`font-bold ${record.color}`}>
                  {record.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Jackpot */}
      <Card className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="text-xl font-bold text-yellow-800">本周大奖池</h3>
                <p className="text-yellow-700">累积奖金等你来拿</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-yellow-800">$125,847</div>
              <div className="text-sm text-yellow-600">开奖倒计时: 3天2小时</div>
              <Button className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                购买彩票 $10
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-info-circle mr-2 text-primary"></i>
            游戏规则
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold flex items-center">
                <i className="fas fa-ticket-alt mr-2 text-red-500"></i>
                刮刮乐
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 每张彩票 $5</li>
                <li>• 最高奖金 $1,000</li>
                <li>• 中奖率约 30%</li>
                <li>• 即买即开即兑</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold flex items-center">
                <i className="fas fa-dice mr-2 text-blue-500"></i>
                幸运转盘
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 每日免费一次</li>
                <li>• 6种不同奖励</li>
                <li>• 100% 中奖率</li>
                <li>• 最高 $100 奖励</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold flex items-center">
                <i className="fas fa-calendar-check mr-2 text-green-500"></i>
                每日签到
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 每日免费奖励</li>
                <li>• 连续签到翻倍</li>
                <li>• 基础奖励 $20</li>
                <li>• 额外经验值奖励</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
