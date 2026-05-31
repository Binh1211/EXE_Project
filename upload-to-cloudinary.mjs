/**
 * Script upload ảnh lên Cloudinary
 * Chạy: node upload-to-cloudinary.mjs
 */
import { createReadStream } from "fs";
import { resolve, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLOUD_NAME = "duq6whfxw";
const UPLOAD_PRESET = "mern_upload"; // unsigned upload preset

const imgDir = resolve(__dirname, "fe-exe/public/img");

// Danh sách ảnh cần upload (bỏ news1, news2, news3)
const images = [
  "1000.jpg",
  "1945.jpg",
  "Thoi_binh.jpg",
  "VL_AL.png",
  "address_pic.png",
  "bg.jpg",
  "heart.jpg",
  "home1.png",
  "home2.png",
  "home3.png",
  "home4.png",
  "home5.png",
  "login_banner.png",
  "logo.png",
  "logo_title.jpg",
  "logo_white.png",
  "main.jpg",
  "paper-texture.png",
  "register_banner.png",
  "stumbling_block.jpg",
  "thong nhat.jpg",
  "un_stumbling_block.jpg",
];

const results = {};

async function uploadImage(filename) {
  const filePath = resolve(imgDir, filename);
  const publicId = basename(filename, filename.includes(".") ? "." + filename.split(".").pop() : "");

  const formData = new FormData();

  // Read file as Blob
  const { readFile } = await import("fs/promises");
  const fileBuffer = await readFile(filePath);
  const blob = new Blob([fileBuffer]);

  formData.append("file", blob, filename);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("public_id", `vistory/${publicId}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.secure_url;
}

async function main() {
  console.log(`🚀 Uploading ${images.length} images to Cloudinary...\n`);

  for (const img of images) {
    try {
      process.stdout.write(`  ⬆️  ${img} ... `);
      const url = await uploadImage(img);
      results[img] = url;
      console.log(`✅ ${url}`);
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      results[img] = null;
    }
  }

  console.log("\n\n📋 ===== KẾT QUẢ UPLOAD =====");
  console.log(JSON.stringify(results, null, 2));

  // In ra mapping để dùng trong code
  console.log("\n\n📋 ===== MAPPING (copy vào code) =====");
  for (const [img, url] of Object.entries(results)) {
    if (url) {
      console.log(`  "/img/${img}" => "${url}"`);
    }
  }
}

main();
