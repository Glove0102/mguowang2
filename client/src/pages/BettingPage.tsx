import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { apiRequest } from "@/lib/queryClient";

interface Match {
  id: string;
  teams: [string, string];
  sport: string;
  matchTime: string;
  stadium: string;
  odds: { [key: string]: number };
  status: string;
  description: string;
}

interface BetDialogProps {
  match: Match;
  selectedTeam: string;
  onBetSuccess: () => void;
}

function BetDialog({ match, selectedTeam, onBetSuccess }: BetDialogProps) {
  const [betAmount, setBetAmount] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const betMutation = useMutation({
    mutationFn: async ({ matchId, selectedTeam, betAmount }: {
      matchId: string;
      selectedTeam: string;
      betAmount: number;
    }) => {
      const response = await fetch(`/api/sports/bet`, {
        method: "POST",
        body: JSON.stringify({ matchId, selectedTeam, betAmount }),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "投注失败");
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: result.userWon ? "恭喜中奖！" : "很遗憾...",
        description: result.userWon 
          ? `${result.selectedTeam} 获胜！您赢得了 $${result.winnings} 和 ${result.xpGain} XP`
          : `${result.winner} 获胜，${result.selectedTeam} 败北。获得 ${result.xpGain} XP`,
        variant: result.userWon ? "default" : "destructive"
      });
      
      // Refresh user data by invalidating query
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      onBetSuccess();
      setOpen(false);
      setBetAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "投注失败",
        description: error.message || "投注时发生错误",
        variant: "destructive"
      });
    }
  });

  const handleBet = () => {
    const amount = parseInt(betAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "无效金额",
        description: "请输入有效的投注金额",
        variant: "destructive"
      });
      return;
    }

    if (!user || user.balance < amount) {
      toast({
        title: "余额不足",
        description: "您的余额不足以支付此投注",
        variant: "destructive"
      });
      return;
    }

    betMutation.mutate({
      matchId: match.id,
      selectedTeam,
      betAmount: amount
    });
  };

  const potentialWinnings = betAmount ? Math.floor(parseInt(betAmount) * match.odds[selectedTeam]) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          data-testid={`button-bet-${selectedTeam.replace(/\s+/g, '-').toLowerCase()}`}
        >
          投注 {selectedTeam}
          <Badge variant="secondary" className="ml-2">
            {match.odds[selectedTeam]}x
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-bet">
        <DialogHeader>
          <DialogTitle>投注 {selectedTeam}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>比赛:</strong> {match.teams.join(" vs ")}</p>
            <p><strong>时间:</strong> {match.matchTime}</p>
            <p><strong>赔率:</strong> {match.odds[selectedTeam]}x</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bet-amount">投注金额 ($)</Label>
            <Input
              id="bet-amount"
              type="number"
              placeholder="输入投注金额"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              max={user?.balance || 0}
              data-testid="input-bet-amount"
            />
            <p className="text-xs text-muted-foreground">
              余额: ${user?.balance || 0}
            </p>
          </div>

          {betAmount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>投注金额:</strong> ${betAmount}
              </p>
              <p className="text-sm">
                <strong>潜在收益:</strong> ${potentialWinnings}
              </p>
            </div>
          )}

          <Button 
            onClick={handleBet} 
            disabled={betMutation.isPending || !betAmount}
            className="w-full"
            data-testid="button-confirm-bet"
          >
            {betMutation.isPending ? "投注中..." : "确认投注"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BettingPage() {
  const { toast } = useToast();

  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/sports"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">加载比赛信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-red-600" data-testid="text-page-title">
          🏈 体育博彩 🏀
        </h1>
        <p className="text-muted-foreground">
          美国顶级体育赛事投注平台
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <Badge variant="outline">实时赔率</Badge>
          <Badge variant="outline">安全投注</Badge>
          <Badge variant="outline">即时结算</Badge>
        </div>
      </div>

      {/* Live Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches?.map((match: Match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow" data-testid={`card-match-${match.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{match.sport}</Badge>
                <Badge variant="outline" className="text-green-600">
                  {match.status === "upcoming" ? "即将开始" : match.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{match.teams.join(" vs ")}</CardTitle>
              <p className="text-sm text-muted-foreground">{match.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">时间:</span>
                  <span>{match.matchTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">场馆:</span>
                  <span>{match.stadium}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">选择队伍投注:</h4>
                <div className="space-y-2">
                  {match.teams.map((team) => (
                    <BetDialog
                      key={team}
                      match={match}
                      selectedTeam={team}
                      onBetSuccess={() => {
                        toast({
                          title: "投注成功",
                          description: `已对 ${team} 下注，比赛结果即将揭晓`,
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                💡 获胜可得双倍奖金 + 50 XP，参与即可获得 10 XP
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-950/20 dark:to-blue-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">🇺🇸 美国体育博彩规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-semibold">💰 投注规则</h4>
                <p className="text-muted-foreground">根据赔率获得收益</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">🏆 奖励系统</h4>
                <p className="text-muted-foreground">获胜 +50 XP，参与 +10 XP</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">⚡ 即时结算</h4>
                <p className="text-muted-foreground">比赛结果立即公布</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}