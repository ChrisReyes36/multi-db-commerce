import { Role } from '../enums/roles';

export type JwtUser = {
  sub: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  accessToken: string;
};
