// User role enum type definition
export type UserRole = 'buyer' | 'seller' | 'bank_agent' | 'admin';

export interface SignUpRequest {
  email: string;
  password: string;
  display_name: string;
  phone?: string;
  role?: UserRole;
}

export interface UserMetadata {
  display_name: string;
  phone?: string;
  role: UserRole;
}

