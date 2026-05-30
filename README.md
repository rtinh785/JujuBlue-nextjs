# JujuBlue Frontend

JujuBlue là một mini social platform được xây dựng để luyện tập fullstack thực tế. Dự án mô phỏng các chức năng cốt lõi của mạng xã hội như đăng nhập, quản lý hồ sơ cá nhân, đăng bài, tương tác bài viết, follow người dùng, tìm kiếm, thông báo và nhắn tin realtime.

Repository này là phần frontend của JujuBlue, được phát triển bằng Next.js, TypeScript, Tailwind CSS và TanStack Query. Frontend giao tiếp với backend NestJS thông qua REST API và Socket.IO để xử lý realtime message.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- Socket.IO Client
- Supabase Client
- React Hook Form
- Zod / Yup
- Lingui

## Main Features

- Authentication flow cho user đăng nhập và sử dụng các chức năng yêu cầu tài khoản.
- Home feed hiển thị bài viết và các tương tác cơ bản.
- Profile page cho xem thông tin người dùng, cập nhật avatar, cover photo và profile.
- Follow / unfollow người dùng.
- Search page để tìm kiếm nội dung hoặc người dùng.
- Notification UI cho các hoạt động liên quan đến user.
- Messages page dạng full viewport, chia 2 cột gồm danh sách cuộc trò chuyện và khung chat.
- Realtime messaging bằng Socket.IO.
- Unread badge cho tin nhắn mới.
- Infinite scroll cho danh sách conversation và lịch sử tin nhắn.
- Cache, refetch và mutation state bằng TanStack Query.

## Project Structure

```bash
src/
├── apis/              # API clients, query hooks, query keys
├── app/               # Next.js App Router pages and layouts
├── components/        # Shared UI and layout components
├── core/              # Constants, configs, shared types
├── hooks/             # Reusable React hooks
├── modules/           # Feature modules: Home, Profile, Search, Messages...
├── schema/            # Form validation schemas
├── translations/      # Lingui translation files
└── utils/             # Shared helper functions
```

## Requirements

- Node.js
- pnpm
- JujuBlue backend running locally
- Supabase project configured for authentication and storage/database features

## Environment Variables

Create a `.env` file from `.env.example` and update the values:

```bash
cp .env.example .env
```

Required variables:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

Note: do not commit real environment values. Keep secrets out of the repository.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open the app:

```bash
http://localhost:3000
```

Make sure the backend is also running, usually at:

```bash
http://localhost:4000
```

## Available Scripts

```bash
pnpm dev
```

Run the app in development mode.

```bash
pnpm build
```

Build the production version.

```bash
pnpm start
```

Start the production server after build.

```bash
pnpm lint:fix
```

Run ESLint and fix auto-fixable issues.

```bash
pnpm format
```

Format the codebase with Prettier.

```bash
pnpm run translations
```

Extract and compile Lingui translation files.

## Messages Flow

The message feature uses both REST API and Socket.IO.

- REST API is used to create/get conversations, fetch conversation list, fetch messages, send messages and mark conversations as read.
- Socket.IO is used to receive new messages and update unread state in realtime.
- The messages page keeps the newest messages at the bottom.
- Pulling upward loads older messages without jumping the scroll position.
- Sending or receiving a new message scrolls the active chat to the newest message.

## Backend Repository

This frontend is designed to work with the JujuBlue NestJS backend. The backend handles API routes, authentication-related checks, database access, message persistence and Socket.IO gateway events.

## Current Status

The project is currently developed and tested locally. Deployment is not configured yet.
