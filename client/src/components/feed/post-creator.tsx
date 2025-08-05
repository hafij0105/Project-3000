import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, FileText, Smile } from "lucide-react";
import { authService } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertPost } from "@shared/schema";

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentUser = authService.getCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost & { userId: number }) => {
      console.log("Creating post with data:", postData);
      const response = await apiRequest("POST", "/api/posts", postData);
      const result = await response.json();
      console.log("Post creation result:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Post created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setMediaType(null);
      setSelectedFile(null);
      toast({
        title: "Post shared!",
        description: "Your post has been shared with your community"
      });
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      toast({
        title: "Failed to share post",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async (file: File) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a blob URL from the selected file
      const blobUrl = URL.createObjectURL(file);
      
      return { url: blobUrl, message: "Media uploaded successfully" };
    },
    onSuccess: (data) => {
      setIsUploading(false);
      toast({
        title: "Media uploaded!",
        description: "Your media is ready to be shared"
      });
    },
    onError: (error) => {
      setIsUploading(false);
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Couldn't upload your media. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleShare = async () => {
    if (!content.trim()) {
      toast({
        title: "Please add some content",
        description: "Your post needs some content to be shared",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) return;

    setIsUploading(true);
    try {
      let mediaUrl = null;
      if (selectedFile) {
        const uploadResult = await uploadMediaMutation.mutateAsync(selectedFile);
        mediaUrl = uploadResult.url;
      }

      createPostMutation.mutate({
        userId: currentUser.id,
        content: content.trim(),
        ...(mediaUrl && {
          mediaType: mediaType || undefined,
          mediaUrl: mediaUrl
        })
      });
    } catch (error) {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Determine media type from file
      if (file.type.startsWith("image/")) {
        setMediaType("image");
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
      } else if (file.type === "application/pdf") {
        setMediaType("pdf");
      }
    }
  };

  const triggerFileInput = (type: string) => {
    setMediaType(type);
    fileInputRef.current?.click();
  };

  const removeMedia = () => {
    setMediaType(null);
    setSelectedFile(null);
  };

  return (
  <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 w-full max-w-4xl mx-auto">
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*,video/*,.pdf"
      className="hidden"
    />
    
    <div className="flex items-start gap-3 md:gap-4">
      <img 
        src={currentUser?.profileImage || "/api/placeholder/40/40"}
        alt="Your Profile" 
        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <Textarea
          placeholder={`What's on your mind, ${currentUser?.fullName?.split(" ")[0]}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-100 rounded-2xl focus:ring-2 focus:ring-metro-green focus:bg-white border-0 text-sm md:text-base"
          rows={3}
        />
        
        {selectedFile && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-metro-dark">
                {mediaType === "image" && "📷 Photo selected"}
                {mediaType === "video" && "🎥 Video selected"}  
                {mediaType === "pdf" && "📄 PDF selected"}
                {isUploading && "⏳ Uploading..."}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={removeMedia}
                disabled={isUploading}
                className="ml-auto"
              >
                Remove
              </Button>
            </div>
            
            {mediaType === "image" && (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="mt-2 rounded-lg max-h-48 object-contain w-full"
              />
            )}
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
          <div className="flex items-center flex-wrap gap-2 md:gap-4">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => triggerFileInput("image")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2"
            >
              <Image className="text-red-500 w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm text-metro-dark">Photo</span>
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => triggerFileInput("video")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2"
            >
              <Video className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm text-metro-dark">Video</span>
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => triggerFileInput("pdf")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2"
            >
              <FileText className="text-red-600 w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm text-metro-dark">PDF</span>
            </Button>
            
          </div>
          
          <Button 
            onClick={handleShare}
            disabled={createPostMutation.isPending || !content.trim() || isUploading}
            className="bg-metro-green hover:bg-metro-green-light px-4 md:px-6 text-sm md:text-base"
          >
            {createPostMutation.isPending 
              ? "Sharing..." 
              : isUploading
                ? "Uploading..."
                : "Share"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);
}