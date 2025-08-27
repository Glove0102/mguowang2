import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function AircraftPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const { toast } = useToast();

  const { data: aircraftData, isLoading } = useQuery({
    queryKey: ['/api/aircraft'],
    queryFn: async () => {
      const response = await fetch('/api/aircraft');
      if (!response.ok) throw new Error('获取飞机数据失败');
      return response.json();
    }
  });

  const aircraft = aircraftData?.aircraft || [];
  const categories = ['全部', '私人飞机', '商务机', '直升机', '轻型飞机', '豪华客机'];

  const filteredAircraft = selectedCategory === '全部' 
    ? aircraft 
    : aircraft.filter(item => item.category === selectedCategory);

  const handleInquiry = (aircraftName: string, price: number) => {
    toast({
      title: "咨询请求已发送",
      description: `我们的航空专家将在2小时内联系您，为您介绍 ${aircraftName}`,
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-plane mr-3"></i>
          美国私人航空
        </h1>
        <p className="opacity-90">享受至尊飞行体验，翱翔天际的奢华选择</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-certificate mr-1"></i>
            <span>FAA认证</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-tools mr-1"></i>
            <span>全球维护</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-headset mr-1"></i>
            <span>24/7支持</span>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-blue-800 mb-4 flex items-center">
            <i className="fas fa-chart-line mr-2"></i>
            私人航空市场动态
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">+12.5%</div>
              <div className="text-sm text-blue-600">年增长率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">2,847</div>
              <div className="text-sm text-blue-600">在售飞机</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">45天</div>
              <div className="text-sm text-blue-600">平均交易周期</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">$45M</div>
              <div className="text-sm text-blue-600">平均成交价</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge 
            key={category}
            variant={category === selectedCategory ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            onClick={() => setSelectedCategory(category)}
            data-testid={`badge-category-${category}`}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Featured Aircraft */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="font-bold text-xl text-yellow-800">本月特推</h3>
                <p className="text-yellow-700">Gulfstream G650ER - 全球最受欢迎的超远程商务机</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-800">现货</div>
              <div className="text-sm text-yellow-600">立即交付</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载飞机数据...</p>
        </div>
      )}

      {/* Aircraft Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAircraft.map((item: any) => (
          <Card 
            key={item.id} 
            className="hover:shadow-xl transition-shadow group"
            data-testid={`card-aircraft-${item.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{item.image}</div>
                <div className="text-right space-y-1">
                  {item.hot && (
                    <Badge variant="destructive" className="text-xs">热门</Badge>
                  )}
                  {item.certified && (
                    <Badge variant="secondary" className="text-xs block">FAA认证</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              
              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                {item.name}
              </CardTitle>
              
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(item.price)}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center">
                  <i className="fas fa-calendar mr-1"></i>
                  {item.year}年
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock mr-1"></i>
                  {item.hours}小时
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>

              {/* Specifications */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">技术规格：</h4>
                <div className="space-y-1">
                  {item.specs?.map((spec: string, index: number) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center">
                      <i className="fas fa-cog text-primary mr-2"></i>
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">奢华配置：</h4>
                <div className="flex flex-wrap gap-1">
                  {item.features?.slice(0, 3).map((feature: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {item.features?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.features?.length - 3} 更多
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(item.rating) ? '' : 'opacity-30'}`}></i>
                  ))}
                </div>
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-xs text-muted-foreground">(专业评级)</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleInquiry(item.name, item.price)}
                  data-testid={`button-inquiry-${item.id}`}
                >
                  <i className="fas fa-phone mr-2"></i>
                  预约试飞
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  data-testid={`button-details-${item.id}`}
                >
                  <i className="fas fa-info-circle mr-2"></i>
                  详细资料
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Aviation Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-concierge-bell mr-2 text-primary"></i>
            专业航空服务
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="font-bold mb-1">维护服务</h3>
              <p className="text-sm text-muted-foreground">全球维护网络支持</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">✈️</div>
              <h3 className="font-bold mb-1">飞行培训</h3>
              <p className="text-sm text-muted-foreground">专业飞行员培训课程</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="font-bold mb-1">机库租赁</h3>
              <p className="text-sm text-muted-foreground">全美机库设施租赁</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-bold mb-1">法规咨询</h3>
              <p className="text-sm text-muted-foreground">FAA法规专业咨询</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-purple-600">
              <i className="fas fa-plane"></i>
            </div>
            <div className="font-bold text-lg">2,847</div>
            <div className="text-xs text-muted-foreground">在售飞机</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-green-600">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="font-bold text-lg">1,293</div>
            <div className="text-xs text-muted-foreground">成功交易</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-blue-600">
              <i className="fas fa-users"></i>
            </div>
            <div className="font-bold text-lg">15,847</div>
            <div className="text-xs text-muted-foreground">注册买家</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-yellow-600">
              <i className="fas fa-star"></i>
            </div>
            <div className="font-bold text-lg">4.9</div>
            <div className="text-xs text-muted-foreground">客户评分</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
