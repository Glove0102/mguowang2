import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AircraftPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const { toast } = useToast();

  const categories = ['全部', '私人飞机', '商务机', '直升机', '轻型飞机', '豪华客机'];

  const aircraft = [
    {
      id: 1,
      name: 'Gulfstream G650ER',
      category: '私人飞机',
      price: 70000000,
      image: '✈️',
      description: '世界顶级超远程商务机，奢华与性能的完美结合',
      specs: ['航程: 7,500海里', '最高速度: 马赫0.925', '客舱高度: 4,100英尺', '最多乘客: 19人'],
      features: ['全尺寸厨房', '主卧套房', '会议区域', '卫星通信', 'WiFi'],
      year: 2023,
      hours: 150,
      rating: 4.9,
      hot: true,
      certified: true
    },
    {
      id: 2,
      name: 'Bombardier Global 7500',
      category: '商务机',
      price: 72500000,
      image: '✈️',
      description: '超长航程旗舰商务机，四个独立生活区域',
      specs: ['航程: 7,700海里', '最高速度: 马赫0.925', '客舱高度: 4,850英尺', '最多乘客: 17人'],
      features: ['全尺寸床铺', '独立淋浴间', '娱乐套房', '厨师厨房', '24/7管家服务'],
      year: 2022,
      hours: 280,
      rating: 4.8,
      hot: true,
      certified: true
    },
    {
      id: 3,
      name: 'Cessna Citation X+',
      category: '轻型飞机',
      price: 23000000,
      image: '✈️',
      description: '世界最快的民用飞机，极速商务出行',
      specs: ['航程: 3,460海里', '最高速度: 马赫0.935', '客舱高度: 5,800英尺', '最多乘客: 10人'],
      features: ['高速巡航', '先进航电', '舒适座椅', '行李舱', '降噪技术'],
      year: 2021,
      hours: 450,
      rating: 4.7,
      hot: false,
      certified: true
    },
    {
      id: 4,
      name: 'Airbus ACH160',
      category: '直升机',
      price: 17000000,
      image: '🚁',
      description: '最新一代豪华直升机，城市通勤首选',
      specs: ['航程: 460海里', '最高速度: 180节', '客舱容积: 6.8立方米', '最多乘客: 8人'],
      features: ['全景天窗', '降噪技术', '豪华内饰', '双发动机', 'IFR认证'],
      year: 2023,
      hours: 80,
      rating: 4.8,
      hot: false,
      certified: true
    },
    {
      id: 5,
      name: 'Boeing Business Jet MAX',
      category: '豪华客机',
      price: 100000000,
      image: '✈️',
      description: '基于737 MAX的私人客机，私人航空顶级之选',
      specs: ['航程: 6,640海里', '最高速度: 马赫0.82', '客舱面积: 1,025平方英尺', '最多乘客: 25人'],
      features: ['主卧室', '会议室', '娱乐区', '全尺寸厨房', '私人办公室'],
      year: 2023,
      hours: 200,
      rating: 4.9,
      hot: true,
      certified: true
    },
    {
      id: 6,
      name: 'Embraer Phenom 300E',
      category: '轻型飞机',
      price: 9500000,
      image: '✈️',
      description: '轻型喷气机中的佼佼者，经济实用的商务选择',
      specs: ['航程: 2,010海里', '最高速度: 464节', '客舱高度: 4,000英尺', '最多乘客: 9人'],
      features: ['大行李舱', '先进航电', 'LED照明', '快速充电', '经济油耗'],
      year: 2020,
      hours: 680,
      rating: 4.6,
      hot: false,
      certified: true
    }
  ];

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

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAircraft.map((item) => (
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
                  {item.specs.map((spec, index) => (
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
                  {item.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {item.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.features.length - 3} 更多
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
