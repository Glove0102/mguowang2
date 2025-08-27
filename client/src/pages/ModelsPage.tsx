import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  images: string[];
  status: string;
  rating: number;
}

export default function ModelsPage() {
  const { data: models = [], isLoading } = useQuery<Model[]>({
    queryKey: ['/api/models'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-8">美女 Models</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">美女 Models</h1>
        <p className="text-lg text-muted-foreground mt-2">专业模特展示平台</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <i className="fas fa-crown mr-2 text-yellow-500"></i>
          高级会员专享服务
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card 
            key={model.id} 
            className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
            data-testid={`card-model-${model.id}`}
          >
            <CardHeader className="text-center">
              <div className="text-6xl mb-4 flex justify-center space-x-2">
                {model.images.map((emoji, index) => (
                  <span key={index}>{emoji}</span>
                ))}
              </div>
              <CardTitle className="text-xl font-bold text-primary">
                {model.name}
              </CardTitle>
              <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
                <span>{model.age}岁</span>
                <span>•</span>
                <span>{model.location}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {model.bio}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <Badge 
                  variant={model.status === '在线' ? 'default' : model.status === '忙碌' ? 'secondary' : 'outline'}
                  className={`${
                    model.status === '在线' ? 'bg-green-500 hover:bg-green-600' : 
                    model.status === '忙碌' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                    'bg-gray-500 hover:bg-gray-600'
                  } text-white`}
                >
                  {model.status}
                </Badge>
                <div className="flex items-center text-sm">
                  <i className="fas fa-star text-yellow-500 mr-1"></i>
                  <span className="font-medium">{model.rating}</span>
                </div>
              </div>

              <button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                data-testid={`button-view-profile-${model.id}`}
              >
                查看详细资料
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {models.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold mb-2">暂无模特信息</h3>
          <p className="text-muted-foreground">请稍后再来查看</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">成为合作伙伴</h2>
          <p className="mb-4">加入我们的专业模特网络，获得更多机会</p>
          <button className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
            申请加入
          </button>
        </div>
      </div>
    </div>
  );
}