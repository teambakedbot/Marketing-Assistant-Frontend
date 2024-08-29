import { useRef, useState, useEffect, useCallback } from "react";
import { IoStopOutline } from "react-icons/io5";
import { LuPlay } from "react-icons/lu";
import CannabotWorkspace from "./CannabotWorkspace";
import Profile from "./Profile";
import Swal from "sweetalert2";
import Papa from "papaparse";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Customer } from "../../models/CustomerModel";
import { ChatEntry, Chats } from "../../models/ChatModels";
import "../../styles/main.css";
import { renameChat } from "../../api/renameChat";
import "../../styles/theme.css";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Conversations from "./Conversations";

function Home() {
  const [prompts, setPrompts] = useState<string>("");
  const { displayName, photoURL, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceType, setVoiceType] = useState<string>("pops");
  const promptsRow = prompts.split("\n").length;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSelected, setCustomerSelected] = useState<Customer[]>([]);
  const [isRun, setIsRun] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([
    "Hi, Brandon. Welcome Back",
  ]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatName, setChatName] = useState<string>("");
  const [chats, setChats] = useState<Chats[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([
    {
      role: "assistant",
      content:
        voiceType === "normal"
          ? "Hey, how can I help?"
          : `Whassup, whassup! It's ${capitalizeFirstLetter(
              voiceType
            )}, baby! How can I help you today?`,
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const setAllCustomerSelected = () => {
    setCustomerSelected(customers);
  };

  const loadChatHistory = useCallback(
    async (id: string) => {
      if (!id) return;
      setChatHistory([
        { role: "assistant", content: "Loading chat history..." },
      ]);
      try {
        setLoading(true);
        const token = await user?.getIdToken();
        if (!token) {
          console.error("Token is not available.");
          return;
        }
        console.log("Token:", token);
        const response = await axios.get(
          `http://0.0.0.0:8080/chat/messages?chat_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedMessages = response.data.messages.sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateA.getTime() - dateB.getTime();
        });
        setChatHistory(sortedMessages);
        setChatId(id);
        setActiveChatId(id);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  const fetchUserChats = useCallback(async () => {
    try {
      const token = await user?.getIdToken();
      console.log("Token:", token);
      const response = await axios.get("http://0.0.0.0:8080/user/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.chats) {
        const chats = response.data.chats;
        if (chats.length > 0) {
          setChats(chats);
        }
      }
      console.log("User chats:", response.data.chats);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [user]);

  async function playHandler() {
    if (!prompts || loading) return;
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: prompts },
      { role: "assistant", content: "loading" },
    ]);
    setPrompts("");
    setLoading(true);
    const token = await user?.getIdToken();
    axios
      .post(
        // "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/chat",
        "http://0.0.0.0:8080/chat",
        { message: prompts, voice_type: voiceType, chat_id: chatId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      .then((res) => {
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].content =
            res?.data?.response;
          return updatedHistory;
        });
        if (res?.data?.chat_id) {
          if (!chatId) {
            setChatId(res?.data?.chat_id);
            fetchUserChats();
          } else if (chatId !== res?.data?.chat_id) {
            setChatId(res?.data?.chat_id);
          }
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Fetching Chat Answer",
          text: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const showCustomers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event) {
            const text = event.target?.result;
            if (typeof text === "string") {
              const parsedData = Papa.parse<Customer>(text, { header: true });
              setCustomers(parsedData.data);
            }
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const typeBtnClick = (type: string) => {
    start(type);
  };

  const start = (type: string) => {
    setLoading(true);
    if (Array.isArray(customerSelected)) {
      generateCSVAndCallAPI(customerSelected, type);
    } else if (customerSelected) {
      generateCSVAndCallAPI([customerSelected], type);
    }
  };

  const generateCSV = (data: Customer[]) => {
    const csv = Papa.unparse(data);
    return csv;
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const generateCSVAndCallAPI = async (
    customerData: Customer[],
    contentType: string
  ) => {
    const csv = generateCSV(customerData);
    const blob = new Blob([csv], { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("content_type", contentType);
    formData.append("voice_type", voiceType);
    const response = await fetch(`${apiUrl}/upload/`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "text/event-stream",
      },
    });
    setIsRun(true);
    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    if (reader) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setChatHistory((prev) => [
          ...prev,
          { role: "AI", content: decoder.decode(value, { stream: true }) },
        ]);
      }
    }
    setIsRun(false);
  };

  const handleCustomerSelect = (customer: Customer) => {
    setCustomerSelected((prevSelected) => {
      if (prevSelected.includes(customer)) {
        return prevSelected.filter((c) => c !== customer);
      } else {
        return [...prevSelected, customer];
      }
    });
  };

  return (
    <div className="lg:flex">
      <div className="dark-green-background-2 px-4 pt-14 pb-5 min-h-screen overflow-y-auto w-full lg:w-[20%] hidden sm:block">
        <Profile
          onFileUpload={showCustomers}
          chats={chats}
          loadChatHistory={loadChatHistory}
          activeChatId={activeChatId}
        />
      </div>
      <div className="dark-green-background-3 min-h-screen w-full overflow-hidden">
        <div className="xl:h-[75%] lg:grid grid-cols-1 lg:grid-cols-2 flex-grow gap-3 py-9 px-3">
          {/* left Panel */}
          <div className="h-full mt-0 md:mt-7 flex flex-col hidden sm:flex">
            <div className="flex-grow dark-green-background-4 border rounded-lg px-5 py-5 overflow-auto">
              <p className="mb-10 flex flex-wrap gap-2">
                <button
                  onClick={() => {}}
                  className="medium-gray px-3 py-2 font-istok-web font-medium  lg:text-lg text-sm rounded-lg "
                >
                  Search Customer(s)
                </button>
                <button
                  onClick={() => typeBtnClick("sms")}
                  className="vibrant-green-background px-3 py-2 font-istok-web font-medium lg:text-lg text-sm rounded-lg "
                >
                  Run SMS
                </button>
                <button
                  onClick={() => typeBtnClick("email")}
                  className="bright-orange px-3 py-2 font-istok-web font-medium  lg:text-lg text-sm rounded-lg "
                >
                  Run Email
                </button>
                <button
                  onClick={() => typeBtnClick("blog")}
                  className="dark-gray px-3 py-2 font-istok-web font-medium  lg:text-lg text-sm rounded-lg "
                >
                  Create Content
                </button>
              </p>
              {messages.map((d: string, index: number) => (
                <p
                  className="text-[16px] font-playfair-display mb-1"
                  key={`${d}-${index}`}
                >
                  {d}
                </p>
              ))}
              {customers.map((customer: Customer, index: number) => (
                <div
                  className="flex items-center gap-2"
                  key={`${customer["Customer Name"]}-${index}`}
                >
                  <input
                    type="checkbox"
                    checked={customerSelected.includes(customer)}
                    onChange={() => handleCustomerSelect(customer)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-[16px] font-istok-web mb-1">
                    {customer["Customer Name"]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* right panel */}
          <div id="right_panel" className="max-h-[70vh] mt-5 md:m-0 box-border">
            <CannabotWorkspace
              loading={loading}
              chatHistory={chatHistory}
              voiceType={voiceType}
            />
          </div>
        </div>
        {/* bottom panel */}
        <div
          id="bottom_panel"
          className="flex flex-col items-center justify-center my-5 "
        >
          <div className="flex w-[100%] mt-20 lg:w-[80%] [@media(min-width:600px)]:flex-row flex-col items-center [@media(min-width:600px)]:gap-5 gap-3 px-4 [@media(min-width:1440px)]:px-11 mb-7 flex-grow">
            <textarea
              placeholder={`Chat with ${
                voiceType === "normal"
                  ? "BakedBot"
                  : capitalizeFirstLetter(voiceType)
              } or Enter your goal`}
              className="text-xl md:py-[20px] lg:py-[20px] py-1 lg:py-0 italic font-istok-web placeholder-white dark-green-background-4 rounded-lg flex-grow focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 placeholder:text-left resize-none"
              onChange={(e) => {
                setPrompts(e.target.value);
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  playHandler();
                }
              }}
              value={prompts}
              rows={1}
            />
            <select
              value={voiceType}
              onChange={(e) => {
                setVoiceType(e.target.value);
                setChatHistory([
                  {
                    role: "assistant",
                    content:
                      e.target.value === "normal"
                        ? "Hey, how can I help?"
                        : `Whassup, whassup! It's ${capitalizeFirstLetter(
                            e.target.value
                          )}, baby! How can I help you today?`,
                  },
                ]);
              }}
              className="text-xl md:py-[20px] lg:py-[20px] py-1 lg:py-0 italic font-istok-web dark-green-background-4 white rounded-lg focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 appearance-none"
            >
              <option value="pops">Pops</option>
              <option value="smokey">Smokey</option>
              <option value="normal">Normal</option>
            </select>
            <button
              onClick={playHandler}
              className="text-[20px] font-istok-web italic dark-green-background-1 white py-3 px-11 rounded-lg [@media(min-width:600px)]:w-auto w-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
