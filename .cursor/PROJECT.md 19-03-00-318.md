# Project Documentation - StudyNest Learning Platform

> **MCP Context**: File này cung cấp context cho MCP server và AI để hiểu rõ dự án.  
> Xem thêm: `.cursor/ARCHITECTURE.md`, `.cursor/API.md`, `.cursor/MCP.md`

## Tổng quan dự án

StudyNest là một nền tảng học tập trực tuyến (E-learning platform) được xây dựng với Next.js 16, React 19, và TailwindCSS. Dự án sử dụng App Router của Next.js và tuân thủ các nguyên tắc thiết kế tối giản, hiệu năng cao.

## Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   └── (main)/            # Route groups
│       ├── (admin)/       # Admin routes
│       ├── (auth)/        # Authentication routes
│       ├── (lecturer)/    # Lecturer/Instructor routes
│       └── (user)/        # User/Student routes
│
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── lecturer/         # Lecturer components
│   ├── shared/           # Shared components
│   └── user/             # User components
│
├── lib/                   # Utilities & helpers
│   ├── utils/
│   │   ├── fetcher/      # API fetching utilities
│   │   │   ├── client/   # Client-side fetcher (axios)
│   │   │   └── server/   # Server-side fetcher
│   │   └── helpers/      # Helper functions
│   └── function/         # Business logic functions
│
├── hooks/                 # Custom React hooks
│   └── websocket/        # WebSocket hooks
│
├── types/                 # TypeScript type definitions
│   ├── admin/            # Admin types
│   ├── lecturer/         # Lecturer types
│   └── user/             # User types
│
├── stores/               # State management (Zustand)
├── provider/             # React context providers
└── config/               # Configuration files
```

## Kiến trúc & Patterns

### 1. Routing Structure (App Router)

- **Route Groups**: Sử dụng `(main)` để nhóm routes mà không ảnh hưởng URL
  - `(admin)`: `/admin/*` - Quản trị viên
  - `(auth)`: `/login`, `/register`, `/learning/*` - Xác thực và học tập
  - `(lecturer)`: `/lecturer/*` - Giảng viên
  - `(user)`: `/course/*`, `/` - Người dùng

### 2. Component Organization

- **Naming Convention**:

  - File: `kebab-case.tsx`
  - Component: `PascalCase`
  - Hook: `useXxx`

- **Component Structure**:
  - Mỗi component ≤ 150 dòng
  - Một component = một nhiệm vụ
  - Server Component mặc định, chỉ dùng `"use client"` khi cần interactivity

### 3. State Management

- **Zustand**: Quản lý global state (user store)
- **SWR**: Data fetching và caching
- **Local State**: `useState` cho UI state
- **WebSocket**: Real-time updates (comments, notifications)

### 4. API Communication

- **Client-side**: `axios` instance trong `lib/utils/fetcher/client/axios.ts`
- **Server-side**: `fetcher` function trong `lib/utils/fetcher/server/fetcher.ts`
- **Cookie Management**: `getServerCookie` cho server components
- **API Proxy**: Next.js rewrites `/api/*` → `backend/api/v1/*`

### 5. Styling

- **TailwindCSS 4**: Chỉ dùng Tailwind, không CSS thuần
- **Color Scheme**:
  - Primary: `#00bba7` (green)
  - Error: Red
  - Warning: Yellow
- **Responsive**: Mobile-first approach

## Các tính năng chính

### 1. User Features

- Xem danh sách khóa học
- Chi tiết khóa học với curriculum
- Học bài (Video, Code, Quiz)
- Q&A/Comments với real-time WebSocket
- Theo dõi tiến độ học tập

### 2. Lecturer Features

- Quản lý khóa học (CRUD)
- Quản lý chapters và lessons
- Tạo bài học: Video, Code, Quiz
- Quản lý tài nguyên (resources)
- Xem thống kê

### 3. Admin Features

- Quản lý users, lecturers
- Quản lý categories, topics
- Quản lý roles và permissions
- Dashboard thống kê

## Technical Stack

### Core

- **Next.js 16**: App Router, Server Components
- **React 19**: Latest React features
- **TypeScript 5**: Type safety

### UI & Styling

- **TailwindCSS 4**: Utility-first CSS
- **Framer Motion**: Animations (hạn chế)
- **React Icons**: Icon library
- **Lucide React**: Additional icons

### Data & State

- **SWR**: Data fetching
- **Zustand**: Global state
- **Axios**: HTTP client

### Rich Text & Code

- **Tiptap**: Rich text editor
- **CodeMirror**: Code editor
- **Monaco Editor**: Advanced code editor
- **Markdown**: Content rendering

### Media

- **React Player**: Video player
- **Video.js**: Advanced video features

### Other

- **WebSocket**: Real-time communication
- **Canvas Confetti**: Celebrations
- **DnD Kit**: Drag and drop

## API Structure

### Backend Base URL

- Development: `http://127.0.0.1:8000`
- Environment variable: `NEXT_PUBLIC_URL_BACKEND`

### API Endpoints Pattern

- `/api/v1/*` - Backend API
- Next.js rewrites `/api/*` → `${backend}/api/v1/*`

### Authentication

- JWT tokens stored in cookies
- `access_token`: Authentication token
- Server-side cookie access via `cookies()` from `next/headers`

## WebSocket Integration

### Connection

- Endpoint: `/api/v1/learning/ws/comments/{lessonId}`
- Authentication: `access_token` query parameter
- Hook: `connectWebSocket` in `hooks/websocket/connectWebSocket.ts`

### Events

- `comment_created`: New comment/reply created
- Real-time updates cho Q&A section

## Component Patterns

### 1. Server Components (Default)

```tsx
// No "use client" directive
export default async function Page({ params }: PageProps) {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### 2. Client Components

```tsx
"use client";
import { useState } from "react";

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // Interactive logic
}
```

### 3. Data Fetching

```tsx
// Server Component
const data = await fetcher("/endpoint", cookies());

// Client Component
const { data } = useSWR("key", () => api.get("/endpoint"));
```

## Type Definitions

Types được tổ chức theo domain:

- `types/admin/*`: Admin-related types
- `types/lecturer/*`: Lecturer-related types
- `types/user/*`: User-related types

## Best Practices

1. **Performance**:

   - Server Components mặc định
   - Memoization khi cần (`memo`, `useMemo`, `useCallback`)
   - Code splitting tự động với Next.js

2. **Code Quality**:

   - TypeScript strict mode
   - Không dùng `any` trừ khi cần thiết
   - Component nhỏ, dễ đọc

3. **UI/UX**:

   - Loading states (skeleton, spinners)
   - Error handling
   - Responsive design
   - Accessibility considerations

4. **Security**:
   - Server-side authentication checks
   - Cookie-based auth
   - API proxy để ẩn backend URL

## Environment Variables

- `NEXT_PUBLIC_URL_BACKEND`: Backend API URL

## Build & Deploy

- **Development**: `npm run dev`
- **Build**: `npm run build` (với Turbopack)
- **Start**: `npm start`

## Notes

- Không dùng i18n (next-intl đã bị xóa)
- Không dùng Redux/Context phức tạp
- Không dùng CSS thuần, chỉ Tailwind
- Màu sắc: chỉ green/red/yellow
- Code đơn giản, dễ hiểu, không over-engineer
