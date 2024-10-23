// "use server"

// import { Storage } from "@google-cloud/storage";

// export const GetSignedUrl = async (fileName: string) => {
//     const storage = new Storage({keyFilename: 'videoSubmitKey.json'});

//     const [url] = await storage.bucket('veezopro_videos')
//         .file(fileName)
//         .getSignedUrl(
//             {
//                 action: 'write',
//                 version: 'v4',
//                 expires: Date.now() + 15 * 60 * 1000,
//                 // contentType: 'application/octet-stream'
//             }
//         );
//         return url;
// }

// export const SetCors = async () => {
//     const storage = new Storage({keyFilename: 'videoSubmitKey.json'});
//     await storage.bucket('veezopro_videos').setCorsConfiguration([
//         {
//             maxAgeSeconds: 3600,
//             method: ['GET', 'PUT'],
//             origin: ['*'],
//             responseHeader: ['Content-Type'],
//         },
//     ]);
// }

// lib/actions.ts
"use server";

import { Storage } from "@google-cloud/storage";
import { NextApiRequest, NextApiResponse } from "next";

const BUCKET_NAME = 'veezopro_videos';
const storage = new Storage({ keyFilename: 'videoSubmitKey.json' });

// In-memory store for video links (use a database in production)
const videoLinks: { [key: string]: { fileName: string; url: string } } = {};

export const GetSignedUrl = async (fileName: string): Promise<string> => {
  const [url] = await storage.bucket(BUCKET_NAME)
    .file(fileName)
    .getSignedUrl({
      action: 'write',
      version: 'v4',
      expires: Date.now() + 15 * 60 * 1000,  // 15 minutes
    });
  return url;
};

export const setPublicAccess = async (fileName: string): Promise<void> => {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(fileName);
  await file.makePublic();
};

export const getPublicUrl = (fileName: string): string => {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
};

// Store the video link with its corresponding filename
export const storeVideoLink = (id: string, fileName: string): void => {
  const publicUrl = getPublicUrl(fileName);
  videoLinks[id] = { fileName, url: publicUrl };
};

// API handler for video redirection
export const handleRedirect = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const videoId = req.query['v-id'] as string;
  const videoData = videoLinks[videoId];

  if (videoData) {
    res.redirect(videoData.url);
  } else {
    res.status(404).send('Video not found');
  }
};

export const SetCors = async () => {
    await storage.bucket('veezopro_videos').setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ['GET'],
        origin: ['*'],
        responseHeader: ['Content-Type'],
      },
    ]);
  }
