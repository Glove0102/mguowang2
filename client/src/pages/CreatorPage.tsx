import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Creator, CreatorPost } from "@shared/schema";
import { useUser } from '@/contexts/UserContext';

interface CreatorWithPosts extends Creator {
  posts: CreatorPost[];
}

export default function CreatorPage() {
  const [creators, setCreators] = useState<CreatorWithPosts[]>([]);
  const { user, updateUser } = useUser();

  useEffect(() => {
    async function fetchData() {
      const creatorsRes = await fetch('/api/creators');
      const creatorsData = await creatorsRes.json();
      const postsRes = await fetch('/api/creator-posts');
      const postsData = await postsRes.json();

      const creatorsWithPosts = creatorsData.map((creator: Creator) => ({
        ...creator,
        posts: postsData.filter((post: CreatorPost) => post.creatorId === creator.id),
      }));
      setCreators(creatorsWithPosts);
    }
    fetchData();
  }, []);

  const handleUnlockPost = (post: CreatorPost) => {
    if (user && user.balance >= post.cost) {
      // In a real app, you'd record this transaction.
      // For now, we just deduct the balance.
      updateUser({ balance: user.balance - post.cost });
      alert(`Post unlocked! $${post.cost} deducted.`);
      // You would also need to update the UI to show the content.
      // This part is simplified.
    } else {
      alert("You don't have enough money to unlock this post.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Creator Fan Pages</h1>
        <p className="text-lg text-muted-foreground mt-2">Support your favorite creators and get exclusive content.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {creators.map((creator) => (
          <AccordionItem value={creator.id} key={creator.id}>
            <AccordionTrigger>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={creator.avatarUrl || undefined} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{creator.name}</h3>
                  <p className="text-sm text-muted-foreground">{creator.bio}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                {creator.posts.length === 0 ? (
                  <p>No posts from this creator yet.</p>
                ) : (
                  creator.posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {post.title}
                          {post.isPaid && <Badge variant="destructive">Paid</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {post.isPaid ? (
                          <div className="text-center p-4 bg-secondary rounded-md">
                            <p className="font-bold">This is exclusive content.</p>
                            <Button className="mt-2" onClick={() => handleUnlockPost(post)}>
                              Unlock for ${post.cost}
                            </Button>
                          </div>
                        ) : (
                          <p>{post.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
