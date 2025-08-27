import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { apiRequest } from "@/lib/queryClient";

const TOTAL_DISTANCE = 2800; // miles from LA to NY
const DRIVE_INCREMENT = 10; // miles per click
const DRIVE_REWARD_XP = 1;
const DRIVE_REWARD_MONEY = 2;
const COMPLETION_BONUS_XP = 250;
const COMPLETION_BONUS_MONEY = 500;

export default function TruckingPage() {
  const [currentDistance, setCurrentDistance] = useState(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('trucking-progress');
    return saved ? parseInt(saved) : 0;
  });
  
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('trucking-progress', currentDistance.toString());
  }, [currentDistance]);

  const driveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpGain: DRIVE_REWARD_XP,
          dollarGain: DRIVE_REWARD_MONEY,
          activityType: 'truck_drive',
          description: `驾驶卡车 ${DRIVE_INCREMENT} 英里`
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "驾驶失败");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setCurrentDistance(prev => {
        const newDistance = prev + DRIVE_INCREMENT;
        
        if (newDistance >= TOTAL_DISTANCE) {
          setIsCompleted(true);
          // Award completion bonus
          completionMutation.mutate();
          return TOTAL_DISTANCE;
        }
        
        return newDistance;
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: (error: any) => {
      toast({
        title: "驾驶失败",
        description: error.message || "驾驶时发生错误",
        variant: "destructive"
      });
    }
  });

  const completionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpGain: COMPLETION_BONUS_XP,
          dollarGain: COMPLETION_BONUS_MONEY,
          activityType: 'truck_route_complete',
          description: '完成洛杉矶到纽约路线！'
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "奖励发放失败");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🎉 路线完成！",
        description: `恭喜完成洛杉矶到纽约路线！获得 ${COMPLETION_BONUS_XP} XP 和 $${COMPLETION_BONUS_MONEY} 奖金`,
        duration: 5000
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    }
  });

  const resetRoute = () => {
    setCurrentDistance(0);
    setIsCompleted(false);
    localStorage.removeItem('trucking-progress');
    
    toast({
      title: "新路线开始",
      description: "准备从洛杉矶出发前往纽约！",
    });
  };

  const progressPercentage = (currentDistance / TOTAL_DISTANCE) * 100;
  const remainingDistance = TOTAL_DISTANCE - currentDistance;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-red-600" data-testid="text-page-title">
          🚛 卡车驾驶模拟器 🛣️
        </h1>
        <p className="text-muted-foreground">
          驾驶卡车穿越美国，从洛杉矶到纽约
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <Badge variant="outline">+{DRIVE_REWARD_XP} XP / 10英里</Badge>
          <Badge variant="outline">+${DRIVE_REWARD_MONEY} / 10英里</Badge>
          <Badge variant="secondary">完成奖励: +{COMPLETION_BONUS_XP} XP, +${COMPLETION_BONUS_MONEY}</Badge>
        </div>
      </div>

      {/* Main Game Area */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {isCompleted ? "🎉 路线完成！" : "洛杉矶 → 纽约"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Visual Truck and Road */}
          <div className="relative bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 dark:from-yellow-900/20 dark:via-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded">🌴 洛杉矶</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded">🏙️ 纽约</span>
            </div>
            
            {/* Road */}
            <div className="relative mt-4 mb-4">
              <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded-lg relative overflow-hidden">
                {/* Road lines */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-white transform -translate-y-1/2"></div>
                
                {/* Truck positioned based on progress */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out"
                  style={{ left: `${Math.min(progressPercentage, 95)}%` }}
                  data-testid="truck-position"
                >
                  <div className="text-2xl">🚛</div>
                </div>
              </div>
            </div>

            {/* Landmarks along the route */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>🌵 Arizona</span>
              <span>🏔️ Colorado</span>
              <span>🌾 Kansas</span>
              <span>🏙️ Chicago</span>
              <span>🍎 NYC</span>
            </div>
          </div>

          {/* Progress Information */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">路线进度</span>
              <span className="text-sm text-muted-foreground">
                {currentDistance} / {TOTAL_DISTANCE} 英里 ({progressPercentage.toFixed(1)}%)
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-4"
              data-testid="progress-bar"
            />
            
            {!isCompleted && (
              <div className="text-center text-sm text-muted-foreground">
                剩余距离: {remainingDistance} 英里
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            {!isCompleted ? (
              <Button 
                onClick={() => driveMutation.mutate()}
                disabled={driveMutation.isPending}
                size="lg"
                className="px-8 py-4 text-lg"
                data-testid="button-drive"
              >
                {driveMutation.isPending ? "驾驶中..." : `🚛 驾驶 ${DRIVE_INCREMENT} 英里`}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400" data-testid="text-completion-message">
                    🎉 恭喜完成路线！
                  </h3>
                  <p className="text-green-600 dark:text-green-500">
                    您成功驾驶卡车从洛杉矶到达纽约！
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                    获得奖励: +{COMPLETION_BONUS_XP} XP, +${COMPLETION_BONUS_MONEY}
                  </p>
                </div>
                
                <Button 
                  onClick={resetRoute}
                  variant="outline"
                  size="lg"
                  data-testid="button-reset"
                >
                  🔄 开始新路线
                </Button>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-2 bg-muted rounded">
                <div className="font-semibold" data-testid="text-current-distance">{currentDistance}</div>
                <div className="text-muted-foreground">已驾驶英里</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-semibold" data-testid="text-earned-xp">{currentDistance * DRIVE_REWARD_XP}</div>
                <div className="text-muted-foreground">已获得 XP</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-semibold" data-testid="text-earned-money">${currentDistance * DRIVE_REWARD_MONEY}</div>
                <div className="text-muted-foreground">已获得收入</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-semibold">{Math.floor(currentDistance / DRIVE_INCREMENT)}</div>
                <div className="text-muted-foreground">驾驶次数</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-950/20 dark:to-red-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">🇺🇸 美国卡车驾驶规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-semibold">🛣️ 驾驶奖励</h4>
                <p className="text-muted-foreground">每10英里获得 ${DRIVE_REWARD_MONEY} + {DRIVE_REWARD_XP} XP</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">🏆 完成奖励</h4>
                <p className="text-muted-foreground">完成路线获得 ${COMPLETION_BONUS_MONEY} + {COMPLETION_BONUS_XP} XP</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">💾 自动保存</h4>
                <p className="text-muted-foreground">进度自动保存，随时继续</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}