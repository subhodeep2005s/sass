// import { NextRequest, NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';

// import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient()

// // Configuration
// cloudinary.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
// });

// interface CloudinaryUploadResult {
//     public_id: string;
//     bytes: number;
//     duration?: number
//     [key: string]: unknown
// }

// export async function POST(request: NextRequest) {


//     try {

//         //todo to check user

//     if(
//         !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
//         !process.env.CLOUDINARY_API_KEY ||
//         !process.env.CLOUDINARY_API_SECRET
//     ){
//         return NextResponse.json({error: "Cloudinary credentials not found"}, {status: 500})
//     }


//         const formData = await request.formData();
//         const file = formData.get("file") as File | null;
//         const title = formData.get("title") as string;
//         const description = formData.get("description") as string;
//         const originalSize = formData.get("originalSize") as string;

//         if(!file){
//             return NextResponse.json({error: "File not found"}, {status: 400})
//         }

//         const bytes = await file.arrayBuffer()
//         const buffer = Buffer.from(bytes)

//         const result = await new Promise<CloudinaryUploadResult>(
//             (resolve, reject) => {
//                 const uploadStream = cloudinary.uploader.upload_stream(
//                     {
//                         resource_type: "video",
//                         folder: "video-uploads",
//                         transformation: [
//                             {quality: "auto", fetch_format: "mp4"},
//                         ]
//                     },
//                     (error, result) => {
//                         if(error) reject(error);
//                         else resolve(result as CloudinaryUploadResult);
//                     }
//                 )
//                 uploadStream.end(buffer)
//             }
//         )
//         const video = await prisma.video.create({
//             data: {
//                 title,
//                 description,
//                 publicId: result.public_id,
//                 originalSize: originalSize,
//                 compressedSize: String(result.bytes),
//                 duration: result.duration || 0,
//             }
//         })
//         return NextResponse.json(video)

//     } catch (error) {
//         console.log("UPload video failed", error)
//         return NextResponse.json({error: "UPload video failed"}, {status: 500})
//     } finally{
//         await prisma.$disconnect()
//     }

// }

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        // Check if Cloudinary credentials are available
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                { error: 'Cloudinary credentials not found' },
                { status: 500 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const originalSize = formData.get('originalSize') as string;

        // Validate if file exists
        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 400 });
        }

        // Convert the file to a buffer for uploading to Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload video to Cloudinary
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'video-uploads',
                    transformation: [
                        { quality: 'auto', fetch_format: 'mp4' }, // Transform to MP4 and auto quality
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        // Save video metadata to the database using Prisma
        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            },
        });

        // Return the video metadata response
        return NextResponse.json(video);
    } catch (error) {
        console.log('Upload video failed', error);
        return NextResponse.json({ error: 'Upload video failed' }, { status: 500 });
    } finally {
        // Disconnect Prisma client to avoid memory leaks
        await prisma.$disconnect();
    }
}
