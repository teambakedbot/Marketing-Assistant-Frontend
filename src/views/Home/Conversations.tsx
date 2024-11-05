import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface ConversationsProps {
  chats: { chat_id: string; name: string }[];
  loadChatHistory: (chatId: string) => void;
  activeChatId: string | null;
}

function Conversations({
  chats,
  loadChatHistory,
  activeChatId,
}: ConversationsProps) {
  return (
    <div className="px-2 mb-10">
      <h3 className="font-semibold pl-1 text-lg leading-[1.22em] mb-4 text-white">
        Conversations
      </h3>
      <div className="pl-1.5 mb-5">
        <SimpleBar
          className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden border-0"
          autoHide={false}
        >
          <div className="flex flex-col gap-2 relative z-0">
            <span className="w-0.5 block absolute top-0 bottom-0 left-[9px] bg-gray-600 z-10" />
            {chats?.length > 0 ? (
              chats.map(({ chat_id, name }, index) => (
                <div
                  key={`${chat_id}-${index}`}
                  onClick={() => loadChatHistory(chat_id)}
                  className={`relative group py-2 pl-7 pr-2 cursor-pointer rounded-md transition-colors duration-200 ${
                    activeChatId === chat_id
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="absolute left-[5px] top-1/2 -translate-y-1/2 w-3 h-3 dark-green-background-1 rounded-full z-20" />
                  <button className="w-full text-left text-sm font-medium truncate">
                    {name}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No conversations yet.
              </p>
            )}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default Conversations;
