# Architecture Guide - StudyNest

## Component Architecture

### Component Hierarchy

```
App Layout
├── User Layout / Admin Layout / Lecturer Layout
│   ├── Header
│   ├── Sidebar (Admin/Lecturer)
│   └── Main Content
│       ├── Page Components
│       └── Feature Components
```

### Component Categories

#### 1. Page Components (`app/**/page.tsx`)
- Server Components mặc định
- Fetch data từ API
- Pass data xuống feature components

#### 2. Feature Components (`components/**/index.tsx`)
- Business logic components
- Có thể là Server hoặc Client Component
- Tái sử dụng được

#### 3. Shared Components (`components/shared/`)
- Reusable UI components
- Không phụ thuộc business logic
- Examples: `data-table`, `pagination`, `loading`

#### 4. Layout Components
- `app/**/layout.tsx`: Route layouts
- `components/**/header/`, `components/**/footer/`: UI layouts

## Data Flow

### Server-Side Data Fetching

```
Page Component (Server)
  ↓
fetcher() utility
  ↓
Backend API
  ↓
Return data
  ↓
Pass to Client Components
```

### Client-Side Data Fetching

```
Client Component
  ↓
useSWR hook
  ↓
axios instance
  ↓
Backend API
  ↓
Cache & Revalidate
```

### Real-Time Updates

```
WebSocket Connection
  ↓
Event Handler
  ↓
Update Local State
  ↓
Re-render Component
```

## State Management Strategy

### 1. Server State (SWR)
- API data
- Caching & revalidation
- Example: Course list, user data

### 2. Global State (Zustand)
- User authentication state
- Cross-component state
- Example: `stores/user.ts`

### 3. Local State (useState)
- UI state (modals, forms)
- Component-specific state
- Example: `isOpen`, `formData`

### 4. URL State
- Route parameters
- Search params
- Example: `params.slug`, `searchParams.page`

## API Integration Patterns

### Server Component Pattern
```tsx
// app/page.tsx
export default async function Page() {
  const cookies = await cookies();
  const data = await fetcher("/endpoint", cookies);
  return <Component data={data} />;
}
```

### Client Component Pattern
```tsx
// components/Component.tsx
"use client";
import useSWR from "swr";

export default function Component() {
  const { data } = useSWR("key", () => api.get("/endpoint"));
  return <div>{data}</div>;
}
```

### WebSocket Pattern
```tsx
"use client";
import { useEffect, useRef } from "react";
import { connectWebSocket } from "@/hooks/websocket/connectWebSocket";

export default function Component() {
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = await connectWebSocket("/endpoint", token, (data) => {
      // Handle event
    });
    wsRef.current = ws;
    return () => ws.close();
  }, []);
}
```

## Routing Patterns

### Dynamic Routes
```tsx
// app/course/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  // Use slug
}
```

### Route Groups
- `(admin)`: `/admin/*`
- `(auth)`: `/login`, `/register`
- `(lecturer)`: `/lecturer/*`
- `(user)`: `/`, `/course/*`

### Layouts
- Root layout: `app/layout.tsx`
- Group layouts: `app/(main)/**/layout.tsx`
- Nested layouts: Support nested route groups

## Error Handling

### Server Components
```tsx
try {
  const data = await fetcher("/endpoint");
} catch (error) {
  redirect("/error");
}
```

### Client Components
```tsx
const { data, error } = useSWR("key", fetcher);
if (error) return <ErrorComponent />;
```

## Performance Optimizations

### 1. Code Splitting
- Automatic với Next.js App Router
- Dynamic imports khi cần

### 2. Image Optimization
- Next.js Image component
- Remote patterns configured

### 3. Memoization
- `memo()` cho components
- `useMemo()` cho expensive calculations
- `useCallback()` cho function props

### 4. Server Components
- Default: Server Components
- Chỉ dùng Client khi cần interactivity

## Security Patterns

### Authentication
- Server-side cookie checks
- Protected routes với redirect
- Token trong cookies

### API Security
- Proxy qua Next.js
- Backend URL không expose
- Server-side API calls

## Testing Strategy

### Component Testing
- Unit tests cho utilities
- Integration tests cho features

### E2E Testing
- Critical user flows
- Authentication flows

## Deployment Considerations

### Environment Variables
- `NEXT_PUBLIC_*`: Client-side
- Server-only: Không có prefix

### Build Optimization
- Turbopack enabled
- Static generation khi có thể
- ISR cho dynamic content

