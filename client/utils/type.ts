export type User_Type = {
  id: string;
  isGuest: boolean;
  count?: number;
  createdAt: string;
  imageUrl: string;
  fullName: string;
};

export type Friend_Type = {
  _id: string;
  fullName: string;
  imageUrl: string;
  sessionId: string;
  requestsSend: string[];
  requestsRecieved: string[];
  friends: string[];
};
