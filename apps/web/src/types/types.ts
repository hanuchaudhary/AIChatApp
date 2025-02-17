export interface chatInterface {
  id: string;
  title: string;
  description: string;
  creatorId: number;
  createdAt: string;
}

export interface userTypes {
  id: string;
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
