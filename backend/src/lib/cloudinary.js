import {v2 as cloudinary}  from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpiwhpcjn',
  api_key: process.env.CLOUDINARY_API_KEY || '433918128237175',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0PRLcOOBoCCPYB-k1GYpBLRvMIQ',
})

export default cloudinary;