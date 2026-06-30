/**
 * Cloudinary image URLs - tất cả ảnh đã được upload lên Cloudinary
 * Folder: vistory/
 */
export const IMG = {
  // Lịch sử - Timeline
  VL_AL: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595642/vistory/VL_AL.png",
  bacThuoc: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595639/vistory/1000.jpg",
  thoiBinh: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595641/vistory/Thoi_binh.jpg",
  nam1945: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595640/vistory/1945.png",
  thongNhat: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595655/vistory/thong%20nhat.jpg",

  // Home / Team
  home1: "https://res.cloudinary.com/duq6whfxw/image/upload/v1782782657/vistory/home1.jpg",
  home2: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595645/vistory/home2.png",
  home3: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595646/vistory/home3.png",
  home4: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595647/vistory/home4.png",
  home5: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595647/vistory/home5.png",

  // Logo / Branding
  logo: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595649/vistory/logo.png",
  logoTitle: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595650/vistory/logo_title.jpg",
  logoWhite: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595650/vistory/logo_white.png",

  // Auth banners
  loginBanner: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595648/vistory/login_banner.jpg",
  registerBanner: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595652/vistory/register_banner.jpg",

  // Misc
  bg: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595643/vistory/bg.jpg",
  main: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595651/vistory/main.png",
  paperTexture: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595652/vistory/paper-texture.jpg",
  addressPic: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595642/vistory/address_pic.png",
  heart: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595644/vistory/heart.png",
  stumblingBlock: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595654/vistory/stumbling_block.png",
  unStumblingBlock: "https://res.cloudinary.com/duq6whfxw/image/upload/v1779595656/vistory/un_stumbling_block.png",
  bgDarkmode: "/BG_Darkmode.png", // TODO: replace with Cloudinary URL after upload

  // News (giữ local)
  news1: "/img/news1.png",
  news2: "/img/news2.png",
  news3: "/img/news3.png",
} as const;

/** Map đường dẫn /img/... trong DB → URL Cloudinary */
const LOCAL_TO_CLOUDINARY: Record<string, string> = {
  "/img/VL_AL.png": IMG.VL_AL,
  "/img/1000.jpg": IMG.bacThuoc,
  "/img/Thoi_binh.jpg": IMG.thoiBinh,
  "/img/1945.jpg": IMG.nam1945,
  "/img/1945.png": IMG.nam1945,
  "/img/thong nhat.jpg": IMG.thongNhat,
  "/img/logo.png": IMG.logo,
  "/img/logo_white.png": IMG.logoWhite,
  "/img/logo_title.jpg": IMG.logoTitle,
  "/img/home1.png": IMG.home1,
  "/img/home2.png": IMG.home2,
  "/img/home3.png": IMG.home3,
  "/img/home4.png": IMG.home4,
  "/img/home5.png": IMG.home5,
  "/img/bg.jpg": IMG.bg,
  "/img/main.png": IMG.main,
  "/img/paper-texture.png": IMG.paperTexture,
  "/img/paper-texture.jpg": IMG.paperTexture,
  "/img/address_pic.png": IMG.addressPic,
  "/img/login_banner.jpg": IMG.loginBanner,
  "/img/register_banner.jpg": IMG.registerBanner,
  "/img/heart.jpg": IMG.heart,
  "/img/heart.png": IMG.heart,
  "/img/stumbling_block.jpg": IMG.stumblingBlock,
  "/img/stumbling_block.png": IMG.stumblingBlock,
  "/img/un_stumbling_block.jpg": IMG.unStumblingBlock,
  "/img/un_stumbling_block.png": IMG.unStumblingBlock,
  "/I_1.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492406/vistory/I_1.png",
  "/I_2.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492407/vistory/I_2.png",
  "/I_3.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492408/vistory/I_3.png",
  "/II.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492409/vistory/II.png",
  "/bg_mindmap.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492411/vistory/bg_mindmap.png",
  "/frame.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492413/vistory/frame.png",
  "/title.png": "https://res.cloudinary.com/duq6whfxw/image/upload/v1780492413/vistory/title.png",
};

/**
 * Chuẩn hóa imageUrl từ API/DB:
 * - URL đầy đủ (http/https) → giữ nguyên
 * - /img/... đã upload Cloudinary → URL Cloudinary
 * - /img/news*.png → giữ local (theo yêu cầu)
 * - Còn lại → trả về như cũ
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return LOCAL_TO_CLOUDINARY[trimmed] ?? trimmed;
}
