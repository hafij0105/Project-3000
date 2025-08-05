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
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,.pdf"
        className="hidden"
      />
      
      <div className="flex items-start space-x-4">
        <img 
          src={currentUser?.profileImage || "/api/placeholder/40/40"}
          alt="Your Profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <Textarea
            placeholder={`What's on your mind, ${currentUser?.fullName?.split(" ")[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-100 rounded-2xl resize-none focus:ring-2 focus:ring-metro-green focus:bg-white border-0"
            rows={3}
          />
          
          {selectedFile && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
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
                >
                  Remove
                </Button>
              </div>
              
              {mediaType === "image" && (
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  className="mt-2 rounded-lg max-h-48 object-cover w-full"
                />
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => triggerFileInput("image")}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <Image className="text-red-500" size={20} />
                <span className="text-sm text-metro-dark">Photo</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => triggerFileInput("video")}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <Video className="text-blue-500" size={20} />
                <span className="text-sm text-metro-dark">Video</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => triggerFileInput("pdf")}
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <FileText className="text-red-600" size={20} />
                <span className="text-sm text-metro-dark">PDF</span>
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <Smile className="text-yellow-500" size={20} />
                <span className="text-sm text-metro-dark">Feeling</span>
              </Button>
            </div>
            
            <Button 
              onClick={handleShare}
              disabled={createPostMutation.isPending || !content.trim() || isUploading}
              className="bg-metro-green hover:bg-metro-green-light px-6"
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