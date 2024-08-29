export type ChatEntry = {
  role: string;
  content: string;
};

export type Chats = {
  context: ChatEntry[];
}[];
