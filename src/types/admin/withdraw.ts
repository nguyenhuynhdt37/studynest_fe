export interface AdminWithdrawItem {
  id: string;
  lecturer_id: string;
  fullname: string;
  email: string;
  avatar: string | null;
  amount: number;
  currency: string;
  status: string;
  requested_at: string;
  rejected_at: string | null;
}

export interface AdminWithdrawResponse {
  page: number;
  limit: number;
  total: number;
  items: AdminWithdrawItem[];
}

export interface AdminLecturerOption {
  id: string;
  fullname: string;
  email: string;
  avatar: string | null;
}

