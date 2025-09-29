export interface User {
  id: number;
  fullname: string;
  email: string;
  avatar?: string;
  bio?: string;
  facebook_url?: string;
  is_active: boolean;
  is_verified_email: boolean;
  email_verified_at?: string;
  roles: string[];
}
