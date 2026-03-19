export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AdminUserResponseDto extends UserResponseDto {
  role: 'admin' | 'viewer';
  lastLogin: string;
}
