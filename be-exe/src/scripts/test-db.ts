import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ Thiếu MONGODB_URI trong file .env");
  process.exit(1);
}

const masked = uri.replace(/:([^@/]+)@/, ":****@");
console.log("Đang thử kết nối:", masked);

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log("✅ Kết nối MongoDB Atlas thành công!");
  console.log("   Host:", mongoose.connection.host);
  console.log("   Database:", mongoose.connection.name);
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error("\n❌ Kết nối THẤT BẠI\n");
  if (err instanceof Error) {
    console.error(err.message);
    if (err.message.includes("whitelist") || err.message.includes("IP")) {
      console.error("\n→ Vào Atlas → Network Access → Add IP → 0.0.0.0/0");
    }
    if (err.message.includes("authentication failed")) {
      console.error("\n→ Sai username/password. Tạo lại user trên Database Access.");
    }
  } else {
    console.error(err);
  }
  process.exit(1);
}
