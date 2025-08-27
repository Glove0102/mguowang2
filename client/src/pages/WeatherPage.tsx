import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherData {
  id: number;
  city: string;
  state: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

export default function WeatherPage() {
  const { data: weatherData = [], isLoading } = useQuery<WeatherData[]>({
    queryKey: ['/api/weather'],
  });

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'bg-green-500';
    if (uvIndex <= 5) return 'bg-yellow-500';
    if (uvIndex <= 7) return 'bg-orange-500';
    if (uvIndex <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center" data-testid="text-weather-title">
            <i className="fas fa-cloud-sun mr-3"></i>
            美国天气中心
          </h1>
          <p className="text-blue-100 text-lg">实时天气信息 • 精准预报服务</p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <i className="fas fa-satellite mr-2"></i>
              <span>卫星数据更新</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock mr-2"></i>
              <span>每小时更新</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-globe-americas mr-2"></i>
              <span>覆盖全美</span>
            </div>
          </div>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((weather) => (
            <Card key={weather.id} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" data-testid={`card-weather-${weather.city.toLowerCase().replace(' ', '-')}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{weather.city}</h3>
                    <p className="text-sm text-gray-600">{weather.state}</p>
                  </div>
                  <div className="text-4xl">{weather.icon}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Current Temperature */}
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-800 mb-2" data-testid={`text-temperature-${weather.city.toLowerCase().replace(' ', '-')}`}>
                    {weather.temperature}°F
                  </div>
                  <div className="text-lg text-gray-600 mb-2">{weather.condition}</div>
                  <div className="text-sm text-gray-500">
                    Feels like {weather.feelsLike}°F
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 text-sm font-medium">Humidity</div>
                    <div className="text-lg font-bold text-gray-800">{weather.humidity}%</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-green-600 text-sm font-medium">Wind</div>
                    <div className="text-lg font-bold text-gray-800">{weather.windSpeed} mph</div>
                    <div className="text-xs text-gray-500">{weather.windDirection}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-600 text-sm font-medium">UV Index</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="text-lg font-bold text-gray-800">{weather.uvIndex}</div>
                      <Badge className={`text-white text-xs ${getUVIndexColor(weather.uvIndex)}`}>
                        {getUVIndexLabel(weather.uvIndex)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-600 text-sm font-medium">Visibility</div>
                    <div className="text-lg font-bold text-gray-800">{weather.visibility} mi</div>
                  </div>
                </div>

                {/* Pressure */}
                <div className="text-center p-3 bg-gray-50 rounded-lg mb-6">
                  <div className="text-gray-600 text-sm font-medium">Atmospheric Pressure</div>
                  <div className="text-lg font-bold text-gray-800">{weather.pressure} inHg</div>
                </div>

                {/* 3-Day Forecast */}
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">3-Day Forecast</h4>
                  <div className="space-y-2">
                    {weather.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{day.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{day.day}</div>
                            <div className="text-xs text-gray-600">{day.condition}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-800">{day.high}°</div>
                          <div className="text-xs text-gray-500">{day.low}°</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weather Alerts Section */}
        <div className="mt-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Weather Alerts & Advisories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-orange-100 border-l-4 border-orange-500 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-orange-800">Heat Advisory</h4>
                      <p className="text-orange-700 text-sm">Miami, FL - High temperatures expected through Friday</p>
                    </div>
                    <Badge className="bg-orange-500">Active</Badge>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 border-l-4 border-blue-500 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-blue-800">Thunderstorm Watch</h4>
                      <p className="text-blue-700 text-sm">Houston, TX - Severe storms possible this afternoon</p>
                    </div>
                    <Badge className="bg-blue-500">Watch</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>数据来源：美国国家气象局 | 更新时间：{new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>
    </div>
  );
}