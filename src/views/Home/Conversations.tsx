import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface ConversationsProps {
  chats: any;
  setChatId: (chatId: string) => void;
}

function Conversations({ chats, setChatId }: ConversationsProps) {
  return (
    <div className="px-2 mb-10">
      {/* <div className="flex items-center gap-5 mb-10">
        <img
          className="rounded-full w-8 h-8"
          src="/images/person-image.png"
          alt=""
        />
        <h3 className="font-medium text-lg">Brandon Lile (Head of UX)</h3>
      </div> */}
      <h3 className="font-semibold pl-1 text-lg leading-[1.22em] mb-4">
        Conversations
      </h3>
      <div className="pl-1.5 mb-5">
        <SimpleBar
          className="max-h-[220px] overflow-y-auto overflow-x-hidden border-0"
          autoHide={true}
        >
          <div className="flex flex-col gap-4 relative z-0">
            <span className="w-0.5 block absolute top-4 bottom-4 left-2 -translate-x-1/2 bg-white z-10" />
            {chats?.map(({ chat_id, name }, index) => (
              <div
                key={`${chat_id}-${index}`}
                className="relative group py-1 ml-4"
              >
                <img
                  className="absolute -left-4 top-1 w-4 h-4"
                  src="/images/Rechteck_731.svg"
                  alt=""
                />
                <div className="px-2 text-base">
                  <button
                    className="line-clamp-1"
                    onClick={() => setChatId(chat_id)}
                  >
                    {name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default Conversations;
