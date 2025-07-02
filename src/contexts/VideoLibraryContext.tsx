
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SavedVideo {
  id: string;
  title: string;
  description: string;
  prompt?: string;
  videoBlob: Blob;
  videoUrl: string;
  duration: string;
  createdAt: string;
  isPublic: boolean;
  category: "wisdom" | "story" | "love" | "advice";
}

interface VideoLibraryContextType {
  videos: SavedVideo[];
  saveVideo: (video: Omit<SavedVideo, 'id' | 'createdAt' | 'videoUrl'>) => void;
  updateVideo: (id: string, updates: Partial<SavedVideo>) => void;
  deleteVideo: (id: string) => void;
}

const VideoLibraryContext = createContext<VideoLibraryContextType | null>(null);

export function VideoLibraryProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<SavedVideo[]>([]);

  // Load videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('savedVideos');
    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos);
      // Recreate blob URLs for saved videos
      const videosWithUrls = parsedVideos.map((video: any) => ({
        ...video,
        videoUrl: video.videoBlob ? URL.createObjectURL(new Blob([video.videoBlob])) : video.videoUrl
      }));
      setVideos(videosWithUrls);
    }
  }, []);

  // Save videos to localStorage whenever videos change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('savedVideos', JSON.stringify(videos));
    }
  }, [videos]);

  const saveVideo = (videoData: Omit<SavedVideo, 'id' | 'createdAt' | 'videoUrl'>) => {
    const newVideo: SavedVideo = {
      ...videoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      videoUrl: URL.createObjectURL(videoData.videoBlob)
    };
    
    setVideos(prev => [newVideo, ...prev]);
  };

  const updateVideo = (id: string, updates: Partial<SavedVideo>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  return (
    <VideoLibraryContext.Provider value={{ videos, saveVideo, updateVideo, deleteVideo }}>
      {children}
    </VideoLibraryContext.Provider>
  );
}

export function useVideoLibrary() {
  const context = useContext(VideoLibraryContext);
  if (!context) {
    throw new Error('useVideoLibrary must be used within a VideoLibraryProvider');
  }
  return context;
}
