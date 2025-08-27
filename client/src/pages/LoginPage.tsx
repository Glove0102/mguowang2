import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(password);
    
    if (!success) {
      toast({
        title: "登录失败",
        description: "密码错误，请重试",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">🇺🇸</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            美国网
          </CardTitle>
          <p className="text-muted-foreground">
            您的专属美国生活服务平台
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                访问密码
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入访问密码"
                required
                data-testid="input-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? '登录中...' : '进入美国网'}
            </Button>
          </form>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>体验完整的美国生活服务</p>
            <div className="flex justify-center items-center mt-2 space-x-2">
              <span>🏠</span>
              <span>🔫</span>
              <span>✈️</span>
              <span>💕</span>
              <span>📈</span>
              <span>🎰</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
