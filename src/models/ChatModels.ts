export type ChatEntry = {
  role: string;
  content: string;
};

export type Chats = {
  context: ChatEntry[];
  chat_id: string;
  name: string;
}[];
