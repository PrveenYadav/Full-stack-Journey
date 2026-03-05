"use client";

import { createComment, deletePost, getPosts, toggleLike } from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns"; // Package to formate dates
import { DeleteAlertDialog } from "./DeleteAlertDialog"
import { Button } from "./ui/button";
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { formatPostContent } from "@/lib/formatPostContent";

// Type of the awaited result returned by getPosts()
type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes); // optimistic, because the like will take time for updating in database, so we will already update the ui right after user clicks instead of showing loading
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);

      setHasLiked((prev) => !prev); // if liked then unlike and vice versa
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1)); // if use likes/unlikes post then incrementing/decrementing likes count

      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes); // if fails/error then likes count will remain same as it was and will not increment/decrement
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="space-y-4">

          <div className="flex gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {post.author.name}
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="hover:underline"
                    >
                      @{post.author.username}
                    </Link>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>

                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>

              {/* POST CONTENT */}
              {/* <div
                className="mt-3 text-sm prose prose-sm dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{
                  __html: formatPostContent(post.content ?? ""),
                }}
              /> */}

              <div
                className="mt-3 text-sm prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-3 prose-a:text-blue-500 prose-a:underline hover:prose-a:text-blue-600"
                dangerouslySetInnerHTML={{
                  __html: formatPostContent(post.content ?? ""),
                }}
              />

            </div>
          </div>

          {post.image && (
            <div className="rounded-xl overflow-hidden border mt-2">
              <img
                src={post.image}
                alt="Post content"
                className="w-full max-h-[500px] object-cover hover:scale-[1.02] transition-transform"
              />
            </div>
          )}

          <div className="flex items-center gap-6 pt-2 text-muted-foreground">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 transition-colors cursor-pointer ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                <HeartIcon
                  className={`size-5 transition ${
                    hasLiked ? "fill-current scale-110" : ""
                  }`}
                />
                <span className="text-sm">{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:text-red-500 cursor-pointer"
                >
                  <HeartIcon className="size-5" />
                  <span className="text-sm">{optimisticLikes}</span>
                </Button>
              </SignInButton>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:text-blue-500 cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircleIcon
                className={`size-5 transition ${
                  showComments ? "text-blue-500 fill-blue-500" : ""
                }`}
              />
              <span className="text-sm">{post.comments.length}</span>
            </Button>
          </div>

          {showComments && (
            <div className="space-y-5 pt-5 border-t border-border/60">

              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={comment.author.image ?? "/avatar.png"}
                      />
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">
                          {comment.author.name}
                        </span>

                        <span className="text-muted-foreground text-xs">
                          @{comment.author.username}
                        </span>

                        <span className="text-muted-foreground text-xs">•</span>

                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNow(
                            new Date(comment.createdAt)
                          )}{" "}
                          ago
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {user ? (
                <div className="flex gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={user.imageUrl || "/avatar.png"} />
                  </Avatar>

                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[70px] resize-none"
                    />

                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? (
                          "Posting..."
                        ) : (
                          <>
                            <SendIcon className="size-4" />
                            Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-5 border rounded-xl bg-muted/40">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="gap-2 cursor-pointer">
                      <LogInIcon className="size-4" />
                      Sign in to comment
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

}
export default PostCard;