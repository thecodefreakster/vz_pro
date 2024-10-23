// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Upload, AlertCircle } from 'lucide-react';

// interface UploadPageProps {
//   setUploadedVideoId: (id: string) => void;
// }

// const UploadPage: React.FC<UploadPageProps> = ({ setUploadedVideoId }) => {
//   const [dragging, setDragging] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = () => {
//     setDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type.startsWith('video/')) {
//       setFile(droppedFile);
//       setError(null);
//     } else {
//       setError('Please upload a valid video file.');
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile && selectedFile.type.startsWith('video/')) {
//       setFile(selectedFile);
//       setError(null);
//     } else {
//       setError('Please upload a valid video file.');
//     }
//   };

//   const handleUpload = async () => {
//     if (!file || !title) {
//       setError('Please provide a title and select a video file.');
//       return;
//     }

//     setUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('title', title);
//     formData.append('description', description);

//     try {
//       const response = await fetch('http://localhost:5000/api/videos/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.json();
//       setUploadedVideoId(data.videoId);
//       navigate(`/v_id=${data.videoId}`);
//     } catch (err) {
//       setError('Failed to upload video. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full">
//         <h1 className="text-3xl font-bold text-center mb-8">Upload Your Video</h1>
//         <div
//           className={`border-4 border-dashed rounded-lg p-8 text-center ${
//             dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//           }`}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           {file ? (
//             <div>
//               <p className="text-lg mb-4">Selected file: {file.name}</p>
//               <input
//                 type="text"
//                 placeholder="Video Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-2 mb-4 border rounded"
//                 required
//               />
//               <textarea
//                 placeholder="Video Description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full p-2 mb-4 border rounded"
//               />
//               <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${
//                   uploading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {uploading ? 'Uploading...' : 'Upload Video'}
//               </button>
//             </div>
//           ) : (
//             <>
//               <Upload size={48} className="mx-auto mb-4 text-gray-400" />
//               <p className="text-lg mb-4">Drag and drop your video here, or click to select a file</p>
//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={handleFileInput}
//                 className="hidden"
//                 id="fileInput"
//               />
//               <label
//                 htmlFor="fileInput"
//                 className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300"
//               >
//                 Select Video
//               </label>
//             </>
//           )}
//         </div>
//         {error && (
//           <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
//             <AlertCircle size={24} className="mr-2" />
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';

interface UploadPageProps {
  setUploadedVideoId: (id: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ setUploadedVideoId }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Use environment variables for API URLs
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://veezo.pro';

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a valid video file.');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a valid video file.');
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setError('Please provide a title and select a video file.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch(`${API_BASE_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedVideoId(data.videoId);
      navigate(`/v_id=${data.videoId}`);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Upload Your Video</h1>
        <div
          className={`border-4 border-dashed rounded-lg p-8 text-center ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              <p className="text-lg mb-4">Selected file: {file.name}</p>
              <input
                type="text"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <textarea
                placeholder="Video Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          ) : (
            <>
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-4">Drag and drop your video here, or click to select a file</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300"
              >
                Select Video
              </label>
            </>
          )}
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle size={24} className="mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
