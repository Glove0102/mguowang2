import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function StockTradingPage() {
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const { toast } = useToast();

  const stocks = [
    {
      symbol: 'AAPL',
      name: '苹果公司',
      price: 175.43,
      change: +2.18,
      changePercent: +1.26,
      volume: '45.2M',
      marketCap: '2.8T',
      sector: '科技',
      trending: 'up'
    },
    {
      symbol: 'GOOGL',
      name: '谷歌',
      price: 138.21,
      change: +3.45,
      changePercent: +2.56,
      volume: '28.7M',
      marketCap: '1.7T',
      sector: '科技',
      trending: 'up'
    },
    {
      symbol: 'TSLA',
      name: '特斯拉',
      price: 242.65,
      change: -5.32,
      changePercent: -2.14,
      volume: '89.4M',
      marketCap: '771B',
      sector: '汽车',
      trending: 'down'
    },
    {
      symbol: 'AMZN',
      name: '亚马逊',
      price: 152.89,
      change: +1.87,
      changePercent: +1.24,
      volume: '31.6M',
      marketCap: '1.6T',
      sector: '电商',
      trending: 'up'
    },
    {
      symbol: 'MSFT',
      name: '微软',
      price: 378.85,
      change: +4.21,
      changePercent: +1.12,
      volume: '24.3M',
      marketCap: '2.8T',
      sector: '科技',
      trending: 'up'
    },
    {
      symbol: 'NVDA',
      name: '英伟达',
      price: 482.39,
      change: +12.47,
      changePercent: +2.65,
      volume: '67.8M',
      marketCap: '1.2T',
      sector: '半导体',
      trending: 'up'
    },
    {
      symbol: 'META',
      name: 'Meta平台',
      price: 326.54,
      change: -2.87,
      changePercent: -0.87,
      volume: '19.7M',
      marketCap: '830B',
      sector: '社交媒体',
      trending: 'down'
    },
    {
      symbol: 'BTC-USD',
      name: '比特币',
      price: 43247.82,
      change: +1247.53,
      changePercent: +2.97,
      volume: '15.3B',
      marketCap: '847B',
      sector: '加密货币',
      trending: 'up'
    }
  ];

  const marketIndices = [
    { name: '道琼斯', value: '34,256.78', change: '+1.45%', color: 'text-green-600' },
    { name: 'S&P 500', value: '4,567.23', change: '+0.89%', color: 'text-green-600' },
    { name: '纳斯达克', value: '14,234.56', change: '+1.23%', color: 'text-green-600' },
    { name: 'VIX恐慌指数', value: '18.45', change: '-2.15%', color: 'text-red-600' }
  ];

  const portfolio = [
    { symbol: 'AAPL', shares: 50, avgPrice: 165.20, currentValue: 8771.50, gain: +515.00 },
    { symbol: 'GOOGL', shares: 25, avgPrice: 125.40, currentValue: 3455.25, gain: +320.00 },
    { symbol: 'TSLA', shares: 20, avgPrice: 255.80, currentValue: 4853.00, gain: -263.00 }
  ];

  const handleTrade = () => {
    if (!selectedStock || !tradeAmount) {
      toast({
        title: "交易失败",
        description: "请选择股票并输入交易数量",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(tradeAmount);
    const totalValue = amount * selectedStock.price;

    toast({
      title: "交易确认",
      description: `${tradeType === 'buy' ? '买入' : '卖出'} ${amount}股 ${selectedStock.symbol}，总价值 $${totalValue.toLocaleString()}`,
    });

    setTradeAmount('');
    setSelectedStock(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <i className="fas fa-chart-line mr-3"></i>
          美股实时交易
        </h1>
        <p className="opacity-90">把握投资机会，实现财富增长</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <i className="fas fa-clock mr-1"></i>
            <span>实时报价</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-shield-alt mr-1"></i>
            <span>SEC监管</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-mobile-alt mr-1"></i>
            <span>移动交易</span>
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-chart-bar mr-2 text-primary"></i>
            市场指数
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketIndices.map((index) => (
              <div key={index.name} className="text-center p-4 bg-muted rounded-lg">
                <div className="font-bold text-lg">{index.value}</div>
                <div className="text-sm text-muted-foreground">{index.name}</div>
                <div className={`text-sm font-medium ${index.color}`}>{index.change}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-briefcase mr-2 text-primary"></i>
            我的投资组合
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">$17,079</div>
                <div className="text-sm text-blue-600">总价值</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">+$572</div>
                <div className="text-sm text-green-600">今日盈亏</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">+3.47%</div>
                <div className="text-sm text-yellow-600">总回报率</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">3</div>
                <div className="text-sm text-purple-600">持有股票</div>
              </div>
            </div>

            <div className="space-y-2">
              {portfolio.map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="font-bold">{holding.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.shares}股 • 均价${holding.avgPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${holding.currentValue.toLocaleString()}</div>
                    <div className={`text-sm ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.gain >= 0 ? '+' : ''}${holding.gain.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-list mr-2 text-primary"></i>
            热门股票
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stocks.map((stock) => (
              <div 
                key={stock.symbol} 
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedStock?.symbol === stock.symbol ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                }`}
                onClick={() => setSelectedStock(stock)}
                data-testid={`card-stock-${stock.symbol}`}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-bold text-lg">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stock.sector}
                  </Badge>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-sm text-muted-foreground">
                    <div>成交量: {stock.volume}</div>
                    <div>市值: ${stock.marketCap}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-xl">${stock.price.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <i className={`fas ${stock.trending === 'up' ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Panel */}
      {selectedStock && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-exchange-alt mr-2 text-primary"></i>
              交易面板 - {selectedStock.symbol}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={tradeType === 'buy' ? 'default' : 'outline'}
                  onClick={() => setTradeType('buy')}
                  className="h-12"
                  data-testid="button-buy"
                >
                  <i className="fas fa-arrow-up mr-2"></i>
                  买入
                </Button>
                <Button
                  variant={tradeType === 'sell' ? 'default' : 'outline'}
                  onClick={() => setTradeType('sell')}
                  className="h-12"
                  data-testid="button-sell"
                >
                  <i className="fas fa-arrow-down mr-2"></i>
                  卖出
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">交易数量</label>
                <Input
                  type="number"
                  placeholder="输入股数"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  data-testid="input-trade-amount"
                />
              </div>

              {tradeAmount && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>股票价格:</span>
                    <span>${selectedStock.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>交易数量:</span>
                    <span>{tradeAmount}股</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>总金额:</span>
                    <span>${(parseInt(tradeAmount || '0') * selectedStock.price).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full h-12 text-lg"
                onClick={handleTrade}
                data-testid="button-execute-trade"
              >
                <i className="fas fa-check mr-2"></i>
                确认{tradeType === 'buy' ? '买入' : '卖出'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-newspaper mr-2 text-primary"></i>
            市场快讯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: '美联储维持利率不变，市场反应积极', time: '15分钟前', type: '宏观' },
              { title: '科技股集体上涨，AI概念股领涨', time: '1小时前', type: '科技' },
              { title: '特斯拉Q4财报超预期，盘后大涨5%', time: '2小时前', type: '财报' },
              { title: '油价持续上涨，能源股表现强劲', time: '3小时前', type: '能源' }
            ].map((news, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{news.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">{news.type}</Badge>
                    <span className="text-xs text-muted-foreground">{news.time}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  阅读
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
