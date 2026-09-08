export interface ProfileFormValues {
  name: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  revokeOthers?: boolean;
}
