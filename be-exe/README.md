# Backend — Web Học Lịch Sử

API Express + MongoDB Atlas, theo [lich-su-database-design.md](../lich-su-database-design.md).

## Yêu cầu

- Node.js 18+
- Cluster [MongoDB Atlas](https://cloud.mongodb.com)

## Cấu hình MongoDB Atlas

1. Vào project trên [MongoDB Cloud](https://cloud.mongodb.com/v2/6a10146e3a7bed1332e0f5d1#/overview)
2. **Database Access** → tạo user + password
3. **Network Access** → Add IP (dev: `0.0.0.0/0`)
4. **Database** → Connect → Drivers → copy connection string
5. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa `MONGODB_URI`:

```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/lich_su?retryWrites=true&w=majority
```

## Chạy

```bash
cd be-exe
npm install
npm run seed    # tạo admin + dữ liệu mẫu (lần đầu)
npm run dev     # http://localhost:8080
```

Admin mẫu: `admin@vistory.local` / `Admin@123`

## API Auth (khớp FE)

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/forgot-password` | Gửi email reset |
| POST | `/api/auth/reset-password` | Đặt lại MK (token từ email) |
| GET | `/api/auth/me` | Hồ sơ (Bearer) |
| PUT | `/api/auth/profile` | Cập nhật tên |
| PUT | `/api/auth/change-password` | Đổi MK |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/google` | Bắt đầu OAuth |
| GET | `/api/auth/google/callback` | Callback Google |

## Email quên mật khẩu

Cấu hình SMTP trong `.env`. Nếu chưa có SMTP, link reset in ra console (dev).

## Google OAuth

Tạo OAuth Client tại Google Cloud Console, thêm redirect URI:

`http://localhost:8080/api/auth/google/callback`
