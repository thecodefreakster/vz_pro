import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export { storage, bucket };