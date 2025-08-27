import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface Festival {
  id: number;
  name: string;
  location: string;
  date: string;
  endDate: string;
  description: string;
  icon: string;
  category: string;
  ticketPrice: number;
  attendance: string;
  featured: boolean;
  activities: string[];
  image: string;
}

export default function FestivalsPage() {
  const { data: festivals = [], isLoading } = useQuery<Festival[]>({
    queryKey: ['/api/festivals'],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Rodeo': 'bg-orange-500',
      'County Fair': 'bg-green-500',
      'Music Festival': 'bg-purple-500',
      'Food Festival': 'bg-red-500',
      'Traditional Dance': 'bg-blue-500',
      'Motorcycle Rally': 'bg-black',
      'Historical Festival': 'bg-amber-600'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featuredFestivals = festivals.filter(festival => festival.featured);
  const regularFestivals = festivals.filter(festival => !festival.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center" data-testid="text-festivals-title">
            <i className="fas fa-flag-usa mr-3"></i>
            美国节庆盛典
          </h1>
          <p className="text-red-100 text-lg">体验正宗美国文化 • 传统节庆活动</p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <i className="fas fa-calendar-alt mr-2"></i>
              <span>全年活动</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-map-marked-alt mr-2"></i>
              <span>全美各地</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-users mr-2"></i>
              <span>家庭友好</span>
            </div>
          </div>
        </div>

        {/* Featured Festivals */}
        {featuredFestivals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-star mr-2 text-yellow-400"></i>
              精选节庆活动
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFestivals.map((festival) => (
                <Card key={festival.id} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-yellow-400" data-testid={`card-festival-featured-${festival.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{festival.icon}</div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                            {festival.name}
                          </CardTitle>
                          <Badge className={`text-white text-xs mt-1 ${getCategoryColor(festival.category)}`}>
                            {festival.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500 text-white">FEATURED</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Location and Date */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{festival.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{getDateRange(festival.date, festival.endDate)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{festival.description}</p>

                    {/* Activities */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">主要活动:</h4>
                      <div className="flex flex-wrap gap-1">
                        {festival.activities.slice(0, 3).map((activity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                        {festival.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{festival.activities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="flex items-center justify-center text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="text-lg font-bold">${festival.ticketPrice}</span>
                        </div>
                        <div className="text-xs text-gray-600">门票价格</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="flex items-center justify-center text-blue-600">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-lg font-bold">{festival.attendance}</span>
                        </div>
                        <div className="text-xs text-gray-600">预计参与人数</div>
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90" data-testid={`button-buy-tickets-${festival.id}`}>
                      购买门票
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Festivals */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-calendar-week mr-2"></i>
            所有节庆活动
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularFestivals.map((festival) => (
              <Card key={festival.id} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" data-testid={`card-festival-${festival.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{festival.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                        {festival.name}
                      </CardTitle>
                      <Badge className={`text-white text-xs mt-1 ${getCategoryColor(festival.category)}`}>
                        {festival.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Location and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{festival.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{getDateRange(festival.date, festival.endDate)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{festival.description}</p>

                  {/* Activities */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">主要活动:</h4>
                    <div className="flex flex-wrap gap-1">
                      {festival.activities.slice(0, 2).map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {festival.activities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{festival.activities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="flex items-center justify-center text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-lg font-bold">${festival.ticketPrice}</span>
                      </div>
                      <div className="text-xs text-gray-600">门票价格</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="flex items-center justify-center text-blue-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-lg font-bold">{festival.attendance}</span>
                      </div>
                      <div className="text-xs text-gray-600">预计参与人数</div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90" data-testid={`button-buy-tickets-${festival.id}`}>
                    购买门票
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Festival Categories Filter */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">节庆类别</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from(new Set(festivals.map(f => f.category))).map((category) => (
              <div key={category} className="text-center">
                <Badge className={`${getCategoryColor(category)} text-white mb-2 block`}>
                  {category}
                </Badge>
                <span className="text-white text-xs">
                  {festivals.filter(f => f.category === category).length} 活动
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>体验真正的美国文化 | 门票现在开售 | 客服热线: 1-800-USA-FEST</p>
        </div>
      </div>
    </div>
  );
}