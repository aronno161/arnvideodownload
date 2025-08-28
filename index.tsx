"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Play, AlertCircle, CheckCircle } from "lucide-react";

export default function YouTubeDownloader() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [videoInfo, setVideoInfo] = useState < {
        title: string;
        thumbnail: string;
        duration: string;
        id: string;
    } | null > (null);
    const [downloadStatus, setDownloadStatus] = useState < "idle" | "processing" | "ready" > ("idle");
    const inputRef = useRef < HTMLInputElement > (null);
    
    const validateYouTubeUrl = (url: string): boolean => {
        const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regExp.test(url);
    };
    
    const extractVideoId = (url: string): string | null => {
        // Regular video patterns
        const regExp1 = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match1 = url.match(regExp1);
        if (match1 && match1[2].length === 11) {
            return match1[2];
        }
        
        // Shorts pattern
        const regExp2 = /^.*(youtube\.com\/shorts\/)([^#&?]*).*/;
        const match2 = url.match(regExp2);
        if (match2 && match2[2]) {
            return match2[2].split('?')[0]; // Remove query params
        }
        
        return null;
    };
    
    // Format seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setError("");
            setVideoInfo(null);
            setDownloadStatus("idle");
            
            if (!url.trim()) {
                setError("Please enter a YouTube URL");
                inputRef.current?.focus();
                return;
            }
            
            if (!validateYouTubeUrl(url)) {
                setError("Please enter a valid YouTube URL");
                inputRef.current?.focus();
                return;
            }
            
            const videoId = extractVideoId(url);
            if (!videoId) {
                setError("Invalid YouTube URL format");
                return;
            }
            // Simulate processing with realistic metadata
    setIsLoading(true);
    
    // In a real app, this would be an API call to your backend
    // which would fetch actual metadata from YouTube
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate realistic video data
      const isShort = url.includes('/shorts/');
      const durationSeconds = isShort 
        ? Math.floor(Math.random() * 45) + 15 // 15-60 seconds for shorts
        : Math.floor(Math.random() * 1200) + 120; // 2-20 minutes for videos
      
      setVideoInfo({
        title: isShort 
          ? "Funny Cat Short - Daily Dose of Happiness" 
          : "How to Build a YouTube Downloader - Complete Tutorial",
        thumbnail: `https://img.youtube.com/vi/${videoId.replace('shorts/', '')}/mqdefault.jpg`,
        duration: formatDuration(durationSeconds),
        id: videoId.replace('shorts/', '')
      });
    }, 1500);
  };

  const handleDownload = (format: "video" | "audio") => {
    if (!videoInfo) return;
    
    setDownloadStatus("processing");
    
    // Simulate backend processing
    setTimeout(() => {
      setDownloadStatus("ready");
      
      // THIS IS THE REAL DOWNLOAD IMPLEMENTATION:
      // Create a temporary link element
      const downloadUrl = `https://example.com/api/download/${videoInfo.id}?format=${format}&t=${new Date().getTime()}`;
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format === 'video' ? 'mp4' : 'mp3'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setTimeout(() => {
        alert(`Download started for: ${videoInfo.title}`);
      }, 100);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">YouTube Video Downloader</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Download YouTube videos and Shorts in high quality
          </p>
        </div>

        <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Download YouTube Content</CardTitle>
            <CardDescription className="text-gray-600">
              Paste any YouTube video or Shorts URL below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url" className="text-gray-700">YouTube URL</Label>
                <div className="flex">
                  <Input
                    ref={inputRef}
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`flex-1 rounded-r-none ${error ? "border-red-500" : ""}`}
                  />
                  <Button 
                    type="submit" 
                    className="rounded-l-none bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Play className="mr-2 h-4 w-4" />
                        Process
                      </span>
                    )}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="mr-1 h-4 w-4" /> {error}</p>}
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center">
            {videoInfo && (
              <div className="w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    {videoInfo.thumbnail ? (
                      <img 
                        src={videoInfo.thumbnail} 
                        alt="Video thumbnail" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
                    )}
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{videoInfo.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Duration: {videoInfo.duration}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleDownload("video")}
                    disabled={downloadStatus === "processing"}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {downloadStatus === "processing" ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Preparing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download Video
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownload("audio")}
                    disabled={downloadStatus === "processing"}
                    className="flex-1"
                  >
                    {downloadStatus === "processing" ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></span>
                        Preparing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audio
                      </span>
                    )}
                    </Button>
                </div>
                
                {downloadStatus === "ready" && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center">
                    <CheckCircle className="text-green-500 mr-2" />
                    <p className="text-sm text-green-700">
                      Download ready! The file should start downloading automatically.
                    </p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  By downloading, you agree to our Terms of Service
                </p>
              </div>
            )}
            
            {!videoInfo && !isLoading && (
              <div className="text-center py-4 w-full">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <Play className="text-gray-500" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Enter a YouTube URL to get started
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-gray-800">Supports All Content</h3>
            <p className="text-sm text-gray-600 mt-1">Videos, Shorts, and Live streams</p>
          </div>
          <div className="bg-white/80 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-gray-800">High Quality</h3>
            <p className="text-sm text-gray-600 mt-1">Up to 4K resolution support</p>
          </div>
          <div className="bg-white/80 p-4 rounded-lg text-center">
            <h3 className="font-semibold text-gray-800">Multiple Formats</h3>
            <p className="text-sm text-gray-600 mt-1">MP4, MP3, AVI, and more</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p className="font-semibold text-red-500">Legal Disclaimer:</p>
          <p className="mt-1">This is a demonstration only. Downloading YouTube content may violate their Terms of Service. Use responsibly and only for content you have rights to.</p>
          <p className="mt-2">© {new Date().getFullYear()} YouTube Downloader Demo</p>
        </div>
      </div>
    </div>
  );
}
