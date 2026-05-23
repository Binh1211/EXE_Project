import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export function saveBase64Avatar(base64Data: string, userId: string): string {
  try {
    // Remove data URL prefix if present
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Validate base64 string
    if (!base64String || base64String.length === 0) {
      throw new Error("Invalid base64 data");
    }

    // Create filename
    const filename = `avatar-${userId}-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, filename);

    // Write file
    const buffer = Buffer.from(base64String, "base64");
    fs.writeFileSync(filePath, buffer);

    // Return URL path
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("[AVATAR] Error saving base64 avatar:", error);
    throw new Error(`Failed to save avatar: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export function deleteOldAvatar(avatarUrl: string): void {
  try {
    if (!avatarUrl || !avatarUrl.startsWith("/uploads/")) return;

    const filename = path.basename(avatarUrl);
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("[AVATAR] Deleted old avatar:", filename);
    }
  } catch (error) {
    console.error("[AVATAR] Error deleting old avatar:", error);
  }
}
