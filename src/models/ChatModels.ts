export type ChatEntry = {
  id: string;
  role: string;
  content: string;
};

export type Chats = {
  context: ChatEntry[];
  chat_id: string;
  name: string;
}[];
