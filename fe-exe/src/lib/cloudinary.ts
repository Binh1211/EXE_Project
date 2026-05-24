/**
 * Uploads a file directly to Cloudinary and returns the secure URL.
 * Uses the unauthenticated upload preset.
 * 
 * @param file The File object (from input type="file" or Dropzone)
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mern_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/duq6whfxw/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Lỗi khi tải ảnh lên Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
}
