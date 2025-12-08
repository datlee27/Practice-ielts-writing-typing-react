# IELTS Writing Practice - Full Stack Monorepo

Ứng dụng luyện thi IELTS Writing với kiến trúc monorepo bao gồm cả Frontend (React) và Backend (Node.js/Express/MySQL).

## 🏗️ Kiến trúc Monorepo

```
ielts-writing-practice/
├── client/                 # Frontend React App
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend API
│   ├── src/
│   ├── package.json
│   └── .env.example
├── package.json           # Root package.json
└── setup.sh              # Setup script
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 16+
- MySQL 8.0+
- npm hoặc yarn

### 1. Clone và cài đặt
```bash
git clone <repository-url>
cd ielts-writing-practice

# Chạy script setup tự động
./setup.sh
```

### Hoặc cài đặt manual:
```bash
# Cài đặt dependencies cho cả client và server
npm install
npm run install:client
npm run install:server

# Tạo database MySQL
mysql -u root -p
CREATE DATABASE ielts_writing_practice;

# Cấu hình environment
cp server/.env.example server/.env
# Edit server/.env với thông tin database của bạn

# Chạy migrations và seed data
npm run db:migrate
npm run db:seed
```

### 2. Chạy ứng dụng
```bash
# Chạy cả client và server cùng lúc
npm run dev

# Hoặc chạy riêng lẻ:
npm run dev:client    # Frontend: http://localhost:5173
npm run dev:server    # Backend API: http://localhost:5000
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Thông tin profile

### Prompts (Đề bài)
- `GET /api/prompts` - Lấy danh sách prompts
- `GET /api/prompts/random` - Lấy prompts ngẫu nhiên
- `GET /api/prompts/:id` - Chi tiết prompt

### Tests (Bài luyện gõ)
- `POST /api/tests` - Lưu kết quả test
- `GET /api/tests` - Lịch sử tests
- `GET /api/tests/stats` - Thống kê tests
- `GET /api/tests/:id` - Chi tiết test

### Essays (Bài viết)
- `POST /api/essays/upload` - Upload ảnh và OCR
- `POST /api/essays` - Nộp bài viết
- `POST /api/essays/:id/score` - Chấm điểm AI
- `GET /api/essays` - Danh sách essays
- `GET /api/essays/stats` - Thống kê essays

## 🛠️ Scripts

### Root level
- `npm run dev` - Chạy cả client và server
- `npm run dev:client` - Chạy chỉ client
- `npm run dev:server` - Chạy chỉ server
- `npm run build` - Build client
- `npm run install:all` - Cài đặt tất cả dependencies

### Client scripts
- `npm run dev --workspace=client` - Development server
- `npm run build --workspace=client` - Production build

### Server scripts
- `npm run dev --workspace=server` - Development server
- `npm run build --workspace=server` - Build TypeScript
- `npm run db:migrate --workspace=server` - Database migrations
- `npm run db:seed --workspace=server` - Seed data

## 🗄️ Database Schema

### Users
- Quản lý tài khoản người dùng
- Authentication với JWT

### Prompts
- Đề bài IELTS Writing Task 1 & 2
- Phân loại theo độ khó và chủ đề

### Tests
- Lưu kết quả bài luyện gõ
- Theo dõi WPM, accuracy, thời gian

### Essays
- Bài viết của học viên
- AI scoring theo tiêu chí IELTS
- OCR cho bài viết dạng ảnh

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ielts_writing_practice
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## 🌟 Tính năng chính

### Frontend (React + TypeScript)
- ⚡ Vite build tool
- 🎨 Tailwind CSS + Radix UI
- 🔐 Authentication context
- 📱 Responsive design
- 🌙 Dark mode support

### Backend (Node.js + Express)
- 🔒 JWT Authentication
- 📊 MySQL với Sequelize ORM
- 🤖 AI Scoring cho IELTS Writing
- 📷 OCR với Tesseract.js
- 🛡️ Security middleware
- 📝 Input validation

### AI Features
- 🎯 Tự động chấm điểm theo 4 tiêu chí IELTS
- 📷 OCR nhận diện text từ ảnh bài làm
- 💡 Phản hồi chi tiết và gợi ý cải thiện

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License