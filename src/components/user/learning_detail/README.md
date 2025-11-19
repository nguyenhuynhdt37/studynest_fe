# Learning Detail Component với SWR

## Tổng quan

Component `LearningDetail` đã được cập nhật để sử dụng SWR để truy vấn dữ liệu curriculum từ API thay vì sử dụng mock data.

## Các thay đổi chính

### 1. Types mới

- `src/types/user/curriculum.ts`: Định nghĩa types cho API response curriculum
- Bao gồm: `CurriculumResponse`, `Section`, `Lesson`, `LessonResource`

### 2. SWR Integration

- `src/lib/utils/fetcher/client/curriculum.ts`: Fetcher function cho curriculum API
- `src/hooks/useCurriculum.ts`: Custom hook sử dụng SWR

### 3. Component Updates

- `LearningDetail`: Sử dụng `useCurriculum` hook thay vì mock data
- `Sidebar`: Cập nhật để hiển thị data từ API với proper formatting

## Cách sử dụng

```tsx
import LearningDetail from "@/components/user/learning_detail";

// Component sẽ tự động fetch curriculum data dựa trên courseData.id
<LearningDetail courseData={courseData} error={error} />;
```

## API Endpoint

```
GET /api/v1/learning/{courseId}/curriculum
```

## Features

- ✅ Loading state với animation
- ✅ Error handling với retry button
- ✅ Real-time data từ API
- ✅ Proper type safety
- ✅ Auto-refresh và caching với SWR
- ✅ Responsive sidebar
- ✅ Video player integration

## Configuration

Có thể cấu hình API base URL trong environment variables:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Dependencies

- `swr`: ^2.3.6 (đã có sẵn)
- `react`: ^19.1.0
- `typescript`: ^5
