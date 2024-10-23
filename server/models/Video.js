import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  url: { 
    type: String, 
    required: true,
    unique: true 
  },
  storageUrl: { 
    type: String, 
    required: true 
  },
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  }
});

// Generate short ID before saving
videoSchema.pre('save', async function(next) {
  if (!this.shortId) {
    this.shortId = Math.random().toString(36).substring(2, 8);
    this.url = `veezo.pro/v_id=${this.shortId}`;
  }
  next();
});

export default mongoose.model('Video', videoSchema);