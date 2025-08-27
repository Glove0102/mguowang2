import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: string;
  name: string;
  year: number;
  type: string;
  description: string;
  image: string;
  price: number;
  engine: string;
  horsepower: number;
  condition: string;
  mileage: number;
  location: string;
}

export default function VehiclesPage() {
  const [filter, setFilter] = useState<'all' | 'car' | 'truck' | 'suv' | 'luxury'>('all');
  
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  const getTypeCategory = (type: string): string => {
    if (type.includes('Muscle Car') || type.includes('Luxury Car')) return 'car';
    if (type.includes('Pickup Truck') || type.includes('Heavy Truck')) return 'truck';
    if (type.includes('SUV')) return 'suv';
    if (type.includes('Luxury')) return 'luxury';
    return 'car';
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    filter === 'all' || getTypeCategory(vehicle.type) === filter
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Car & Truck Showroom</h1>
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Car & Truck Showroom</h1>
        <p className="text-lg text-muted-foreground mt-2">经典美国汽车收藏展厅</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <i className="fas fa-star mr-2 text-yellow-500"></i>
          精选经典美式肌肉车与皮卡
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-6 space-x-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="px-4 mb-2"
          data-testid="filter-all"
        >
          <i className="fas fa-th-large mr-2"></i>
          全部车辆
        </Button>
        <Button
          variant={filter === 'car' ? 'default' : 'outline'}
          onClick={() => setFilter('car')}
          className="px-4 mb-2"
          data-testid="filter-cars"
        >
          <i className="fas fa-car mr-2"></i>
          轿车跑车
        </Button>
        <Button
          variant={filter === 'truck' ? 'default' : 'outline'}
          onClick={() => setFilter('truck')}
          className="px-4 mb-2"
          data-testid="filter-trucks"
        >
          <i className="fas fa-truck mr-2"></i>
          皮卡卡车
        </Button>
        <Button
          variant={filter === 'suv' ? 'default' : 'outline'}
          onClick={() => setFilter('suv')}
          className="px-4 mb-2"
          data-testid="filter-suvs"
        >
          <i className="fas fa-mountain mr-2"></i>
          越野车
        </Button>
        <Button
          variant={filter === 'luxury' ? 'default' : 'outline'}
          onClick={() => setFilter('luxury')}
          className="px-4 mb-2"
          data-testid="filter-luxury"
        >
          <i className="fas fa-gem mr-2"></i>
          豪华车
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card 
            key={vehicle.id} 
            className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
            data-testid={`card-vehicle-${vehicle.id}`}
          >
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{vehicle.image}</div>
              <CardTitle className="text-xl font-bold text-primary">
                {vehicle.name}
              </CardTitle>
              <div className="flex justify-between items-center mb-2">
                <Badge 
                  variant="secondary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {vehicle.year}年
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {vehicle.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {vehicle.description}
              </p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">发动机:</span>
                  <span className="font-medium">{vehicle.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">马力:</span>
                  <span className="font-medium">{vehicle.horsepower} HP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">里程:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} 英里</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">状态:</span>
                  <span className="font-medium text-green-600">{vehicle.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">位置:</span>
                  <span className="font-medium">{vehicle.location}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-primary">
                    ${vehicle.price.toLocaleString()}
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <i className="fas fa-check mr-1"></i>
                    现货可售
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                    data-testid={`button-contact-${vehicle.id}`}
                  >
                    <i className="fas fa-phone mr-2"></i>
                    联系经销商
                  </button>
                  <button 
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md font-medium transition-colors"
                    data-testid={`button-details-${vehicle.id}`}
                  >
                    <i className="fas fa-info-circle mr-2"></i>
                    查看详情
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold mb-2">暂无符合条件的车辆</h3>
          <p className="text-muted-foreground">请尝试其他筛选条件或稍后再来查看</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-2">寻找您的梦想座驾</h2>
          <p className="mb-4">我们提供专业的汽车评估、融资和保险服务</p>
          <div className="space-x-2">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
              <i className="fas fa-calculator mr-2"></i>
              贷款计算
            </button>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
              <i className="fas fa-shield-alt mr-2"></i>
              保险报价
            </button>
            <button className="bg-white text-green-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
              <i className="fas fa-handshake mr-2"></i>
              置换评估
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}