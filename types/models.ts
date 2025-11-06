export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
  status?: 'online' | 'offline';
}
