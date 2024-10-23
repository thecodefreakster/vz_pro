// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Upload, Loader2 } from 'lucide-react';

// const HomePage = () => {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   const handleUpload = async (file: File) => {
//     setUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('title', file.name.split('.').slice(0, -1).join('.')); // Use filename as title
//     formData.append('description', ''); // Empty description by default

//     try {
//       const response = await fetch('https://veezo.pro/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.json();
//       navigate(`/v_id=${data.videoId}`);
//     } catch (err) {
//       setError('Failed to upload video. Please try again.');
//       setUploading(false);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.type.startsWith('video/')) {
//         handleUpload(file);
//       } else {
//         setError('Please select a valid video file.');
//       }
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
//       {error && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
//           {error}
//         </div>
//       )}

//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         accept="video/*"
//         className="hidden"
//       />

//       <button
//         onClick={() => fileInputRef.current?.click()}
//         disabled={uploading}
//         className="group relative bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-3"
//       >
//         {uploading ? (
//           <>
//             <Loader2 className="animate-spin" size={24} />
//             <span>Uploading...</span>
//           </>
//         ) : (
//           <>
//             <Upload size={24} />
//             <span>Upload Video</span>
//           </>
//         )}
//       </button>

//       <p className="mt-6 text-slate-400 text-center">
//         Upload and share your videos instantly.<br />
//         No account required.
//       </p>
//     </div>
//   );
// }

// export default HomePage;


import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2 } from 'lucide-react';

const HomePage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Step 1: Get signed URL from server
      const signedUrlResponse = await fetch(`/api/get-signed-url?fileName=${encodeURIComponent(file.name)}`);
      if (!signedUrlResponse.ok) throw new Error('Failed to get signed URL');

      const { url } = await signedUrlResponse.json(); // assuming your server returns { url }

      // Step 2: Upload the file using the signed URL
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      // Step 3: Navigate to the new URL with the generated ID
      const videoId = generateId(); // Or retrieve this from the server
      navigate(`/v_id=${videoId}`);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        handleUpload(file);
      } else {
        setError('Please select a valid video file.');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="video/*"
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="group relative bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-3"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            <span>Uploading... {uploadProgress}%</span>
          </>
        ) : (
          <>
            <Upload size={24} />
            <span>Upload Video</span>
          </>
        )}
      </button>

      <p className="mt-6 text-slate-400 text-center">
        Upload and share your videos instantly.
      </p>
    </div>
  );
}

const generateId = () => Math.random().toString(36).substring(2, 7);

export default HomePage;
