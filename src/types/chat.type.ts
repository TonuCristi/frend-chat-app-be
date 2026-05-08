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
