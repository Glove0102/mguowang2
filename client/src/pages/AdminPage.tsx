import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

function AdminDashboard() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNews = async () => {
    if (!topic) {
      toast({
        title: 'Error',
        description: 'Please enter a topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate news');
      }

      const result = await response.json();
      toast({
        title: 'Success!',
        description: 'New article has been generated and added.',
      });
      setTopic('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate news. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>AI News Article Generator</CardTitle>
          <CardDescription>
            Enter a topic and the AI will generate a new article and add it to the news page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter a news topic (e.g., 'US housing market')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleGenerateNews} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Article'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Creator } from "@shared/schema";

function NewsGenerator() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNews = async () => {
    if (!topic) {
      toast({
        title: 'Error',
        description: 'Please enter a topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate news');
      }

      toast({
        title: 'Success!',
        description: 'New article has been generated and added.',
      });
      setTopic('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate news. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI News Article Generator</CardTitle>
        <CardDescription>
          Enter a topic and the AI will generate a new article and add it to the news page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter a news topic (e.g., 'US housing market')"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button onClick={handleGenerateNews} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Article'}
        </Button>
      </CardContent>
    </Card>
  );
}

function CreatorManager() {
  const { toast } = useToast();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [cost, setCost] = useState(0);
  const [newCreatorName, setNewCreatorName] = useState('');

  useEffect(() => {
    fetch('/api/creators')
      .then(res => res.json())
      .then(setCreators);
  }, []);

  const handleAddCreator = async () => {
    if (!newCreatorName) return;
    const response = await fetch('/api/admin/creators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCreatorName }),
    });
    if (response.ok) {
      const newCreator = await response.json();
      setCreators([...creators, newCreator]);
      setNewCreatorName('');
      toast({ title: 'Success', description: 'Creator added.' });
    }
  };

  const handleAddPost = async () => {
    if (!selectedCreator || !postTitle || !postContent) {
      toast({ title: 'Error', description: 'Please fill all post fields.', variant: 'destructive' });
      return;
    }
    const response = await fetch('/api/admin/creator-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorId: selectedCreator,
        title: postTitle,
        content: postContent,
        isPaid,
        cost: isPaid ? cost : 0,
      }),
    });

    if (response.ok) {
      setPostTitle('');
      setPostContent('');
      setIsPaid(false);
      setCost(0);
      toast({ title: 'Success', description: 'Post added.' });
    } else {
      toast({ title: 'Error', description: 'Failed to add post.', variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Creator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="New creator's name"
            value={newCreatorName}
            onChange={(e) => setNewCreatorName(e.target.value)}
          />
          <Button onClick={handleAddCreator}>Add Creator</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add New Post</CardTitle>
          <CardDescription>Add a new post for an existing creator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedCreator} value={selectedCreator}>
            <SelectTrigger>
              <SelectValue placeholder="Select a creator" />
            </SelectTrigger>
            <SelectContent>
              {creators.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>{creator.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <Textarea
            placeholder="Post content..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox id="is-paid" checked={isPaid} onCheckedChange={(checked) => setIsPaid(!!checked)} />
            <Label htmlFor="is-paid">Paid Post</Label>
          </div>
          {isPaid && (
            <Input
              type="number"
              placeholder="Cost in $"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          )}
          <Button onClick={handleAddPost}>Add Post</Button>
        </CardContent>
      </Card>
    </div>
  );
}


function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h2>
      <Tabs defaultValue="news">
        <TabsList>
          <TabsTrigger value="news">News Generator</TabsTrigger>
          <TabsTrigger value="creators">Creator Content</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-4">
          <NewsGenerator />
        </TabsContent>
        <TabsContent value="creators" className="mt-4">
          <CreatorManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
