# MCP Server Configuration - StudyNest

## MCP Servers được khuyến nghị

### 1. next-devtools-mcp

When working with Next.js, always call the init tool from next-devtools-mcp
at the start of the session to establish proper context and documentation requirements.

**Package**: `next-devtools-mcp@0.3.1`

**Mô tả**: MCP server cung cấp thông tin về Next.js project structure, routes, và components cho AI.

**Lợi ích**:

- AI hiểu rõ hơn về cấu trúc Next.js App Router
- Tự động phát hiện routes và layouts
- Hiểu component hierarchy
- Hỗ trợ tốt hơn cho Next.js 16 features

**Cài đặt**:

Không cần cài đặt global. Sử dụng `npx` để chạy tự động.

**Cấu hình trong Cursor**:

Có 2 cách cấu hình:

**Cách 1: Sử dụng file `.mcp.json` (Đã tạo sẵn)**

File `.mcp.json` đã được tạo trong thư mục gốc với cấu hình:

```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

Cursor sẽ tự động đọc file này.

**Cách 2: Cấu hình thủ công trong Cursor Settings**

1. Mở Cursor → `Settings` → `Features` → `MCP`
2. Click `Add MCP Server` hoặc `New MCP Server`
3. Nhập thông tin:
   - **Name**: `next-devtools`
   - **Command**: `npx`
   - **Arguments**: `-y, next-devtools-mcp@latest`
4. Save và restart Cursor

**Lưu ý**:

- Sử dụng `@latest` để luôn có phiên bản mới nhất
- `-y` flag cho phép npx tự động cài đặt package khi cần
- Không cần cài đặt global, npx sẽ tự xử lý

### 2. File System MCP (Built-in)

Cursor đã có sẵn file system MCP để đọc codebase.

## Cấu hình MCP cho StudyNest

### Project Context Files

Các file documentation trong `.cursor/` đã được tạo để cung cấp context:

1. **`.cursor/PROJECT.md`**: Tổng quan dự án, cấu trúc, tech stack
2. **`.cursor/ARCHITECTURE.md`**: Kiến trúc, patterns, data flow
3. **`.cursor/API.md`**: API documentation, endpoints, patterns
4. **`.cursor/rules/readme.mdc`**: Coding rules và conventions

### MCP Server Benefits

Khi cấu hình `next-devtools-mcp`, AI sẽ có thể:

1. **Hiểu Next.js Structure**:

   - App Router routes
   - Route groups `(main)`, `(admin)`, `(auth)`, etc.
   - Layout hierarchy
   - Server vs Client Components

2. **Component Analysis**:

   - Component dependencies
   - Props flow
   - State management patterns

3. **Route Understanding**:

   - Dynamic routes `[slug]`, `[id]`
   - Route parameters
   - Search params

4. **Next.js 16 Features**:
   - Async params, cookies, headers
   - Server Components patterns
   - Streaming và Suspense

## Cách sử dụng

Sau khi cấu hình MCP server:

1. AI sẽ tự động hiểu cấu trúc Next.js của dự án
2. Đề xuất code phù hợp với App Router
3. Hiểu routing patterns và conventions
4. Tối ưu cho Next.js 16 features

## Lưu ý

- `next-devtools-mcp` là optional, không bắt buộc
- Các file documentation trong `.cursor/` đã cung cấp đủ context
- MCP server giúp AI hiểu sâu hơn về Next.js structure
- Kết hợp với documentation files để có kết quả tốt nhất
