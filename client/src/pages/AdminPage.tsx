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
import { Badge } from '@/components/ui/badge';
import { Trash2, Heart, MapPin, Briefcase, User } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

interface DatingProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  description: string;
  interests: string[];
  photos: string[];
  online: boolean;
  verified: boolean;
  premium: boolean;
  joinDate: string;
  messageCount: number;
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

  // Dating Profile Management State
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileOccupation, setProfileOccupation] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [profileImageEmoji, setProfileImageEmoji] = useState('😊');

  // Fetch existing creators
  const { data: creators = [] } = useQuery<Creator[]>({
    queryKey: ['/api/creators'],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch dating profiles
  const { data: datingProfilesData } = useQuery({
    queryKey: ['/api/dating-profiles'],
    staleTime: 5 * 60 * 1000,
  });

  const datingProfiles = datingProfilesData?.profiles || [];

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

  // Dating profile creation mutation
  const createDatingProfileMutation = useMutation({
    mutationFn: async (newProfile: { 
      name: string; 
      age: string; 
      location: string; 
      occupation: string; 
      description: string; 
      imageEmoji: string;
    }) => {
      const response = await fetch('/api/admin/dating-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create dating profile');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Dating profile has been created successfully.',
      });
      setProfileName('');
      setProfileAge('');
      setProfileLocation('');
      setProfileOccupation('');
      setProfileDescription('');
      setProfileImageEmoji('😊');
      queryClient.invalidateQueries({ queryKey: ['/api/dating-profiles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create dating profile.',
        variant: 'destructive',
      });
    },
  });

  // Dating profile deletion mutation
  const deleteDatingProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const response = await fetch(`/api/admin/dating-profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete dating profile');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Dating profile has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dating-profiles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete dating profile.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateDatingProfile = () => {
    if (!profileName.trim() || !profileAge || !profileLocation.trim() || !profileOccupation.trim() || !profileDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const age = parseInt(profileAge);
    if (isNaN(age) || age < 18 || age > 100) {
      toast({
        title: 'Error',
        description: 'Please enter a valid age between 18 and 100.',
        variant: 'destructive',
      });
      return;
    }

    createDatingProfileMutation.mutate({
      name: profileName,
      age: profileAge,
      location: profileLocation,
      occupation: profileOccupation,
      description: profileDescription,
      imageEmoji: profileImageEmoji
    });
  };

  const handleDeleteDatingProfile = (profileId: string) => {
    if (confirm('Are you sure you want to delete this dating profile?')) {
      deleteDatingProfileMutation.mutate(profileId);
    }
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
                onCheckedChange={(checked) => setIsPaidPost(checked === true)}
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

      {/* Dating Profiles Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Dating Profiles</CardTitle>
          <CardDescription>
            Add and manage dating profiles for the dating subsite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Dating Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Dating Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name *</Label>
                <Input
                  id="profile-name"
                  placeholder="Enter profile name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  data-testid="input-profile-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-age">Age *</Label>
                <Input
                  id="profile-age"
                  type="number"
                  placeholder="Enter age"
                  min="18"
                  max="100"
                  value={profileAge}
                  onChange={(e) => setProfileAge(e.target.value)}
                  data-testid="input-profile-age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-location">Location *</Label>
                <Input
                  id="profile-location"
                  placeholder="Enter location (e.g., New York, NY)"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  data-testid="input-profile-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-occupation">Occupation *</Label>
                <Input
                  id="profile-occupation"
                  placeholder="Enter occupation"
                  value={profileOccupation}
                  onChange={(e) => setProfileOccupation(e.target.value)}
                  data-testid="input-profile-occupation"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-description">Description *</Label>
              <Textarea
                id="profile-description"
                placeholder="Write a profile description..."
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                rows={3}
                data-testid="textarea-profile-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-emoji">Image Emoji (optional)</Label>
              <Input
                id="profile-emoji"
                placeholder="😊"
                value={profileImageEmoji}
                onChange={(e) => setProfileImageEmoji(e.target.value)}
                maxLength={2}
                className="w-20"
                data-testid="input-profile-emoji"
              />
            </div>
            <Button 
              onClick={handleCreateDatingProfile}
              disabled={createDatingProfileMutation.isPending}
              data-testid="button-create-dating-profile"
            >
              {createDatingProfileMutation.isPending ? 'Creating...' : 'Add Dating Profile'}
            </Button>
          </div>

          {/* Existing Dating Profiles */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Existing Dating Profiles ({datingProfiles.length})</h3>
            
            {datingProfiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No dating profiles found</p>
                <p className="text-sm">Create your first dating profile above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {datingProfiles.map((profile: DatingProfile) => (
                  <Card key={profile.id} className="relative" data-testid={`card-dating-profile-${profile.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{profile.photos?.[0]?.split('_')?.[0] || '😊'}</div>
                          <div>
                            <CardTitle className="text-lg">{profile.name}</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{profile.age} years old</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDatingProfile(profile.id)}
                          disabled={deleteDatingProfileMutation.isPending}
                          data-testid={`button-delete-profile-${profile.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{profile.occupation}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mt-2">{profile.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {profile.online && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Online
                            </Badge>
                          )}
                          {profile.verified && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Verified
                            </Badge>
                          )}
                          {profile.premium && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              Premium
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          {profile.messageCount} messages • Joined {profile.joinDate}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}