import mongoose from "mongoose";
import { env } from "./env.js";

function getMongoHost(uri: string) {
  const match = uri.match(/@([^/]+)/);
  return match?.[1] ?? "unknown";
}

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  const host = getMongoHost(env.mongodbUri);
  console.log(`Đang kết nối MongoDB (${host})...`);

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 15000 });
    console.log(`✅ MongoDB Atlas connected — database: ${mongoose.connection.name}`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi kết nối không xác định";

    console.error("\n════════════════════════════════════════");
    console.error("  ❌ KHÔNG KẾT NỐI ĐƯỢC MONGODB ATLAS");
    console.error("════════════════════════════════════════");
    console.error(`Cluster: ${host}`);
    console.error(`Chi tiết: ${message}\n`);

    if (/whitelist|IP/i.test(message)) {
      console.error("Cách sửa:");
      console.error("  Atlas → Network Access → Add IP Address");
      console.error("  → Allow Access from Anywhere (0.0.0.0/0)");
      console.error("  → Đợi 1–2 phút rồi chạy lại: npm run dev\n");
    } else if (/authentication|bad auth/i.test(message)) {
      console.error("Cách sửa:");
      console.error("  Kiểm tra username/password trong .env (MONGODB_URI)");
      console.error("  Atlas → Database Access → reset password user\n");
    } else if (/ENOTFOUND|querySrv/i.test(message)) {
      console.error("Cách sửa:");
      console.error("  Kiểm tra connection string đúng cluster mới (exeproject.n4fqitr...)\n");
    }

    const dbError = new Error(
      `MongoDB: ${message.includes("whitelist") ? "IP chưa được whitelist trên Atlas" : message}`,
    );
    dbError.name = "DatabaseConnectionError";
    throw dbError;
  }
}
