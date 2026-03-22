/** Response shape for GET /api/status */
export interface HealthStatusDto {
  status: 'online';
  /** Human-readable message configured per API instance */
  message: string;
  version: string;
  timestamp: string;
}

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
