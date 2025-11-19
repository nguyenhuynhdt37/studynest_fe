# API Documentation - StudyNest

## Base Configuration

- **Backend URL**: `http://127.0.0.1:8000` (dev) hoặc từ `NEXT_PUBLIC_URL_BACKEND`
- **API Prefix**: `/api/v1`
- **Proxy**: Next.js rewrites `/api/*` → `${backend}/api/v1/*`

## Authentication

### Token Storage

- **Method**: HTTP-only cookies
- **Token Name**: `access_token`
- **Server Access**: `getServerCookie(cookies, "access_token")`

### Authentication Flow

1. User login → Backend returns token
2. Token stored in cookie
3. Subsequent requests include token automatically
4. Server components check token via `cookies()`

## API Utilities

### Server-Side (`lib/utils/fetcher/server/fetcher.ts`)

```tsx
import { fetcher } from "@/lib/utils/fetcher/server/fetcher";
import { cookies } from "next/headers";

const cookieStore = await cookies();
const response = await fetcher("/endpoint", cookieStore);
```

### Client-Side (Ưu tiên SWR + Axios)

**Pattern 1: SWR với Axios (Khuyến nghị)**

```tsx
import useSWR from "swr";
import api from "@/lib/utils/fetcher/client/axios";

// GET request với caching
const { data, error, isLoading, mutate } = useSWR("key", () =>
  api.get("/endpoint").then((res) => res.data)
);

// POST/PUT/DELETE: Dùng mutate sau khi thao tác
const handleSubmit = async () => {
  await api.post("/endpoint", data);
  mutate(); // Revalidate data
};
```

**Pattern 2: Axios trực tiếp (Chỉ khi không cần caching)**

```tsx
import api from "@/lib/utils/fetcher/client/axios";

// Chỉ dùng khi không cần caching/revalidation
const response = await api.get("/endpoint");
const response = await api.post("/endpoint", data);
```

**Lưu ý**: Luôn ưu tiên SWR cho data fetching vì:

- Tự động caching
- Revalidation
- Deduplication
- Error handling

## Data Fetching Best Practices

### Client-Side Fetching

1. **Luôn ưu tiên SWR** cho data fetching
2. **Kết hợp với axios** instance từ `lib/utils/fetcher/client/axios`
3. **SWR benefits**:
   - Automatic caching
   - Background revalidation
   - Request deduplication
   - Error retry
   - Loading states

### Example: SWR với Axios

```tsx
"use client";
import useSWR from "swr";
import api from "@/lib/utils/fetcher/client/axios";

export default function Component() {
  const { data, error, isLoading, mutate } = useSWR(
    "courses-list",
    () => api.get("/learning/courses").then((res) => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div>
      {data?.items.map((item) => (
        <Item key={item.id} data={item} />
      ))}
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

## Common Endpoints

### User Endpoints

- `GET /learning/{slug}` - Course detail
- `GET /learning/{lessonId}/comments` - Comments
- `POST /learning/comments/{id}/reactions` - React to comment
- `GET /learning/comments/{id}/reacts` - Get reaction users

### Lecturer Endpoints

- `GET /lecturer/courses` - List courses
- `POST /lecturer/courses` - Create course
- `PUT /lecturer/courses/{id}` - Update course
- `DELETE /lecturer/courses/{id}` - Delete course

### Admin Endpoints

- `GET /admin/users` - List users
- `GET /admin/lecturers` - List lecturers
- `GET /admin/topics` - List topics
- `GET /admin/categories` - List categories

## WebSocket Endpoints

### Comments WebSocket

- **Endpoint**: `/api/v1/learning/ws/comments/{lessonId}`
- **Auth**: `access_token` query parameter
- **Events**:
  - `comment_created`: New comment/reply created
    ```json
    {
      "type": "comment_created",
      "comment": {
        "id": "uuid",
        "lesson_id": "uuid",
        "root_id": "uuid",
        "parent_id": "uuid",
        "user_id": "uuid",
        "user_avatar": "url",
        "fullname": "string",
        "content": "string",
        "depth": 0,
        "created_at": "ISO8601"
      }
    }
    ```

## Request/Response Patterns

### Success Response

```json
{
  "ok": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "ok": false,
  "error": "Error message"
}
```

## Error Handling

### Server Components

```tsx
const response = await fetcher("/endpoint", cookies);
if (!response.ok) {
  redirect("/error");
}
```

### Client Components (SWR Pattern)

```tsx
import useSWR from "swr";
import api from "@/lib/utils/fetcher/client/axios";

function Component() {
  const { data, error, isLoading } = useSWR("endpoint-key", () =>
    api.get("/endpoint").then((res) => res.data)
  );

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return <div>{data}</div>;
}
```

### Client Components (Direct Axios - Chỉ khi cần)

```tsx
import api from "@/lib/utils/fetcher/client/axios";

async function handleAction() {
  try {
    const response = await api.post("/endpoint", data);
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

## Pagination

### Query Parameters

- `limit`: Số items per page (default: 20)
- `cursor`: Pagination cursor
- `has_next`: Boolean, có page tiếp theo không

### Response Structure

```json
{
  "items": [...],
  "next_cursor": "string | null",
  "has_next": boolean
}
```

## Comments API

### Get Comments

```
GET /learning/{lessonId}/comments?depth_target=0&limit=20
GET /learning/{lessonId}/comments?root_id={rootId}&depth_target=1&limit=20
```

### Create Comment

```
POST /learning/{lessonId}/comments
Body: { "content": "string", "parent_id": "uuid" }
```

### React to Comment

```
POST /learning/comments/{commentId}/reactions
```

### Get Reaction Users

```
GET /learning/comments/{commentId}/reacts
Response: [
  {
    "id": "uuid",
    "user_id": "uuid",
    "user_name": "string",
    "user_avatar": "url",
    "is_owner": boolean
  }
]
```
