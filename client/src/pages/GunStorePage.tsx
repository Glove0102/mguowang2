import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function GunStorePage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const { toast } = useToast();

  const { data: gunsData, isLoading } = useQuery({
    queryKey: ['/api/guns'],
    queryFn: async () => {
      const response = await fetch('/api/guns');
      if (!response.ok) throw new Error('获取枪械数据失败');
      return response.json();
    }
  });

  const products = gunsData?.products || [];
  const categories = ['全部', '手枪', '步枪', '霰弹枪', '配件', '弹药'];

  const filteredProducts = selectedCategory === '全部' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handlePurchase = (productName: string, price: number) => {
    toast({
      title: "购买确认",
      description: `${productName} 已添加到购物车，价格 $${price}`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-crosshairs mr-3"></i>
          美国枪械专营店
        </h1>
        <p className="opacity-90">合法持枪，保护家园 - 严格遵守联邦法律</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-shield-alt mr-1"></i>
            <span>FFL持证经销商</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-truck mr-1"></i>
            <span>全美配送</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-certificate mr-1"></i>
            <span>原厂授权</span>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl text-amber-600">⚠️</div>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">法律声明</h3>
              <p className="text-sm text-amber-700">
                所有枪械销售严格遵守联邦、州和地方法律。购买前需通过背景调查，年满21岁，无犯罪记录。请确保您具备合法持枪资格。
              </p>
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

      {/* Featured Deal */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h3 className="font-bold text-xl text-green-800">限时特惠</h3>
                <p className="text-green-700">全场枪械配件8折优惠，免费送货</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">20% OFF</div>
              <div className="text-sm text-green-600">还剩3天</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载枪械数据...</p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
          <Card 
            key={product.id} 
            className="hover:shadow-lg transition-shadow"
            data-testid={`card-product-${product.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{product.image}</div>
                <div className="text-right">
                  {product.hot && (
                    <Badge variant="destructive" className="text-xs mb-1">热销</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" className="text-xs">缺货</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              </div>
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">
                {product.description}
              </p>
              
              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">产品特点：</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {product.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? '' : 'opacity-30'}`}></i>
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews} 评价)</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary">${product.price}</div>
                  {product.originalPrice > product.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {product.originalPrice > product.price && (
                    <div className="text-sm text-green-600 font-medium">
                      省 ${product.originalPrice - product.price}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <Button 
                className={`w-full ${product.inStock ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400'}`}
                disabled={!product.inStock}
                onClick={() => handlePurchase(product.name, product.price)}
                data-testid={`button-purchase-${product.id}`}
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                {product.inStock ? '立即购买' : '暂时缺货'}
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Store Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-red-600">
              <i className="fas fa-crosshairs"></i>
            </div>
            <div className="font-bold text-lg">2,847</div>
            <div className="text-xs text-muted-foreground">在售商品</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-green-600">
              <i className="fas fa-users"></i>
            </div>
            <div className="font-bold text-lg">45,293</div>
            <div className="text-xs text-muted-foreground">满意客户</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-blue-600">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="font-bold text-lg">15年</div>
            <div className="text-xs text-muted-foreground">经营历史</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-purple-600">
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
