export interface IUser {
  userId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;  // optional because it's nullable in C#
}
