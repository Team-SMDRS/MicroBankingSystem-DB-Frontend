import React from 'react';

export interface Role {
  role_id: string;
  role_name: string;
}

export interface User {
  user_id: string;
  nic: string | null;
  first_name: string;
  last_name: string;
  address: string | null;
  phone_number: string | null;
  dob: string | null;
  email: string | null;
  username: string;
  created_at: string;
  roles: Role[];
}

export interface UserStatus {
  user_id: string;
  status: 'active' | 'inactive';
  is_active: boolean;
}

export interface UserManagementProps {
  onSelectUserToUpdate?: (user: User) => void;
}