import  cloudinary from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//image storage
const storage = new CloudinaryStorage({
    cloudinary:cloudinary.v2,
    params: async (req,file)=>({
        folder:"uploads/images",
        format:file.mimetype.split('/')[1] || "jpg",
        transformation:[{width:500,height:500,crop:"limit"}],
        resourse_type:"image"

    })
})

//video storage
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => ({
      folder: "uploads/videos", 
      resource_type: "video", 
      format: file.mimetype.split("/")[1] || "mp4",  
    }),
})


//imgage upload middleware
const upload = multer({
    storage,
    limits:{
        fileSize:5*1024*1024,
    },
    fileFilter:(req,file,cb)=>{
        if(!file.mimetype.startsWith('image/')){
            cb(new Error("Only image files are allowed"));
            return;
        }
        cb(null, true);
    }
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("video/")) {
        cb(new Error("Only video files are allowed"));
        return;
      }
      cb(null, true);
    },
  });

  export {cloudinary,upload,uploadVideo};