export type SocialProvider = 'google' | 'github';

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword?: string;
}
