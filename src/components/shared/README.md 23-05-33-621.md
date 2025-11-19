# Shared Components

Thư mục này chứa các component có thể tái sử dụng trong toàn bộ ứng dụng.

## Components

### 1. Pagination (`/pagination/index.tsx`)

Component phân trang với các tính năng:

- Hiển thị số trang với navigation
- Chọn số lượng items per page
- Hiển thị thông tin tổng số items
- Responsive design

**Props:**

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}
```

**Sử dụng:**

```tsx
<Pagination
  currentPage={pagination.page}
  totalPages={pagination.total_pages}
  totalItems={pagination.total_items}
  pageSize={pagination.size}
  onPageChange={handlePageChange}
  onPageSizeChange={handleSizeChange}
  showPageSizeSelector={true}
  pageSizeOptions={[5, 10, 20, 50]}
/>
```

### 2. DataTable (`/data-table/index.tsx`)

Component bảng dữ liệu với các tính năng:

- Hiển thị dữ liệu dạng bảng
- Sắp xếp theo cột
- Loading state
- Empty state
- Custom render cho từng cột

**Props:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  onSort?: (column: string) => void;
  className?: string;
  rowClassName?: (record: T, index: number) => string;
}

interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => ReactNode;
  className?: string;
}
```

**Sử dụng:**

```tsx
const columns: Column<Role>[] = [
  {
    key: "role_name",
    title: "Vai trò",
    sortable: true,
    render: (value: string, record: Role) => (
      <div className="font-semibold">{value}</div>
    ),
  },
  {
    key: "total_users",
    title: "Người dùng",
    sortable: true,
  },
];

<DataTable
  data={roles}
  columns={columns}
  loading={loading}
  emptyMessage="Không có dữ liệu"
  sortBy={sortBy}
  order={order}
  onSort={handleSort}
/>;
```

### 3. ExportButton (`/export-button/index.tsx`)

Component nút xuất file với các tính năng:

- Loading state khi xuất
- Nhiều variant (primary, secondary, outline)
- Nhiều size (sm, md, lg)
- Custom children

**Props:**

```typescript
interface ExportButtonProps {
  onExport: () => Promise<void>;
  loading?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}
```

**Sử dụng:**

```tsx
<ExportButton onExport={handleExportExcel} variant="outline" size="md">
  Xuất Excel
</ExportButton>
```

## Services

### Roles API (`/services/roles.ts`)

Service để tương tác với API roles:

**Các method:**

- `getRoles(params)` - Lấy danh sách roles với phân trang, tìm kiếm, sắp xếp
- `getRole(id)` - Lấy chi tiết một role
- `createRole(roleData)` - Tạo role mới
- `updateRole(id, roleData)` - Cập nhật role
- `deleteRole(id)` - Xóa role
- `exportRoles(params)` - Xuất roles ra Excel
- `downloadExcel(blob, filename)` - Download file Excel

**Sử dụng:**

```tsx
import { rolesAPI } from "@/services/roles";

// Lấy danh sách roles
const response = await rolesAPI.getRoles({
  search: "admin",
  sort_by: "role_name",
  order: "desc",
  page: 1,
  size: 10,
});

// Xuất Excel
const blob = await rolesAPI.exportRoles({
  search: "admin",
  sort_by: "role_name",
  order: "desc",
});
rolesAPI.downloadExcel(blob, "roles.xlsx");
```

## Cách sử dụng trong component khác

1. Import các component cần thiết:

```tsx
import DataTable, { Column } from "@/components/shared/data-table";
import Pagination from "@/components/shared/pagination";
import ExportButton from "@/components/shared/export-button";
```

2. Định nghĩa columns cho DataTable:

```tsx
const columns: Column<YourDataType>[] = [
  {
    key: "field_name",
    title: "Tên cột",
    sortable: true,
    render: (value, record) => (
      <CustomComponent value={value} record={record} />
    ),
  },
];
```

3. Sử dụng trong JSX:

```tsx
<DataTable
  data={yourData}
  columns={columns}
  loading={loading}
  sortBy={sortBy}
  order={order}
  onSort={handleSort}
/>

<Pagination
  currentPage={page}
  totalPages={totalPages}
  totalItems={totalItems}
  pageSize={pageSize}
  onPageChange={handlePageChange}
  onPageSizeChange={handleSizeChange}
/>

<ExportButton onExport={handleExport} />
```

## Lưu ý

- Tất cả components đều hỗ trợ TypeScript
- Sử dụng Tailwind CSS cho styling
- Components được thiết kế responsive
- Có thể customize thông qua props className
- Loading states được xử lý tự động
