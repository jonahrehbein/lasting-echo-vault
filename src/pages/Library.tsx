
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Heart, Search, Globe, Lock, Edit, Trash2, Clock, MessageCircle } from "lucide-react";
import { useVideoLibrary } from "@/contexts/VideoLibraryContext";
import { EditVideoModal } from "@/components/EditVideoModal";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "all", label: "All Messages", icon: Globe },
  { value: "wisdom", label: "Wisdom", icon: Heart },
  { value: "story", label: "Stories", icon: MessageCircle },
  { value: "love", label: "Love", icon: Heart },
  { value: "advice", label: "Advice", icon: Clock }
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const { videos, updateVideo, deleteVideo } = useVideoLibrary();
  const { toast } = useToast();

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || Heart;
  };

  const handleEditVideo = (videoId: string, updates: any) => {
    updateVideo(videoId, updates);
    toast({
      title: "Video Updated",
      description: "Your video settings have been saved.",
    });
  };

  const handleDeleteVideo = (videoId: string) => {
    deleteVideo(videoId);
    toast({
      title: "Video Deleted",
      description: "Your video has been removed from the library.",
    });
  };

  const editingVideoData = editingVideo ? videos.find(v => v.id === editingVideo) : null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              My Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your saved video messages and recordings
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.value}
                          variant={selectedCategory === category.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.value)}
                          className="flex items-center space-x-1"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{category.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const CategoryIcon = getCategoryIcon(video.category);
              
              return (
                <Card key={video.id} className="shadow-card hover:shadow-gentle transition-all duration-300 group">
                  <CardContent className="p-0">
                    {/* Video Thumbnail */}
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          onClick={() => {
                            const videoElement = document.createElement('video');
                            videoElement.src = video.videoUrl;
                            videoElement.controls = true;
                            videoElement.autoplay = true;
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4';
                            modal.onclick = () => modal.remove();
                            modal.appendChild(videoElement);
                            document.body.appendChild(modal);
                          }}
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                      
                      {/* Privacy Indicator */}
                      <div className="absolute top-2 right-2">
                        {video.isPublic ? (
                          <Globe className="w-4 h-4 text-white/70" />
                        ) : (
                          <Lock className="w-4 h-4 text-white/70" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="mb-2">
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {video.category}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVideo(video.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      
                      {video.prompt && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Original Prompt:</p>
                          <p className="text-xs text-muted-foreground italic line-clamp-2">
                            "{video.prompt}"
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Your Message</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-6">
                {videos.length === 0 
                  ? "Start by recording your first video message"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {videos.length === 0 ? (
                <Button asChild>
                  <Link to="/record">Record Your First Message</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Video Modal */}
      {editingVideoData && (
        <EditVideoModal
          isOpen={!!editingVideo}
          onClose={() => setEditingVideo(null)}
          onSave={(updates) => handleEditVideo(editingVideo!, updates)}
          video={editingVideoData}
        />
      )}
    </div>
  );
}
