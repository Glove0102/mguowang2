import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function NewsPage() {
  const newsArticles = [
    {
      id: 1,
      title: '美国经济持续增长，就业率创历史新高',
      summary: '最新数据显示，美国第三季度GDP增长2.8%，失业率降至3.2%，创下50年来最低纪录。',
      category: '经济',
      time: '2小时前',
      image: '📈',
      hot: true
    },
    {
      id: 2,
      title: '硅谷科技巨头推出革命性AI技术',
      summary: '苹果、谷歌等公司联合发布新一代人工智能平台，预计将改变整个科技行业格局。',
      category: '科技',
      time: '4小时前',
      image: '🤖',
      hot: true
    },
    {
      id: 3,
      title: '美国房地产市场迎来投资热潮',
      summary: '多个州的房价持续上涨，投资者纷纷涌入市场，豪华住宅需求量激增。',
      category: '房产',
      time: '6小时前',
      image: '🏠',
      hot: false
    },
    {
      id: 4,
      title: '华尔街股市再创新高，投资者信心大增',
      summary: '道琼斯指数突破历史记录，纳斯达克科技股强势上涨，市场表现超出预期。',
      category: '金融',
      time: '8小时前',
      image: '💹',
      hot: false
    },
    {
      id: 5,
      title: '美国新能源汽车销量暴涨300%',
      summary: '特斯拉等电动车品牌销量创记录，政府新能源政策推动行业快速发展。',
      category: '汽车',
      time: '10小时前',
      image: '🚗',
      hot: false
    },
    {
      id: 6,
      title: '美国航空业复苏，私人飞机订单激增',
      summary: '疫情后航空业强势反弹，私人飞机制造商订单排期已延至明年年底。',
      category: '航空',
      time: '12小时前',
      image: '✈️',
      hot: false
    }
  ];

  const categories = ['全部', '经济', '科技', '房产', '金融', '汽车', '航空'];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-newspaper mr-3"></i>
          美国新闻中心
        </h1>
        <p className="opacity-90">获取最新最权威的美国资讯</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-clock mr-1"></i>
            <span>实时更新</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-eye mr-1"></i>
            <span>每日浏览: 2.4M</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge 
            key={category}
            variant={category === '全部' ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            data-testid={`badge-category-${category}`}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Hot News Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔥</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="destructive" className="text-xs">热点</Badge>
                <span className="text-sm text-muted-foreground">头条新闻</span>
              </div>
              <h3 className="font-bold text-lg text-red-800">
                突发：美国宣布重大经济刺激计划，预计投入5000亿美元
              </h3>
              <p className="text-sm text-red-700 mt-1">
                总统刚刚宣布史上最大规模经济刺激方案，涉及基础设施、科技创新等多个领域...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((article) => (
          <Card 
            key={article.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            data-testid={`card-news-${article.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{article.image}</div>
                <div className="text-right">
                  {article.hot && (
                    <Badge variant="destructive" className="text-xs mb-1">热</Badge>
                  )}
                  <div className="text-xs text-muted-foreground">{article.time}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {article.summary}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <i className="fas fa-eye mr-1"></i>
                  <span>{Math.floor(Math.random() * 10000 + 1000).toLocaleString()} 阅读</span>
                </div>
                <div className="text-primary text-sm font-medium">
                  阅读全文 →
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          data-testid="button-load-more"
        >
          <i className="fas fa-plus mr-2"></i>
          加载更多新闻
        </button>
      </div>

      {/* News Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-blue-600">
              <i className="fas fa-newspaper"></i>
            </div>
            <div className="font-bold text-lg">1,247</div>
            <div className="text-xs text-muted-foreground">今日新闻</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-green-600">
              <i className="fas fa-eye"></i>
            </div>
            <div className="font-bold text-lg">2.4M</div>
            <div className="text-xs text-muted-foreground">总浏览量</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-yellow-600">
              <i className="fas fa-star"></i>
            </div>
            <div className="font-bold text-lg">4.9</div>
            <div className="text-xs text-muted-foreground">用户评分</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2 text-purple-600">
              <i className="fas fa-users"></i>
            </div>
            <div className="font-bold text-lg">847K</div>
            <div className="text-xs text-muted-foreground">订阅用户</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
