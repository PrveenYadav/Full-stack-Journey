"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

// for rich text
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        // clear TipTap editor
        editor?.commands.clearContent();

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
        protocols: ["http", "https"],
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-600",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <Card className="mb-6 border bg-card/60 backdrop-blur-sm">
      <CardContent className="p-5">

        <div className="flex gap-4">

          <Avatar className="w-10 h-10 mt-1">
            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
          </Avatar>

          <div className="flex-1 space-y-4">

            {editor && (
              <div className="border rounded-lg p-3 min-h-[110px]">
                <EditorContent editor={editor} />
              </div>
            )}

            {(showImageUpload || imageUrl) && (
              <div className="rounded-xl border bg-muted/20 p-3">
                <ImageUpload
                  value={imageUrl}
                  onChange={(url) => {
                    setImageUrl(url);
                    if (!url) setShowImageUpload(false);
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting}
                  className="
                    text-muted-foreground
                    hover:text-primary
                    hover:bg-muted
                    transition cursor-pointer
                  "
                >
                  <ImageIcon className="size-4 mr-2" />
                  Photo
                </Button>

              </div>

              <Button
                onClick={handleSubmit}
                disabled={(!content.trim() && !imageUrl) || isPosting}
                className="rounded-full px-5 cursor-pointer"
              >
                {isPosting ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <SendIcon className="size-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  );

}
export default CreatePost;