import { bucket } from '../config/storage.js';
import Video from '../models/Video.js';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;
    const filename = `${Date.now()}-${req.file.originalname}`;
    const blob = bucket.file(filename);
    
    // Create write stream and upload
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Handle upload errors
    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'Error uploading to storage' });
    });

    // On successful upload
    blobStream.on('finish', async () => {
      // Make the file public
      await blob.makePublic();
      
      // Get public URL
      const storageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      
      // Create video document
      const video = new Video({
        filename: req.file.originalname,
        title,
        description,
        storageUrl
      });

      await video.save();

      res.status(201).json({
        message: 'Video uploaded successfully',
        videoId: video.shortId,
        url: video.url
      });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ shortId: req.params.shortId });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json({
      id: video.shortId,
      title: video.title,
      description: video.description,
      url: video.url,
      fileUrl: video.storageUrl,
      views: video.views,
      uploadDate: video.uploadDate
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPopularVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .limit(10)
      .select('title description url views uploadDate');
    
    res.json(videos);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};