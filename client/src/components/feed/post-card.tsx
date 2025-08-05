import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Download,
  Play,
  FileText,
  Plus,
  Trash2,
  EyeOff,
  Save,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { Post, User } from "@shared/schema";
import likeIcon from "@assets/like_1753197457880.webp";
import { useState, useRef, useEffect } from "react";
import { authService } from "@/lib/auth";

interface PostCardProps {
  post: Post & { user: User };
  onMediaUpload?: (files: FileList) => void;
}

export default function PostCard({ post, onMediaUpload }: PostCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes ?? 0);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const currentUser = authService.getCurrentUser();
  const isOwnPost = currentUser?.id === post.userId;
  


  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onMediaUpload) {
      onMediaUpload(e.target.files);
    }
  };

  const handleMediaUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Share and Options menu functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
      if (optionsButtonRef.current && !optionsButtonRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleOptions = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(post.content)}`;
    window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  const handleDeletePost = async () => {
    alert("Delete button clicked! Post ID: " + post.id);
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to delete posts",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      if (response.ok) {
        toast({
          title: "Post deleted",
          description: "Your post has been deleted"
        });
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      } else {
        toast({
          title: "Failed to delete post",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to delete post",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setShowOptionsMenu(false);
  };

  const handleSavePost = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/posts/${post.id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      if (response.ok) {
        toast({
          title: "Post saved",
          description: "Post has been saved to your collection"
        });
      } else {
        toast({
          title: "Failed to save post",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to save post",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setShowOptionsMenu(false);
  };

  const handleHidePost = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/posts/${post.id}/hide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      if (response.ok) {
        toast({
          title: "Post hidden",
          description: "Post has been hidden from your feed"
        });
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      } else {
        toast({
          title: "Failed to hide post",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Failed to hide post",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setShowOptionsMenu(false);
  };

  // Like functionality
  const handleLike = () => {
    setIsLiked((prev: boolean) => !prev);
    setLikesCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
    toast({
      title: !isLiked ? "Post liked!" : "Like removed",
      description: !isLiked
        ? "Your like has been added"
        : "Your like has been removed",
    });
  };

  // Comment functionality
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [...prev, commentInput.trim()]);
    setCommentInput("");
    toast({
      title: "Comment posted!",
    });
  };

  // Media rendering
  const renderMedia = () => {
    if (!post.mediaType || !post.mediaUrl) return null;

    switch (post.mediaType) {
      case "image":
        return (
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full rounded-lg mb-4 object-cover max-h-96"
          />
        );
      case "video":
        return (
          <video
            controls
            className="w-full rounded-lg mb-4 max-h-96"
            preload="metadata"
          >
            <source src={post.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-metro-dark">{post.mediaUrl}</h4>
                <p className="text-sm text-metro-muted">
                  2.4 MB • PDF Document
                </p>
              </div>
              <Button className="bg-metro-green hover:bg-metro-green-light">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  


  return (
    <article className="bg-white rounded-xl shadow-sm p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,.pdf"
        multiple
        className="hidden"
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.profileImage || "/api/placeholder/40/40"}
            alt={post.user.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-metro-dark">
              {post.user.fullName}
            </h3>
            <p className="text-sm text-metro-muted">{post.timestamp}</p>
          </div>
        </div>
        <div className="relative">
          <Button 
            ref={optionsButtonRef}
            variant="ghost" 
            size="sm"
            onClick={handleOptions}
          >
            <MoreHorizontal className="text-metro-muted" />
          </Button>

          {showOptionsMenu && (
            <div 
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {isOwnPost ? (
                // Own post options
                <>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm text-red-600"
                    onClick={handleDeletePost}
                  >
                    <Trash2 size={16} className="mr-3" />
                    Delete
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm text-metro-dark"
                    onClick={handleSavePost}
                  >
                    <Save size={16} className="mr-3" />
                    Save
                  </div>
                </>
              ) : (
                // Other people's post options
                <>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm text-metro-dark"
                    onClick={handleSavePost}
                  >
                    <Save size={16} className="mr-3" />
                    Save
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm text-metro-dark"
                    onClick={handleHidePost}
                  >
                    <EyeOff size={16} className="mr-3" />
                    Hide
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-metro-dark leading-relaxed">{post.content}</p>
      </div>

      {renderMedia()}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              isLiked ? "text-red-500" : "text-metro-muted hover:text-red-500"
            }`}
          >
            <img
              src={likeIcon}
              alt="Like"
              className={`w-5 h-5 ${!isLiked ? "grayscale opacity-60" : ""}`}
            />
            <span className="text-sm">{likesCount} likes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-metro-muted hover:text-metro-green"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{comments.length} comments</span>
          </Button>
          
          <div className="relative">
            <Button
              ref={shareButtonRef}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-metro-muted hover:text-metro-green"
              onClick={handleShare}
            >
              <Share size={20} />
              <span className="text-sm">Share</span>
            </Button>

            {showShareMenu && (
              <div 
                className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                  onClick={handleWhatsAppShare}
                >
                  <span className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:fill-[#128c7e] mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 448 512">
                      <path
                        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                  </span>
                  WhatsApp
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-metro-muted hover:text-metro-green"
        >
          <Bookmark size={20} />
        </Button>
      </div>

      {/* COMMENT SECTION */}
      <div className="mt-4 space-y-2">
        <form onSubmit={handleCommentSubmit} className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="min-h-[40px] text-sm px-3 py-1"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="bg-metro-green text-white"
            >
              <Plus size={16} className="mr-1" />
              Post
            </Button>
          </div>
        </form>

        <div className="space-y-2">
          {comments.map((comment, idx) => (
            <div
              key={idx}
              className="text-sm text-metro-dark bg-gray-100 rounded-lg px-3 py-2"
            >
              {comment}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}