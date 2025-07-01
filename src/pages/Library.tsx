import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Heart, Search, Filter, Clock, Lock, Globe, Users } from "lucide-react";

interface LegacyMessage {
  id: string;
  title: string;
  description: string;
  creator: string;
  duration: string;
  createdAt: string;
  isPublic: boolean;
  isOwn: boolean;
  category: "wisdom" | "story" | "love" | "advice";
  thumbnail: string;
}

const sampleMessages: LegacyMessage[] = [
  {
    id: "1",
    title: "Letters to My Grandchildren",
    description: "Life lessons I wish I had learned earlier, passed down with love",
    creator: "You",
    duration: "12:45",
    createdAt: "2024-01-15",
    isPublic: false,
    isOwn: true,
    category: "wisdom",
    thumbnail: "bg-gradient-primary"
  },
  {
    id: "2",
    title: "A Father's Love",
    description: "Heartfelt words for my children about unconditional love and support",
    creator: "You",
    duration: "8:23",
    createdAt: "2024-01-10",
    isPublic: false,
    isOwn: true,
    category: "love",
    thumbnail: "bg-gradient-accent"
  },
  {
    id: "3",
    title: "Wisdom from 70 Years",
    description: "A grandmother shares life's most important lessons",
    creator: "Margaret Thompson",
    duration: "15:32",
    createdAt: "2024-01-08",
    isPublic: true,
    isOwn: false,
    category: "wisdom",
    thumbnail: "bg-primary/20"
  },
  {
    id: "4",
    title: "The Power of Resilience",
    description: "How to overcome life's challenges with grace and strength",
    creator: "Robert Chen",
    duration: "11:17",
    createdAt: "2024-01-05",
    isPublic: true,
    isOwn: false,
    category: "advice",
    thumbnail: "bg-accent/20"
  }
];

const categories = [
  { value: "all", label: "All Messages", icon: Globe },
  { value: "wisdom", label: "Wisdom", icon: Heart },
  { value: "story", label: "Stories", icon: Users },
  { value: "love", label: "Love", icon: Heart },
  { value: "advice", label: "Advice", icon: Clock }
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyOwn, setShowOnlyOwn] = useState(false);

  const filteredMessages = sampleMessages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || message.category === selectedCategory;
    const matchesOwnership = !showOnlyOwn || message.isOwn;
    
    return matchesSearch && matchesCategory && matchesOwnership;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || Heart;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Legacy Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover wisdom, stories, and heartfelt messages from people around the world
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

                  {/* Own Messages Toggle */}
                  <Button
                    variant={showOnlyOwn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowOnlyOwn(!showOnlyOwn)}
                    className="flex items-center space-x-1"
                  >
                    <Lock className="w-4 h-4" />
                    <span>My Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.map((message) => {
              const CategoryIcon = getCategoryIcon(message.category);
              
              return (
                <Card key={message.id} className="shadow-card hover:shadow-gentle transition-all duration-300 group">
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className={`aspect-video ${message.thumbnail} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="relative z-10 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {message.duration}
                      </div>
                      
                      {/* Privacy Indicator */}
                      <div className="absolute top-2 right-2">
                        {message.isPublic ? (
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
                          {message.category}
                        </Badge>
                        {message.isOwn && (
                          <Badge variant="outline" className="text-xs">
                            Your Message
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {message.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {message.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {message.creator}</span>
                        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredMessages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setShowOnlyOwn(false);
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}