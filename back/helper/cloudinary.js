const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
// const AWS = require('aws-sdk');
const { S3 } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_INARYSECRET, // Click 'View Credentials' below to copy your API secret
// });
// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// const fileupload = async (imgUrl, folderName) => {
//   try {
//     let resourceType = "image";
//     if (
//       imgUrl.endsWith(".mp4") ||
//       imgUrl.endsWith(".avi") ||
//       imgUrl.endsWith(".mov") ||
//       imgUrl.endsWith(".mkv")
//     ) {
//       resourceType = "video";
//     }
//     const uploadResult = await cloudinary.uploader
//       .upload(imgUrl, {
//         folder: folderName,
//         resource_type: resourceType,
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     return uploadResult;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const fileupload = (filePath, folderName,onProgress) => {
//   return new Promise((resolve, reject) => {
//     let resourceType = "image";
//     if (
//       filePath.endsWith(".mp4") ||
//       filePath.endsWith(".avi") ||
//       filePath.endsWith(".mov") ||
//       filePath.endsWith(".mkv")
//     ) {
//       resourceType = "video";
//     }

//     const fileSize = fs.statSync(filePath).size;
//     let uploadedBytes = 0;

//     const readStream = fs.createReadStream(filePath);
//     let lastPercent = 0;
//     readStream.on("data", (chunk) => {
//       uploadedBytes += chunk.length;
//       const percent = Math.round((uploadedBytes / fileSize) * 100);
//       if (percent > lastPercent) {
//         lastPercent = percent;
//         if (onProgress) onProgress(percent);
//       }
//     });

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: folderName,
//         resource_type: resourceType,
//         chunk_size: 9000000,
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true ,
//         // audio_codec: "auto",
//         // video_codec: "auto",
//         // flags: ["immutable_cache"],
//         // eager: [{ streaming_profile: "hd", format: "m3u8" }],
//         // eager_async: true,
//         // context: { preserve_subtitles: "true" ,extract_audio_tracks: "true"}
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
//     readStream.pipe(uploadStream);
//   });
// };
// Upload file to S3

const contentTypeMap = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".vtt": "text/vtt",
};

// Helper function to determine content type
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.mkv': 'video/x-matroska',
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.ts': 'video/mp2t',
    '.vtt': 'text/vtt',
  };
  return contentTypeMap[ext] || 'application/octet-stream';
};

const fileupload = async (filePath, folderName) => {
  try {
    // Read the file as a buffer instead of using a stream
    const fileBuffer = fs.readFileSync(filePath);
    
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/${path.basename(filePath)}`,
      Body: fileBuffer,
      ContentType: getContentType(filePath), // Add proper content type
    };

    const data = await s3.putObject(uploadParams);
    
    // Return the expected format that your controllers expect
    return {
      Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
      ETag: data.ETag,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
      public_id: data.ETag.replace(/"/g, ""),
    };
  } catch (error) {
    throw error;
  }
};

const uploadHLSFolder = async (folderPath, s3Folder) => {
  const files = fsExtra.readdirSync(folderPath);
  const uploadResults = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    const ext = path.extname(file).toLowerCase();
    const contentType = contentTypeMap[ext] || "application/octet-stream";

    if (
      !file.endsWith(".m3u8") &&
      !file.endsWith(".ts") &&
      !file.endsWith(".vtt")
    )
      continue;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${s3Folder}/${file}`,
      Body: fs.createReadStream(filePath),
      ACL: "public-read",
      ContentType: contentType,
    };

    // Use the Upload class to upload the file
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const res = await upload.done(); // Wait for the upload to complete
    uploadResults.push({
      name: file,
      url: res.Location,
      key: res.Key,
    });

    // Optionally delete the local file after upload
    fs.unlinkSync(filePath);
  }

  // Find the master playlist URL
  const master = uploadResults.find((f) => f.name.includes("master.m3u8"));
  return {
    masterUrl: master ? master.url : null,
    files: uploadResults,
    key: master?.key,
  };
};

// Upload HLS folder to S3
// const uploadHLSFolder = async (folderPath, s3Folder) => {
//   const files = fsExtra.readdirSync(folderPath);
//   const uploadResults = [];

//   for (const file of files) {
//     const filePath = path.join(folderPath, file);

//     if (!file.endsWith('.m3u8') && !file.endsWith('.ts') && !file.endsWith('.vtt')) continue;

//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `${s3Folder}/${file}`,
//       Body: fs.createReadStream(filePath),
//     };

//     const res = await s3.upload(uploadParams).promise();
//     uploadResults.push({
//       name: file,
//       url: res.Location,
//       key: res.Key,
//     });

//     // Optionally delete the local file after upload
//     fs.unlinkSync(filePath);
//   }

//   // Find the master playlist URL
//   const master = uploadResults.find(f => f.name === 'master.m3u8');
//   return {
//     masterUrl: master ? master.url : null,
//     files: uploadResults,
//     key: master?.key,
//   };
// };
// const deleteFile = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
// Delete file from S3
const deleteFile = async (fileKey) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };
  return s3.deleteObject(deleteParams).promise();
};

module.exports = {
  fileupload,
  deleteFile,
  uploadHLSFolder,
};
