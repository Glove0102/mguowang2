import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DatingMessage } from '@shared/schema';

export default function DatingPage() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ['/api/dating-profiles'],
    queryFn: async () => {
      const response = await fetch('/api/dating-profiles');
      if (!response.ok) throw new Error('获取约会档案失败');
      return response.json();
    }
  });

  const profiles = profilesData?.profiles || [];

  // Get messages for selected profile
  const { data: messages = [] } = useQuery<DatingMessage[]>({
    queryKey: ['/api/dating/messages', selectedProfile?.id],
    enabled: !!selectedProfile?.id,
  });

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedProfile) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/dating/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: selectedProfile.id,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('');
        toast({
          title: "消息已发送",
          description: `${selectedProfile.name} 回复了您的消息`,
        });
        // Invalidate and refetch messages
        queryClient.invalidateQueries({
          queryKey: ['/api/dating/messages', selectedProfile.id]
        });
      }
    } catch (error) {
      toast({
        title: "发送失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleSendGift = (giftName: string, cost: number) => {
    toast({
      title: "礼物已送达",
      description: `您向 ${selectedProfile?.name} 赠送了${giftName}，花费 $${cost}`,
    });
  };

  if (selectedProfile) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Chat Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProfile(null)}
                data-testid="button-back"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                返回
              </Button>
              <div className="text-4xl">{selectedProfile.image}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold">{selectedProfile.name}</h2>
                  {selectedProfile.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <i className="fas fa-check-circle mr-1"></i>
                      已验证
                    </Badge>
                  )}
                  {selectedProfile.online && (
                    <Badge variant="destructive" className="text-xs">在线</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedProfile.age}岁 • {selectedProfile.location} • {selectedProfile.occupation}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-comments mr-2 text-primary"></i>
              聊天记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <i className="fas fa-heart text-3xl mb-2 text-pink-400"></i>
                  <p>开始你们的第一次对话吧！</p>
                </div>
              ) : (
                messages.map((msg, index: number) => (
                  <div
                    key={index}
                    className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.isFromUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('zh-CN') : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入您的消息..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                data-testid="input-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                data-testid="button-send-message"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Gifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-gift mr-2 text-secondary"></i>
              虚拟礼物
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { name: '玫瑰', emoji: '🌹', cost: 5 },
                { name: '巧克力', emoji: '🍫', cost: 10 },
                { name: '香槟', emoji: '🍾', cost: 25 },
                { name: '钻戒', emoji: '💍', cost: 100 },
                { name: '跑车', emoji: '🏎️', cost: 500 },
                { name: '别墅', emoji: '🏰', cost: 1000 }
              ].map((gift) => (
                <div key={gift.name} className="text-center p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <div className="text-2xl mb-1">{gift.emoji}</div>
                  <div className="text-xs font-medium">{gift.name}</div>
                  <div className="text-xs text-muted-foreground">${gift.cost}</div>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleSendGift(gift.name, gift.cost)}
                    data-testid={`button-gift-${gift.name}`}
                  >
                    赠送
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-heart mr-3"></i>
          美女约会平台
        </h1>
        <p className="opacity-90">邂逅美丽的美国女孩，开启浪漫之旅</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-users mr-1"></i>
            <span>3,247人在线</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-heart-broken mr-1"></i>
            <span>真实认证</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-shield-alt mr-1"></i>
            <span>隐私保护</span>
          </div>
        </div>
      </div>

      {/* Online Stats */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">3,247</div>
              <div className="text-sm text-green-600">在线用户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">89%</div>
              <div className="text-sm text-green-600">回复率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">24小时</div>
              <div className="text-sm text-green-600">平均回复时间</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">15,847</div>
              <div className="text-sm text-green-600">成功配对</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">👑</div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-800">VIP会员特权</h3>
              <p className="text-sm text-yellow-700">无限聊天 • 查看谁喜欢你 • VIP专属徽章 • 优先客服</p>
            </div>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              升级VIP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {profilesLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载约会档案...</p>
        </div>
      )}

      {/* Profiles Grid */}
      {!profilesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile: any) => (
          <Card 
            key={profile.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedProfile(profile)}
            data-testid={`card-profile-${profile.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{profile.image}</div>
                <div className="text-right space-y-1">
                  {profile.online && (
                    <Badge variant="destructive" className="text-xs">在线</Badge>
                  )}
                  {profile.verified && (
                    <Badge variant="secondary" className="text-xs block">已验证</Badge>
                  )}
                  {profile.premium && (
                    <Badge className="text-xs block bg-yellow-500">VIP</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                {profile.name}, {profile.age}
              </CardTitle>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {profile.location}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <i className="fas fa-briefcase mr-1"></i>
                {profile.occupation}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {profile.description}
              </p>

              {/* Interests */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">兴趣爱好：</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.interests?.slice(0, 3).map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {profile.interests?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.interests?.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProfile(profile);
                  }}
                  data-testid={`button-chat-${profile.id}`}
                >
                  <i className="fas fa-comment mr-2"></i>
                  开始聊天
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "已添加关注",
                      description: `您关注了 ${profile.name}`,
                    });
                  }}
                  data-testid={`button-like-${profile.id}`}
                >
                  <i className="fas fa-heart text-pink-500"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-pink-600">
              <i className="fas fa-heart"></i>
            </div>
            <div className="font-bold text-lg">15,847</div>
            <div className="text-xs text-muted-foreground">成功配对</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-green-600">
              <i className="fas fa-users"></i>
            </div>
            <div className="font-bold text-lg">89,247</div>
            <div className="text-xs text-muted-foreground">注册用户</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-blue-600">
              <i className="fas fa-comments"></i>
            </div>
            <div className="font-bold text-lg">2.4M</div>
            <div className="text-xs text-muted-foreground">月活跃对话</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-purple-600">
              <i className="fas fa-star"></i>
            </div>
            <div className="font-bold text-lg">4.8</div>
            <div className="text-xs text-muted-foreground">用户评分</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
