import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function RealEstatePage() {
  const [selectedType, setSelectedType] = useState('全部');
  const { toast } = useToast();

  const { data: housesData, isLoading } = useQuery({
    queryKey: ['/api/houses'],
    queryFn: async () => {
      const response = await fetch('/api/houses');
      if (!response.ok) throw new Error('获取房产数据失败');
      return response.json();
    }
  });

  const properties = housesData?.properties || [];
  const propertyTypes = ['全部', '豪华别墅', '海景房', '市中心公寓', '牧场农庄', '投资物业'];

  const filteredProperties = selectedType === '全部' 
    ? properties 
    : properties.filter(property => property.type === selectedType);

  const handleInquiry = (propertyTitle: string) => {
    toast({
      title: "咨询请求已发送",
      description: `我们的专业经纪人将在24小时内联系您，为您介绍 ${propertyTitle}`,
    });
  };

  const formatPrice = (price: number) => {
    return (price / 1000000).toFixed(1) + 'M';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-home mr-3"></i>
          美国豪华房产
        </h1>
        <p className="opacity-90">投资美国房地产，实现财富增长梦想</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-chart-line mr-1"></i>
            <span>年增值15%</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-globe mr-1"></i>
            <span>全球买家服务</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-handshake mr-1"></i>
            <span>专业经纪团队</span>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">+15.3%</div>
              <div className="text-sm text-blue-600">年增长率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">$2.8M</div>
              <div className="text-sm text-blue-600">平均房价</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">72天</div>
              <div className="text-sm text-blue-600">平均销售周期</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">95%</div>
              <div className="text-sm text-blue-600">客户满意度</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Type Filter */}
      <div className="flex flex-wrap gap-2">
        {propertyTypes.map((type) => (
          <Badge 
            key={type}
            variant={type === selectedType ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            onClick={() => setSelectedType(type)}
            data-testid={`badge-type-${type}`}
          >
            {type}
          </Badge>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载房产数据...</p>
        </div>
      )}

      {/* Properties Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProperties.map((property: any) => (
            <Card 
            key={property.id} 
            className="hover:shadow-xl transition-shadow group"
            data-testid={`card-property-${property.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{property.image}</div>
                <div className="text-right space-y-1">
                  {property.hot && (
                    <Badge variant="destructive" className="text-xs">热门</Badge>
                  )}
                  {property.virtual_tour && (
                    <Badge variant="secondary" className="text-xs block">VR看房</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {property.type}
                </Badge>
              </div>
              
              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                {property.title}
              </CardTitle>
              
              <div className="text-3xl font-bold text-primary mb-2">
                ${formatPrice(property.price)}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {property.address}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {property.description}
              </p>

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-bold">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">卧室</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-bold">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">浴室</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-bold">{property.sqft.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">平方英尺</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">特色配置：</h4>
                <div className="flex flex-wrap gap-1">
                  {property.features?.slice(0, 3).map((feature: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {property.features?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.features?.length - 3} 更多
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleInquiry(property.title)}
                  data-testid={`button-inquiry-${property.id}`}
                >
                  <i className="fas fa-phone mr-2"></i>
                  咨询详情
                </Button>
                {property.virtual_tour && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    data-testid={`button-tour-${property.id}`}
                  >
                    <i className="fas fa-vr-cardboard mr-2"></i>
                    VR看房
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Real Estate Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-concierge-bell mr-2 text-primary"></i>
            专业服务
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-bold mb-1">贷款服务</h3>
              <p className="text-sm text-muted-foreground">低利率贷款，快速审批</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-bold mb-1">法律支持</h3>
              <p className="text-sm text-muted-foreground">专业律师团队全程协助</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="font-bold mb-1">装修管理</h3>
              <p className="text-sm text-muted-foreground">一站式装修解决方案</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
