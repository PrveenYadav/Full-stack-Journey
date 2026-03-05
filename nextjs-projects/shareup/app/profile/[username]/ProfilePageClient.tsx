"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user,
}: ProfilePageClientProps) {
  const { user: currentUser } = useUser();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-4xl mx-auto px-4">

      <div className="relative w-full h-40 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 mb-16">
        
        {/* Avatar */}
        <Avatar className="absolute -bottom-12 left-6 w-28 h-28 border-4 border-background shadow-lg">
          <AvatarImage src={user.image ?? "/avatar.png"} />
        </Avatar>

      </div>

      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="pt-0">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div className="space-y-3">

              <div>
                <h1 className="text-2xl font-bold">
                  {user.name ?? user.username}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              {user.bio && (
                <p className="text-sm max-w-lg leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* META */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="size-4" />
                    {user.location}
                  </div>
                )}

                {user.website && (
                  <a
                    href={
                      user.website.startsWith("http")
                        ? user.website
                        : `https://${user.website}`
                    }
                    target="_blank"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <LinkIcon className="size-4" />
                    {user.website}
                  </a>
                )}

                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-4" />
                  Joined {formattedDate}
                </div>
              </div>

              {/* STATS */}
              <div className="flex items-center gap-6 pt-2">

                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {user._count.following.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Following
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {user._count.followers.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Followers
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {user._count.posts.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Posts
                  </span>
                </div>

              </div>

            </div>

            <div className="flex items-start">

              {!currentUser ? (
                <SignInButton mode="modal">
                  <Button className="cursor-pointer">Follow</Button>
                </SignInButton>

              ) : isOwnProfile ? (

                <Button onClick={() => setShowEditDialog(true)} className="cursor-pointer">
                  <EditIcon className="size-4 mr-2" />
                  Edit Profile
                </Button>

              ) : (

                <Button
                  onClick={handleFollow}
                  disabled={isUpdatingFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className="cursor-pointer"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>

              )}

            </div>

          </div>

        </CardContent>
      </Card>


      <Tabs defaultValue="posts" className="w-full mt-8">

        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">

          <TabsTrigger
            value="posts"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 cursor-pointer"
          >
            <FileTextIcon className="size-4" />
            Posts
          </TabsTrigger>

          <TabsTrigger
            value="likes"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 cursor-pointer"
          >
            <HeartIcon className="size-4" />
            Likes
          </TabsTrigger>

        </TabsList>


        <TabsContent value="posts" className="mt-6 space-y-6">

          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={user.id} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No posts yet
            </div>
          )}

        </TabsContent>


        <TabsContent value="likes" className="mt-6 space-y-6">

          {likedPosts.length > 0 ? (
            likedPosts.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={user.id} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No liked posts
            </div>
          )}

        </TabsContent>

      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={editForm.website}
                onChange={(e) =>
                  setEditForm({ ...editForm, website: e.target.value })
                }
              />
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>

            <Button onClick={handleEditSubmit} className="cursor-pointer">
              Save Changes
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );

}
export default ProfilePageClient;