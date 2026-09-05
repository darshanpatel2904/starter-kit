export interface ProfileFormValues {
  name: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  revokeOthers?: boolean;
}

export interface SessionRecord {
  token: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt?: string | Date;
  expiresAt?: string | Date;
}

export interface UserProfileData {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt?: string | Date;
}
