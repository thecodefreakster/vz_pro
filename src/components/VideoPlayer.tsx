import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Eye, Calendar, Loader2 } from 'lucide-react';

interface VideoData {
  title: string;
  description: string;
  fileUrl: string;
  views: number;
  uploadDate: string;
}

const VideoPlayer = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/v_id=${videoId}`);
        if (!response.ok) {
          throw new Error('Video not found');
        }
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError('Failed to load video');
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A]">
      <div className="relative pt-[56.25%] bg-black">
        <video
          className="absolute top-0 left-0 w-full h-full"
          controls
          autoPlay
          src={videoData.fileUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-[#1E293B] rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {videoData.title}
              </h1>
              {videoData.description && (
                <p className="text-slate-400">{videoData.description}</p>
              )}
            </div>
            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300"
            >
              <Share2 size={20} />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-6 text-slate-400">
            <div className="flex items-center space-x-2">
              <Eye size={20} />
              <span>{videoData.views} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>{new Date(videoData.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;