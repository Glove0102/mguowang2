import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FunContent {
  id: string;
  type: 'joke' | 'video';
  title: string;
  content: string;
  category: string;
  likes?: number;
  thumbnail?: string;
  duration?: string;
  views?: number;
  createdAt: string;
}

export default function FunPage() {
  const [filter, setFilter] = useState<'all' | 'joke' | 'video'>('all');
  
  const { data: funContent = [], isLoading } = useQuery<FunContent[]>({
    queryKey: ['/api/fun'],
  });

  const filteredContent = funContent.filter(item => 
    filter === 'all' || item.type === filter
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Jokes & Funny Videos</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Jokes & Funny Videos</h1>
        <p className="text-lg text-muted-foreground mt-2">欢乐时光，笑声不断</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <i className="fas fa-laugh mr-2 text-yellow-500"></i>
          为您带来最新最搞笑的内容
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-6 space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="px-6"
          data-testid="filter-all"
        >
          <i className="fas fa-th-large mr-2"></i>
          全部
        </Button>
        <Button
          variant={filter === 'joke' ? 'default' : 'outline'}
          onClick={() => setFilter('joke')}
          className="px-6"
          data-testid="filter-jokes"
        >
          <i className="fas fa-comment-dots mr-2"></i>
          笑话
        </Button>
        <Button
          variant={filter === 'video' ? 'default' : 'outline'}
          onClick={() => setFilter('video')}
          className="px-6"
          data-testid="filter-videos"
        >
          <i className="fas fa-play mr-2"></i>
          视频
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card 
            key={item.id} 
            className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
            data-testid={`card-${item.type}-${item.id}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge 
                  variant={item.type === 'joke' ? 'default' : 'secondary'}
                  className={`${
                    item.type === 'joke' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {item.type === 'joke' ? (
                    <><i className="fas fa-comment-dots mr-1"></i>笑话</>
                  ) : (
                    <><i className="fas fa-play mr-1"></i>视频</>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              
              <CardTitle className="text-lg font-bold text-primary line-clamp-2">
                {item.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {item.type === 'joke' ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <i className="fas fa-thumbs-up mr-1 text-blue-500"></i>
                      <span>{item.likes?.toLocaleString()} 赞</span>
                    </div>
                    <button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-xs font-medium transition-colors"
                      data-testid={`button-like-${item.id}`}
                    >
                      <i className="fas fa-thumbs-up mr-1"></i>
                      点赞
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">{item.thumbnail}</div>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs inline-block">
                      <i className="fas fa-clock mr-1"></i>
                      {item.duration}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        <i className="fas fa-eye mr-1"></i>
                        {item.views?.toLocaleString()} 观看
                      </span>
                      <span>
                        <i className="fas fa-calendar mr-1"></i>
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors"
                    data-testid={`button-play-${item.id}`}
                  >
                    <i className="fas fa-play mr-2"></i>
                    播放视频
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {filter === 'joke' ? '😄' : filter === 'video' ? '📹' : '🎭'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {filter === 'all' ? '暂无内容' : 
             filter === 'joke' ? '暂无笑话' : '暂无视频'}
          </h3>
          <p className="text-muted-foreground">请稍后再来查看更多精彩内容</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-2">分享你的快乐</h2>
          <p className="mb-4">上传你的搞笑视频或分享有趣笑话</p>
          <div className="space-x-2">
            <button className="bg-white text-orange-500 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
              <i className="fas fa-upload mr-2"></i>
              上传视频
            </button>
            <button className="bg-white text-pink-500 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
              <i className="fas fa-pen mr-2"></i>
              投稿笑话
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}