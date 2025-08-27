import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { ServiceCard } from '@/components/ServiceCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Activity } from '@shared/schema';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user, updateUser } = useUser();
  const { toast } = useToast();

  // Fetch recent activities
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const updateUserProgress = async (xpGain: number, dollarGain: number, activityType: string, description: string) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xpGain, dollarGain, activityType, description }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
        
        if (xpGain > 0 || dollarGain > 0) {
          toast({
            title: "奖励获得！",
            description: `获得 ${xpGain > 0 ? `${xpGain} XP` : ''} ${dollarGain > 0 ? `$${dollarGain}` : ''}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  };

  const handleServiceClick = (path: string, xpGain = 10, dollarGain = 5, activityType = '', description = '', requiredLevel = 1) => {
    // Check level requirement for premium services
    if (requiredLevel > 1 && user && user.level < requiredLevel) {
      toast({
        title: "功能锁定",
        description: "此功能需要2级解锁",
        variant: "destructive"
      });
      return;
    }

    if (activityType && description) {
      updateUserProgress(xpGain, dollarGain, activityType, description);
    }
    setLocation(path);
  };

  const handleLotteryAction = async (type: 'scratch' | 'wheel' | 'checkin') => {
    try {
      const response = await fetch(`/api/lottery/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: type === 'scratch' ? '刮刮乐结果' : type === 'wheel' ? '转盘结果' : '签到成功',
          description: data.won ? `恭喜！获得 ${data.text}` : data.text || '签到成功！',
          variant: data.won ? 'default' : 'default',
        });
        
        // Refresh user data
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
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* News Ticker */}
      <div className="bg-red-50 border-y border-red-200 py-2 overflow-hidden">
        <div className="news-ticker whitespace-nowrap text-red-800 font-medium">
          <i className="fas fa-bullhorn mr-2"></i>
          最新消息：美国股市再创新高！| 豪华房产限时优惠！| 私人飞机销售火爆！| 约会网站新会员奖励！
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">欢迎来到美国网</h1>
          <p className="text-primary-foreground/90">您的专属美国生活服务平台</p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <i className="fas fa-fire mr-1"></i>
              <span>活跃用户: 847,293</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-chart-line mr-1"></i>
              <span>今日交易: $12.8M</span>
            </div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <ServiceCard
            icon="fas fa-newspaper"
            title="美国新闻"
            description="每日更新"
            badge="+10 XP/访问"
            badgeColor="green"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            onClick={() => handleServiceClick('/news', 10, 5, 'news_visit', '访问美国新闻')}
            testId="card-news"
          />
          <ServiceCard
            icon="fas fa-crosshairs"
            title="枪械商店"
            description="合法购买"
            badge="热门商品"
            badgeColor="red"
            bgColor="bg-red-100"
            iconColor="text-red-600"
            onClick={() => handleServiceClick('/gun-store', 15, 10, 'gun_store_visit', '访问枪械商店')}
            testId="card-gun-store"
          />
          <ServiceCard
            icon="fas fa-home"
            title="房产销售"
            description="豪华住宅"
            badge="投资机会"
            badgeColor="green"
            bgColor="bg-green-100"
            iconColor="text-green-600"
            onClick={() => handleServiceClick('/real-estate', 20, 15, 'real_estate_visit', '访问房产销售')}
            testId="card-real-estate"
          />
          <ServiceCard
            icon="fas fa-plane"
            title="私人飞机"
            description="奢华出行"
            badge="VIP专享"
            badgeColor="purple"
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            onClick={() => handleServiceClick('/aircraft', 25, 20, 'aircraft_visit', '访问私人飞机')}
            testId="card-aircraft"
          />
          <ServiceCard
            icon="fas fa-laugh"
            title="Jokes & Videos"
            description="欢乐时光"
            badge="免费娱乐"
            badgeColor="orange"
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
            onClick={() => handleServiceClick('/fun', 5, 2, 'fun_visit', '访问娱乐频道')}
            testId="card-fun"
          />
          <ServiceCard
            icon="fas fa-car"
            title="Car & Truck Showroom"
            description="经典美车"
            badge="收藏级"
            badgeColor="blue"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            onClick={() => handleServiceClick('/vehicles', 15, 10, 'vehicles_visit', '访问汽车展厅')}
            testId="card-vehicles"
          />
          <ServiceCard
            icon="fas fa-cloud-sun"
            title="天气中心"
            description="实时天气"
            badge="精准预报"
            badgeColor="cyan"
            bgColor="bg-cyan-100"
            iconColor="text-cyan-600"
            onClick={() => handleServiceClick('/weather', 8, 3, 'weather_visit', '访问天气中心')}
            testId="card-weather"
          />
          <ServiceCard
            icon="fas fa-flag-usa"
            title="美国节庆"
            description="传统庆典"
            badge="文化体验"
            badgeColor="red"
            bgColor="bg-red-100"
            iconColor="text-red-600"
            onClick={() => handleServiceClick('/festivals', 12, 8, 'festivals_visit', '访问美国节庆')}
            testId="card-festivals"
          />
        </div>

        {/* Interactive Games Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2" data-testid="text-games-title">
              🎮 互动游戏区
            </h2>
            <p className="text-muted-foreground">参与游戏赢取奖励，提升等级解锁更多功能</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ServiceCard
              icon="fas fa-football-ball"
              title="Sports Betting"
              description="体育博彩"
              badge="高奖励"
              badgeColor="green"
              bgColor="bg-green-100"
              iconColor="text-green-600"
              onClick={() => handleServiceClick('/betting', 20, 15, 'betting_visit', '访问体育博彩')}
              testId="card-betting"
            />
            <ServiceCard
              icon="fas fa-truck"
              title="Truck Driving Simulator"
              description="卡车驾驶"
              badge="点击游戏"
              badgeColor="blue"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
              onClick={() => handleServiceClick('/trucking', 10, 5, 'trucking_visit', '访问卡车驾驶')}
              testId="card-trucking"
            />
          </div>
        </div>

        {/* Premium Services (Level-Locked) */}
        <div className="bg-gradient-to-r from-secondary to-yellow-400 p-6 rounded-xl text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-crown mr-2"></i>
            高级服务 (等级{user?.level}已解锁)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleServiceClick('/dating', 30, 25, 'dating_visit', '访问美女约会', 2)}
              data-testid="card-dating"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-pink-500 p-3 rounded-full">
                  <i className="fas fa-heart text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold">美女约会</h3>
                  <p className="text-sm opacity-90">寻找你的真爱</p>
                  <div className="text-xs mt-1 bg-pink-500 px-2 py-1 rounded">3,247在线</div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleServiceClick('/creators', 25, 20, 'creators_visit', '访问创作者粉丝页面', 2)}
              data-testid="card-creators"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-3 rounded-full">
                  <i className="fas fa-star text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold">Creator Fan Pages</h3>
                  <p className="text-sm opacity-90">支持你的创作者</p>
                  <div className="text-xs mt-1 bg-purple-500 px-2 py-1 rounded">专属内容</div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleServiceClick('/models', 30, 20, 'models_visit', '访问美女模特', 2)}
              data-testid="card-models"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-3 rounded-full">
                  <i className="fas fa-camera text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold">美女 Models</h3>
                  <p className="text-sm opacity-90">专业模特展示</p>
                  <div className="text-xs mt-1 bg-orange-500 px-2 py-1 rounded">8位在线</div>
                </div>
              </div>
            </div>

            <div 
              className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => handleServiceClick('/stocks', 35, 30, 'stocks_visit', '访问股票交易')}
              data-testid="card-stocks"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-3 rounded-full">
                  <i className="fas fa-chart-line text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-bold">股票交易</h3>
                  <p className="text-sm opacity-90">实时市场数据</p>
                  <div className="text-xs mt-1 bg-green-500 px-2 py-1 rounded">+2.4% 今日</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lottery Section */}
        <div className="lottery-card p-6 rounded-xl text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-dice mr-2"></i>
            每日抽奖
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🎰</div>
              <h3 className="font-bold mb-1">刮刮乐</h3>
              <p className="text-sm opacity-90 mb-3">最高$1000奖金</p>
              <Button 
                className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
                onClick={() => handleLotteryAction('scratch')}
                data-testid="button-scratch-lottery"
              >
                $5 购买
              </Button>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🎲</div>
              <h3 className="font-bold mb-1">幸运转盘</h3>
              <p className="text-sm opacity-90 mb-3">每日免费一次</p>
              <Button 
                className="bg-secondary text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-500 transition-colors"
                onClick={() => handleLotteryAction('wheel')}
                data-testid="button-spin-wheel"
              >
                免费转动
              </Button>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold mb-1">每日签到</h3>
              <p className="text-sm opacity-90 mb-3">连续7天+100$</p>
              <Button 
                className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition-colors"
                onClick={() => handleLotteryAction('checkin')}
                data-testid="button-daily-checkin"
              >
                签到领取
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-clock mr-2 text-primary"></i>
              最近活动
            </h2>
            
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <i className="fas fa-newspaper text-white text-xs"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      获得 +{activity.xpEarned} XP • {new Date(activity.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  {activity.dollarEarned > 0 && (
                    <div className="text-green-600 text-sm font-bold">+${activity.dollarEarned}</div>
                  )}
                </div>
              ))}
              
              {activities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <i className="fas fa-history text-3xl mb-2"></i>
                  <p>暂无活动记录</p>
                  <p className="text-xs">开始探索获得奖励！</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
