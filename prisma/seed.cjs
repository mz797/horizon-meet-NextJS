// const {PrismaClient} = require("@prisma/client");
// const {faker} = require("@faker-js/faker/locale/en");
// const axios = require("axios");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();
//
// const prisma = new PrismaClient();
//
// cloudinary.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
//
// const TOTAL_EVENTS = 1_000_000;
// const BATCH_SIZE = 1000;
// const IMAGE_POOL_SIZE = 100;
//
// async function uploadImageToCloudinary(imageUrl) {
//     try {
//         const response = await axios.get(imageUrl, {responseType: "arraybuffer"});
//         const fileBuffer = Buffer.from(response.data, "binary");
//
//         const result = await new Promise((resolve, reject) => {
//             const uploadStream = cloudinary.uploader.upload_stream(
//                 {
//                     folder: "seeded-events",
//                     width: 600,
//                     height: 400,
//                     crop: "limit",
//                     quality: "auto",
//                 },
//                 (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                 }
//             );
//             uploadStream.end(fileBuffer);
//         });
//
//         return result.secure_url;
//     } catch (err) {
//         console.error("Cloudinary upload failed:", err.message);
//         return null;
//     }
// }
//
// async function generateImagePool() {
//     console.log("Uploading image pool...");
//     const imageUrls = [];
//
//     for (let i = 0; i < IMAGE_POOL_SIZE; i++) {
//         const picsumUrl = `https://picsum.photos/seed/${faker.string.uuid()}/600/400`;
//         const cloudinaryUrl = await uploadImageToCloudinary(picsumUrl);
//         if (cloudinaryUrl) {
//             imageUrls.push(cloudinaryUrl);
//             console.log(`Uploaded ${i + 1}/${IMAGE_POOL_SIZE}`);
//         } else {
//             console.log(`Failed to upload image ${i}`);
//         }
//     }
//
//     return imageUrls;
// }
//
// async function main() {
//     console.log("🌱 Starting seed...");
//     await prisma.user.upsert({
//         where: {email: "creator2@creator.com"},
//         update: {},
//         create: {
//             name: "creator2",
//             email: "creator2@creator.com",
//             password: "haslo123",
//         },
//     });
//
//     const user = await prisma.user.findFirst();
//     if (!user) throw new Error("User not found");
//
//     const imagePool = await generateImagePool();
//     if (imagePool.length === 0) throw new Error("No images uploaded");
//
//     console.log("🚀 Generating events...");
//
//     for (let i = 0; i < TOTAL_EVENTS; i += BATCH_SIZE) {
//         const batch = Array.from({length: BATCH_SIZE}).map(() => ({
//             title: faker.lorem.words(5),
//             description: faker.lorem.paragraph(),
//             date: faker.date.future(),
//             image: faker.helpers.arrayElement(imagePool),
//             organizerId: user.id,
//         }));
//
//         await prisma.event.createMany({data: batch});
//         if (i % 10000 === 0) {
//             console.log(`✅ Inserted ${i + BATCH_SIZE} / ${TOTAL_EVENTS}`);
//         }
//     }
//
//     console.log("✅ Seeding complete.");
// }
//
// main()
//     .catch((e) => {
//         console.error("❌ Error during seeding:", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
