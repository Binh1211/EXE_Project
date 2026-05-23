# Thiết kế Database MongoDB Atlas — Web Học Lịch Sử

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Phân quyền theo Role & Level](#2-phân-quyền-theo-role--level)
3. [Flow người dùng](#3-flow-người-dùng)
4. [Thiết kế Collections](#4-thiết-kế-collections)
5. [Indexes](#5-indexes)
6. [Business Rules](#6-business-rules)

---

## 1. Tổng quan hệ thống

| Thông tin | Chi tiết |
|---|---|
| Database | MongoDB Atlas |
| Tổng số collections | 11 |
| Roles | `admin`, `user` |
| User levels | Level 1 (free), Level 2 (paid), Level 3 (paid+) |
| Cấu trúc nội dung | Chương → Bài học → Video + Flashcard + Quiz + FAQ |
| Điều kiện mở bài tiếp theo | Điểm quiz ≥ 90% |

---

## 2. Phân quyền theo Role & Level

### Roles

| Role | Quyền hạn |
|---|---|
| `admin` | Toàn quyền: tạo/sửa/xóa chương, bài học, câu hỏi, quản lý người dùng |
| `user` | Học bài, làm quiz, tham gia group game (tùy level) |

### User Levels

| Level | Điều kiện | Quyền truy cập nội dung | Tính năng xã hội |
|---|---|---|---|
| **Level 1** | Đăng ký miễn phí | 2 bài đầu mỗi chương (`isFree: true`) | Tham gia group game nếu được mời |
| **Level 2** | Trả phí nâng cấp | Toàn bộ bài học | Tham gia group game nếu được mời |
| **Level 3** | Trả phí nâng cấp | Toàn bộ bài học | **Tạo group** + tham gia group game + xem leaderboard |

> **Lưu ý:** Tham gia group game không yêu cầu level 3. Bất kỳ user nào có `inviteCode` hoặc `joinCode` hợp lệ đều có thể tham gia. Xem leaderboard mở cho mọi level.

---

## 3. Flow người dùng

### 3.1 Flow đăng ký & nâng cấp level

```
Đăng ký
  └─► Tạo user (level=1, subscription.status="free")
        │
        ├─ Học 2 bài free
        │
        └─ Muốn học tiếp?
              └─► Chọn gói (level2 / level3)
                    └─► Thanh toán (VNPay / Momo / Stripe)
                          │
                          ├─ Thất bại → payment_transactions.status = "failed"
                          │
                          └─ Thành công
                                ├─ payment_transactions.status = "success"
                                ├─ users.level = 2 hoặc 3
                                ├─ users.subscription cập nhật
                                └─ Notification: "Nâng cấp thành công"
```

### 3.2 Flow học bài

```
Vào trang Chương
  └─► Load chapters (filter isPublished=true, sắp xếp theo order)
        └─► Chọn chương
              └─► Load lessons của chương
                    │
                    ├─ Level 1: Hiển thị tất cả, lock bài có isFree=false
                    ├─ Level 2+: Hiển thị và mở toàn bộ
                    │
                    └─► Chọn bài (status=unlocked)
                          │
                          ├─ [1] Xem VIDEO
                          │       └─► Cập nhật videoWatchedPct trong user_lesson_progress
                          │
                          ├─ [2] Học FLASHCARD
                          │       └─► Cập nhật flashcardsViewed = true
                          │
                          ├─ [3] FAQ BOT
                          │       └─► Hiển thị danh sách câu hỏi có sẵn
                          │             └─► Click câu hỏi → hiện answer (không gọi AI)
                          │
                          └─ [4] LÀM QUIZ
                                  └─► Nộp bài → Tạo quiz_attempts
                                        │
                                        ├─ score < 90% → Thông báo, cho làm lại
                                        │
                                        └─ score ≥ 90% (passed=true)
                                              ├─ Cập nhật user_lesson_progress.quizPassed = true
                                              ├─ Cộng XP vào users.totalXp
                                              ├─ Upsert user_lesson_progress bài kế tiếp → status="unlocked"
                                              ├─ Cập nhật leaderboard_entries
                                              └─ Notification: "Mở khóa bài mới!"
```

### 3.3 Flow tạo & tham gia Group Game (Level 3)

```
Tạo Group (chỉ Level 3)
  └─► POST /groups
        ├─ Middleware: kiểm tra users.level === 3
        ├─ Tạo groups document
        ├─ Sinh inviteCode (unique short code)
        └─► Chia sẻ inviteCode cho bạn bè

Tham gia Group (mọi level)
  └─► POST /groups/join { inviteCode }
        ├─ Validate inviteCode
        ├─ Thêm userId vào groups.members (role="member")
        └─► Vào được group

Tạo Game Session (host trong group)
  └─► POST /group-game-sessions
        ├─ Chọn quiz muốn chơi
        ├─ Sinh joinCode cho session
        └─► status = "waiting"

Tham gia Session (mọi level có joinCode)
  └─► POST /group-game-sessions/:id/join
        ├─ Validate joinCode và status="waiting"
        └─► Thêm vào participants

Bắt đầu game
  └─► status = "active", startedAt = now
        └─► Từng người làm quiz
              └─► Nộp bài xong → tính score, rank, timeTakenSec
                    └─► Khi tất cả nộp (hoặc timeout)
                          ├─ status = "ended", endedAt = now
                          ├─ Tính rank cuối cho từng participant
                          ├─ Cộng XP × xpMultiplier (x1.5 group bonus)
                          └─ Cập nhật leaderboard_entries
```

---

## 4. Thiết kế Collections

### 4.1 `users`

Lưu thông tin tài khoản, role, level và subscription.

```json
{
  "_id": "ObjectId",
  "email": "String (unique, indexed)",
  "passwordHash": "String",
  "displayName": "String",
  "avatarUrl": "String",
  "role": "String // 'admin' | 'user'",
  "level": "Number // 1 | 2 | 3",
  "levelUpgradedAt": "Date",
  "totalXp": "Number",
  "subscription": {
    "status": "String // 'free' | 'paid' | 'trial'",
    "plan": "String // 'level2' | 'level3'",
    "startDate": "Date",
    "expiresAt": "Date",
    "paymentRef": "String"
  },
  "oauthProviders": [{ "provider": "String", "uid": "String" }],
  "createdAt": "Date",
  "lastLoginAt": "Date",
  "isActive": "Boolean"
}
```

---

### 4.2 `refresh_tokens`

Quản lý phiên đăng nhập nhiều thiết bị. TTL index tự xóa token hết hạn.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "tokenHash": "String (unique)",
  "deviceInfo": "String",
  "expiresAt": "Date (TTL index)",
  "createdAt": "Date"
}
```

---

### 4.3 `chapters`

Đơn vị tổ chức lớn nhất. Mỗi chương chứa 3–5 bài học.

```json
{
  "_id": "ObjectId",
  "slug": "String (unique, indexed)",
  "title": "String",
  "description": "String",
  "coverImageUrl": "String",
  "order": "Number (indexed)",
  "requiredLevel": "Number // 1 | 2 | 3",
  "isPublished": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 4.4 `lessons`

Mỗi bài học thuộc một chương, chứa thông tin video nhúng trực tiếp.

```json
{
  "_id": "ObjectId",
  "chapterId": "ObjectId (ref: chapters, indexed)",
  "title": "String",
  "order": "Number (indexed)",
  "isFree": "Boolean // true nếu order ≤ 2",
  "isPublished": "Boolean",
  "video": {
    "url": "String",
    "provider": "String // 'youtube' | 'vimeo' | 's3'",
    "durationSec": "Number",
    "thumbnailUrl": "String"
  },
  "xpReward": "Number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 4.5 `flashcard_sets`

Bộ thẻ ghi nhớ gắn với bài học. Nhúng toàn bộ cards vào document.

```json
{
  "_id": "ObjectId",
  "lessonId": "ObjectId (ref: lessons)",
  "title": "String",
  "cards": [
    {
      "cardId": "ObjectId",
      "front": "String // câu hỏi / thuật ngữ",
      "back": "String // đáp án / giải thích",
      "imageUrl": "String",
      "order": "Number"
    }
  ],
  "createdAt": "Date"
}
```

---

### 4.6 `quizzes`

Bài kiểm tra cuối bài học. Nhúng toàn bộ câu hỏi và đáp án.

```json
{
  "_id": "ObjectId",
  "lessonId": "ObjectId (ref: lessons, indexed)",
  "title": "String",
  "passingScore": "Number // mặc định: 90 (%)",
  "timeLimitSec": "Number",
  "xpReward": "Number",
  "questions": [
    {
      "questionId": "ObjectId",
      "type": "String // 'mc' | 'truefalse' | 'fill'",
      "text": "String",
      "imageUrl": "String",
      "options": [{ "id": "ObjectId", "text": "String" }],
      "correctOptionId": "ObjectId",
      "explanation": "String",
      "points": "Number"
    }
  ],
  "createdAt": "Date"
}
```

---

### 4.7 `faq_items`

Câu hỏi & trả lời có sẵn cho từng bài học. Người dùng click câu hỏi → hiện đáp án (không dùng AI).

```json
{
  "_id": "ObjectId",
  "lessonId": "ObjectId (ref: lessons, indexed)",
  "question": "String",
  "answer": "String",
  "answerHtml": "String // rich text (optional)",
  "order": "Number",
  "category": "String // nhóm câu hỏi",
  "isActive": "Boolean",
  "createdAt": "Date"
}
```

---

### 4.8 `user_lesson_progress`

Trạng thái học tập của từng user trên từng bài. Đây là bảng trung tâm điều khiển logic mở bài.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "lessonId": "ObjectId (ref: lessons, indexed)",
  "status": "String // 'locked' | 'unlocked' | 'completed'",
  "videoWatchedPct": "Number // 0–100",
  "videoCompletedAt": "Date",
  "flashcardsViewed": "Boolean",
  "quizBestScore": "Number // % lần tốt nhất",
  "quizPassed": "Boolean // true khi score ≥ 90%",
  "quizAttempts": "Number",
  "completedAt": "Date // khi quizPassed = true",
  "xpEarned": "Number"
}
```

> **Index:** Compound unique `{ userId: 1, lessonId: 1 }`

---

### 4.9 `quiz_attempts`

Lưu lịch sử từng lần làm quiz, kể cả khi trượt.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "quizId": "ObjectId (ref: quizzes, indexed)",
  "lessonId": "ObjectId // denormalized để query nhanh",
  "score": "Number // % đúng",
  "passed": "Boolean // score ≥ 90%",
  "timeTakenSec": "Number",
  "answers": [
    {
      "questionId": "ObjectId",
      "selectedOption": "ObjectId",
      "isCorrect": "Boolean"
    }
  ],
  "xpAwarded": "Number",
  "submittedAt": "Date"
}
```

---

### 4.10 `groups`

Group do user Level 3 tạo. Mọi level có thể tham gia qua `inviteCode`.

```json
{
  "_id": "ObjectId",
  "ownerId": "ObjectId (ref: users) // phải là level 3",
  "name": "String",
  "description": "String",
  "inviteCode": "String (unique, indexed) // mọi level dùng để join",
  "maxMembers": "Number",
  "isPrivate": "Boolean",
  "members": [
    {
      "userId": "ObjectId // any level",
      "role": "String // 'owner' | 'mod' | 'member'",
      "joinedAt": "Date"
    }
  ],
  "createdAt": "Date"
}
```

| Hành động | Yêu cầu |
|---|---|
| Tạo group (`POST /groups`) | `users.level === 3` |
| Tham gia group (`POST /groups/join`) | `inviteCode` hợp lệ — mọi level |

---

### 4.11 `group_game_sessions`

Phiên chơi quiz theo nhóm. Người tham gia không giới hạn level.

```json
{
  "_id": "ObjectId",
  "groupId": "ObjectId (ref: groups, indexed)",
  "quizId": "ObjectId (ref: quizzes)",
  "hostId": "ObjectId (ref: users)",
  "status": "String // 'waiting' | 'active' | 'ended'",
  "joinCode": "String (indexed) // short code cho session",
  "startedAt": "Date",
  "endedAt": "Date",
  "participants": [
    {
      "userId": "ObjectId // any level",
      "score": "Number",
      "rank": "Number",
      "timeTakenSec": "Number"
    }
  ],
  "xpMultiplier": "Number // bonus x1.5 group play",
  "createdAt": "Date"
}
```

---

### 4.12 `leaderboard_entries`

Bảng xếp hạng. Hỗ trợ 3 scope: toàn hệ thống, theo group, và theo tuần. Mọi level đều xem được.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users) // any level",
  "scope": "String // 'global' | 'group' | 'weekly'",
  "groupId": "ObjectId // ref: groups, chỉ khi scope='group'",
  "period": "String // 'alltime' | '2024-W21'",
  "totalXp": "Number",
  "rank": "Number",
  "quizzesPassed": "Number",
  "lessonsCompleted": "Number",
  "groupSessionsWon": "Number",
  "updatedAt": "Date"
}
```

> **Index:** `{ scope: 1, period: 1, totalXp: -1 }` để sort rank nhanh

---

### 4.13 `payment_transactions`

Log đầy đủ mọi giao dịch thanh toán.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "status": "String // 'pending' | 'success' | 'failed' | 'refunded'",
  "gateway": "String // 'vnpay' | 'momo' | 'stripe'",
  "gatewayRef": "String // transaction ID từ payment gateway",
  "amountVnd": "Number",
  "planPurchased": "String // 'level2' | 'level3'",
  "durationDays": "Number",
  "metadata": "Object // raw payload từ gateway",
  "createdAt": "Date",
  "paidAt": "Date"
}
```

---

### 4.14 `notifications`

Thông báo hệ thống. TTL index tự xóa sau 90 ngày.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, indexed)",
  "type": "String // 'lesson_unlocked' | 'group_invite' | 'rank_changed' | 'payment'",
  "title": "String",
  "body": "String",
  "data": "Object // { entityId, link, ... }",
  "isRead": "Boolean (indexed)",
  "createdAt": "Date (TTL: 90 ngày)"
}
```

---

## 5. Indexes

### Indexes bắt buộc

| Collection | Index | Loại | Ghi chú |
|---|---|---|---|
| `users` | `{ email: 1 }` | Unique | Đăng nhập |
| `users` | `{ level: 1 }` | Single | Filter theo level |
| `users` | `{ role: 1 }` | Single | Phân quyền admin |
| `refresh_tokens` | `{ expiresAt: 1 }` | TTL | Tự xóa khi hết hạn |
| `chapters` | `{ order: 1 }` | Single | Sắp xếp hiển thị |
| `chapters` | `{ slug: 1 }` | Unique | URL routing |
| `lessons` | `{ chapterId: 1, order: 1 }` | Compound | Load bài trong chương |
| `lessons` | `{ isFree: 1 }` | Single | Filter bài free |
| `quizzes` | `{ lessonId: 1 }` | Single | Load quiz của bài |
| `faq_items` | `{ lessonId: 1 }` | Single | Load FAQ của bài |
| `user_lesson_progress` | `{ userId: 1, lessonId: 1 }` | Compound Unique | Core progress tracking |
| `user_lesson_progress` | `{ userId: 1, status: 1 }` | Compound | Load bài đang học |
| `quiz_attempts` | `{ userId: 1, quizId: 1 }` | Compound | Lịch sử làm quiz |
| `groups` | `{ inviteCode: 1 }` | Unique | Join group |
| `group_game_sessions` | `{ joinCode: 1 }` | Single | Join session |
| `group_game_sessions` | `{ groupId: 1, status: 1 }` | Compound | Load session của group |
| `leaderboard_entries` | `{ scope: 1, period: 1, totalXp: -1 }` | Compound | Sort rank |
| `payment_transactions` | `{ userId: 1, status: 1 }` | Compound | Lịch sử thanh toán |
| `notifications` | `{ userId: 1, isRead: 1 }` | Compound | Load thông báo chưa đọc |
| `notifications` | `{ createdAt: 1 }` | TTL (90 ngày) | Tự xóa cũ |

---

## 6. Business Rules

### Rule 1: Kiểm soát truy cập bài học

```
IF users.level === 1:
  Chỉ cho phép truy cập lessons WHERE isFree = true (order ≤ 2 trong chương)
  Bài khác → redirect trang mua gói

IF users.level >= 2:
  Cho phép truy cập tất cả lessons WHERE isPublished = true
```

### Rule 2: Mở khóa bài tiếp theo

```
Khi quiz_attempts được tạo với passed = true (score ≥ 90%):
  1. Cập nhật user_lesson_progress của bài hiện tại:
     - quizPassed = true
     - quizBestScore = max(current, newScore)
     - status = "completed"
     - completedAt = now()

  2. Tính lesson kế tiếp (cùng chương, order + 1):
     - Nếu tồn tại → upsert user_lesson_progress { status: "unlocked" }
     - Nếu là bài cuối chương → upsert bài đầu chương tiếp theo { status: "unlocked" }

  3. Cộng XP:
     - users.totalXp += quiz.xpReward
     - user_lesson_progress.xpEarned = quiz.xpReward

  4. Cập nhật leaderboard_entries (upsert theo scope+period+userId)

  5. Tạo notification: type = "lesson_unlocked"
```

### Rule 3: Tạo & tham gia Group

```
POST /groups (tạo group):
  Middleware: IF users.level !== 3 → 403 Forbidden

POST /groups/join (tham gia group):
  Kiểm tra inviteCode hợp lệ và group chưa đầy (members.length < maxMembers)
  Không kiểm tra level → mọi level đều join được

POST /group-game-sessions/:id/join (tham gia game session):
  Kiểm tra joinCode hợp lệ và session.status === "waiting"
  Không kiểm tra level → mọi level đều join được
```

### Rule 4: Thanh toán & nâng level

```
Khi payment_transactions.status chuyển sang "success":
  1. users.level = planPurchased === "level3" ? 3 : 2
  2. users.levelUpgradedAt = now()
  3. users.subscription = {
       status: "paid",
       plan: planPurchased,
       startDate: now(),
       expiresAt: now() + durationDays,
       paymentRef: gatewayRef
     }
  4. Tạo notification: type = "payment"
```

### Rule 5: XP Multiplier cho Group Game

```
Khi group_game_session kết thúc (status = "ended"):
  XP thực nhận = quiz.xpReward × session.xpMultiplier (mặc định x1.5)
  Áp dụng cho tất cả participants, không phân biệt rank
```

---

*Phiên bản: 1.1 — Cập nhật: logic tham gia group game không yêu cầu level 3*
