export type ChatEntry = {
  message_id: string;
  role: string;
  content: string;
};

export type Chats = {
  context: ChatEntry[];
  chat_id: string;
  name: string;
}[];
