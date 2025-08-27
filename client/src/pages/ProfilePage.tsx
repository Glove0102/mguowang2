import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ProfilePage() {
  const { user, logout } = useUser();

  if (!user) return null;

  const getXpForLevel = (level: number) => {
    const thresholds = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000 };
    return thresholds[level as keyof typeof thresholds] || 1000;
  };

  const getCurrentLevelXp = () => {
    if (user.level === 5) return user.xp;
    const currentThreshold = getXpForLevel(user.level);
    return user.xp - currentThreshold;
  };

  const getXpForNextLevel = () => {
    if (user.level === 5) return 1000;
    const currentThreshold = getXpForLevel(user.level);
    const nextThreshold = getXpForLevel(user.level + 1);
    return nextThreshold - currentThreshold;
  };

  const progressPercentage = user.level === 5 ? 100 : (getCurrentLevelXp() / getXpForNextLevel()) * 100;

  const levelBenefits = {
    1: ['基础服务访问'],
    2: ['美女约会解锁', '高级新闻'],
    3: ['股票交易', '房产投资', '私人飞机'],
    4: ['VIP客服', '专属活动'],
    5: ['所有服务', '最高奖励']
  };

  const stats = [
    { label: '账户余额', value: `$${user.balance.toLocaleString()}`, icon: 'fas fa-dollar-sign', color: 'text-green-600' },
    { label: '经验值', value: `${user.xp} XP`, icon: 'fas fa-star', color: 'text-yellow-600' },
    { label: '当前等级', value: `等级 ${user.level}`, icon: 'fas fa-trophy', color: 'text-purple-600' },
    { label: '注册时间', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知', icon: 'fas fa-calendar', color: 'text-blue-600' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user text-4xl text-white"></i>
          </div>
          <CardTitle className="text-2xl">{user.username}</CardTitle>
          <p className="text-muted-foreground">美国网高级会员</p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl mb-2 ${stat.color}`}>
                <i className={stat.icon}></i>
              </div>
              <div className="font-bold text-lg" data-testid={`text-${stat.label}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-chart-line mr-2 text-primary"></i>
            等级进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">等级 {user.level}</span>
              <span className="text-sm text-muted-foreground">
                {user.level === 5 ? '已达最高等级' : `距离等级 ${user.level + 1}: ${getXpForNextLevel() - getCurrentLevelXp()} XP`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {getCurrentLevelXp()} / {getXpForNextLevel()} XP
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-crown mr-2 text-secondary"></i>
            等级特权
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(levelBenefits).map(([level, benefits]) => (
              <div 
                key={level}
                className={`p-4 rounded-lg border-2 ${
                  parseInt(level) <= user.level 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted bg-muted/50'
                }`}
              >
                <div className={`font-bold mb-2 ${
                  parseInt(level) <= user.level ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  等级 {level}
                </div>
                <ul className="text-sm space-y-1">
                  {benefits.map((benefit, index) => (
                    <li key={index} className={
                      parseInt(level) <= user.level ? 'text-foreground' : 'text-muted-foreground'
                    }>
                      {parseInt(level) <= user.level ? '✅' : '🔒'} {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-cog mr-2 text-muted-foreground"></i>
            账户设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">账户安全</div>
                <div className="text-sm text-muted-foreground">密码保护已启用</div>
              </div>
              <i className="fas fa-shield-alt text-green-600 text-xl"></i>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-medium">消息通知</div>
                <div className="text-sm text-muted-foreground">接收重要更新</div>
              </div>
              <i className="fas fa-bell text-blue-600 text-xl"></i>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={logout}
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              退出登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
