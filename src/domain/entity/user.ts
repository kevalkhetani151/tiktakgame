export default interface User {
  id: number ;
  password: string;
  salt: string;
  email: string;
  username: string;
  win:      number;
  loose: number;
  draw: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}