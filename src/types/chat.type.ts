export enum ChatType {
  Direct = "direct",
  Group = "group",
}

export type Chat = {
  _id: string;
  type: string | null;
  name: string;
  createdBy: string;
  createdAt: Date;
};

export type ChatMembership = {
  _id: string;
  memberId: string;
  chatId: string;
  role: string;
  createdAt: Date;
};
