export interface chatInterface {
  id: string;
  title: string;
  description: string;
  creatorId: number;
}

export interface userTypes {
  id: number;
  username: string;
  email: string;
  image?: string;
}

export interface messageInterface {
  id: string;
  message: string;
  chatId: string;
  userId: number;
  user: userTypes;
}
