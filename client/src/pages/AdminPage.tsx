import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Creator {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // News Generator State
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Creator Management State
  const [creatorName, setCreatorName] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState('');

  // Post Management State
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPaidPost, setIsPaidPost] = useState(false);
  const [postCost, setPostCost] = useState('');

  // Fetch existing creators
  const { data: creators = [] } = useQuery<Creator[]>({
    queryKey: ['/api/creators'],
    staleTime: 5 * 60 * 1000,
  });

  // News generation
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

  // Creator creation mutation
  const createCreatorMutation = useMutation({
    mutationFn: async (newCreator: { name: string; bio: string; avatarUrl: string }) => {
      const response = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCreator),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create creator');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Creator has been added successfully.',
      });
      setCreatorName('');
      setCreatorBio('');
      setCreatorAvatar('');
      queryClient.invalidateQueries({ queryKey: ['/api/creators'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create creator.',
        variant: 'destructive',
      });
    },
  });

  // Post creation mutation
  const createPostMutation = useMutation({
    mutationFn: async (newPost: { 
      creatorId: string; 
      title: string; 
      content: string; 
      isPaid: boolean; 
      cost?: number;
    }) => {
      const response = await fetch('/api/admin/creator-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Post has been added successfully.',
      });
      setSelectedCreatorId('');
      setPostTitle('');
      setPostContent('');
      setIsPaidPost(false);
      setPostCost('');
      queryClient.invalidateQueries({ queryKey: ['/api/creator-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateCreator = () => {
    if (!creatorName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a creator name.',
        variant: 'destructive',
      });
      return;
    }

    createCreatorMutation.mutate({
      name: creatorName,
      bio: creatorBio || 'Professional content creator',
      avatarUrl: creatorAvatar || 'https://images.unsplash.com/photo-1494790108755-2616b332c1d6?w=150&h=150&fit=crop&crop=face'
    });
  };

  const handleCreatePost = () => {
    if (!selectedCreatorId) {
      toast({
        title: 'Error',
        description: 'Please select a creator.',
        variant: 'destructive',
      });
      return;
    }

    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter post title and content.',
        variant: 'destructive',
      });
      return;
    }

    if (isPaidPost && (!postCost || parseInt(postCost) <= 0)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid cost for paid posts.',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate({
      creatorId: selectedCreatorId,
      title: postTitle,
      content: postContent,
      isPaid: isPaidPost,
      cost: isPaidPost ? parseInt(postCost) : undefined
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight mb-6" data-testid="text-admin-title">
        Admin Dashboard
      </h2>
      
      {/* AI News Article Generator */}
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
            data-testid="input-news-topic"
          />
          <Button 
            onClick={handleGenerateNews} 
            disabled={isGenerating}
            data-testid="button-generate-news"
          >
            {isGenerating ? 'Generating...' : 'Generate Article'}
          </Button>
        </CardContent>
      </Card>

      {/* Creator Management */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Management</CardTitle>
          <CardDescription>
            Manage content creators and their posts for the Creator Fan Pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Creator */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Creator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creator-name">Creator Name *</Label>
                <Input
                  id="creator-name"
                  placeholder="Enter creator name"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  data-testid="input-creator-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creator-avatar">Avatar URL (optional)</Label>
                <Input
                  id="creator-avatar"
                  placeholder="Enter avatar image URL"
                  value={creatorAvatar}
                  onChange={(e) => setCreatorAvatar(e.target.value)}
                  data-testid="input-creator-avatar"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creator-bio">Bio (optional)</Label>
              <Textarea
                id="creator-bio"
                placeholder="Enter creator bio"
                value={creatorBio}
                onChange={(e) => setCreatorBio(e.target.value)}
                rows={3}
                data-testid="textarea-creator-bio"
              />
            </div>
            <Button 
              onClick={handleCreateCreator}
              disabled={createCreatorMutation.isPending}
              data-testid="button-create-creator"
            >
              {createCreatorMutation.isPending ? 'Creating...' : 'Add Creator'}
            </Button>
          </div>

          {/* Add New Post */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Add New Post</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="select-creator">Select Creator *</Label>
                <Select value={selectedCreatorId} onValueChange={setSelectedCreatorId}>
                  <SelectTrigger data-testid="select-creator">
                    <SelectValue placeholder="Choose a creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {creators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        {creator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-title">Post Title *</Label>
                <Input
                  id="post-title"
                  placeholder="Enter post title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  data-testid="input-post-title"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-content">Post Content *</Label>
              <Textarea
                id="post-content"
                placeholder="Enter post content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
                data-testid="textarea-post-content"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paid-post"
                checked={isPaidPost}
                onCheckedChange={setIsPaidPost}
                data-testid="checkbox-paid-post"
              />
              <Label htmlFor="paid-post">Paid Post</Label>
            </div>

            {isPaidPost && (
              <div className="space-y-2">
                <Label htmlFor="post-cost">Cost ($) *</Label>
                <Input
                  id="post-cost"
                  type="number"
                  placeholder="Enter cost in dollars"
                  value={postCost}
                  onChange={(e) => setPostCost(e.target.value)}
                  min="1"
                  data-testid="input-post-cost"
                />
              </div>
            )}

            <Button 
              onClick={handleCreatePost}
              disabled={createPostMutation.isPending}
              data-testid="button-create-post"
            >
              {createPostMutation.isPending ? 'Creating...' : 'Add Post'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}