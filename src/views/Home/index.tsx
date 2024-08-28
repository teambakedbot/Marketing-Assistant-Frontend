import { IoStopOutline } from "react-icons/io5";
import { LuPlay } from "react-icons/lu";
import CannabotWorkspace from "./CannabotWorkspace";
import { useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import "../../styles/main.css";
import Profile from "./Profile";
import axios from "axios";
import Swal from "sweetalert2";

const marketingSite = [
  {
    icon: "/images/image-logo.png",
    title: "Start",
    type: "sms",
    content: (
      <>
        SMS <br /> Marketing
      </>
    ),
  },
  {
    icon: "/images/image-logo.png",
    title: "Start",
    type: "email",
    content: (
      <>
        Email <br /> Marketing
      </>
    ),
  },
  {
    icon: "/images/image-logo.png",
    title: "Create",
    type: "blog",
    content: (
      <>
        Marketing <br /> Content
      </>
    ),
  },
  {
    icon: "/images/image-logo.png",
    title: "Launch",
    type: "",
    content: (
      <>
        Integrated <br /> Campaign
      </>
    ),
    popup: "Coming Soon!",
  },
];

interface Customer {
  "Customer Name": string;
  [key: string]: unknown;
}

function Home() {
  const [prompts, setPrompts] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceType, setVoiceType] = useState<string>("pops");
  const promptsRow = prompts.split("\n").length;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSelected, setCustomerSelected] = useState<Customer[]>([]);
  const [isRun, setIsRun] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([
    "Hi, Brandon. Welcome Back",
  ]);
  const [chatHistory, setChatHistory] = useState<string[]>([
    "Whassup, whassup! It's Pops, baby! How can I help you today?",
  ]);

  const setAllCustomerSelected = () => {
    setCustomerSelected(customers);
  };

  function playHandler() {
    if (!prompts) return;
    setLoading(true);
    setPrompts("");
    axios
      .post(
        "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/chat",
        { message: prompts, voice_type: voiceType }
      )
      .then((res) => {
        setChatHistory((prev) => [...prev, prompts, res?.data?.response]);
      })
      .catch((err) => {
        Swal.fire({
          title: "Fetching Chat Answer",
          text: err.message,
        });
      })
      .finally(() => {
        // setMessages([...messages, prompts]);
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
          decoder.decode(value, { stream: true }),
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
      <div className="bg-[#383434] px-4 pt-14 pb-5 min-h-screen overflow-y-auto w-full lg:w-[20%] hidden sm:block">
        <Profile onFileUpload={showCustomers} />
      </div>
      <div className="bg-[#1E1E1E] min-h-screen w-full overflow-hidden">
        <div className="xl:h-[75%] lg:grid grid-cols-1 lg:grid-cols-2 flex-grow gap-3 py-9 px-3">
          {/* left Panel */}
          <div className="h-full mt-0 md:mt-7 flex flex-col hidden sm:flex">
            <div className="flex-grow bg-[#1C1919] border border-white rounded-lg px-5 py-5 overflow-auto">
              <p className="mb-10 flex flex-wrap gap-2">
                <button
                  onClick={() => {}}
                  className="bg-[#636363] px-3 py-2 text-white font-istok-web font-medium text-sm  rounded-3xl text-[14px]"
                >
                  Search Customer(s)
                </button>
                <button
                  onClick={() => typeBtnClick("sms")}
                  className="bg-[#07e81a] px-3 py-2 text-white font-istok-web font-medium text-sm rounded-3xl text-[14px]"
                >
                  Run SMS
                </button>
                <button
                  onClick={() => typeBtnClick("email")}
                  className="bg-[#659422] px-3 py-2 text-white font-istok-web font-medium text-sm rounded-3xl text-[14px]"
                >
                  Run Email
                </button>
                <button
                  onClick={() => typeBtnClick("blog")}
                  className="bg-[#304e05] px-3 py-2 text-white font-istok-web font-medium text-sm rounded-3xl text-[14px]"
                >
                  Create Content
                </button>
              </p>
              {messages.map((d: string, index: number) => (
                <p
                  className="text-[16px] font-rhodium-libre mb-1"
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
                  <p className="text-[16px] font-rhodium-libre mb-1">
                    {customer["Customer Name"]}
                  </p>
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </div>
          </div>
          {/* right panel */}
          <div id="right_panel" className="max-h-[70vh] mt-5 md:m-0 box-border">
            <CannabotWorkspace
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
          {/* <div className="flex mb-5 [@media(min-width:600px)]:flex-row flex-col items-center justify-center gap-4">
            <div className="md:flex gap-4">
              <button
                onClick={playHandler}
                className="bg-emerald-500 lg:my-0 my-3 flex flex-col items-center justify-center border-none py-1.5 w-[100px] md:px-10 rounded-md border border-[#999999]"
              >
                <LuPlay className="text-3xl text-black" />
                <span className="text-black">Start</span>
              </button>
              <button className="bg-red-400 lg:my-0 my-3 flex flex-col items-center justify-center border-none py-1.5 w-[100px] md:px-10 rounded-md border border-[#999999]">
                <IoStopOutline className="text-3xl text-[#999999]" />
                <span className="text-black">Stop</span>
              </button>
            </div>
          </div> */}
          <div className="flex w-[100%] mt-20 lg:w-[80%] [@media(min-width:600px)]:flex-row flex-col items-center [@media(min-width:600px)]:gap-5 gap-3 px-4 [@media(min-width:1440px)]:px-11 mb-7 flex-grow">
            <textarea
              disabled={loading}
              placeholder={
                loading
                  ? "Loading..."
                  : `Chat with ${
                      voiceType === "normal"
                        ? "BakedBot"
                        : capitalizeFirstLetter(voiceType)
                    } or Enter your goal`
              }
              className="text-xl md:py-[20px] lg:py-[20px] py-1 lg:py-0 italic font-istok-web placeholder:text-white bg-neutral-800 rounded-lg flex-grow focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 placeholder:text-left resize-none"
              onChange={(e) => {
                setPrompts(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
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
              onChange={(e) => setVoiceType(e.target.value)}
              className="text-xl md:py-[20px] lg:py-[20px] py-1 lg:py-0 italic font-istok-web bg-neutral-800 text-white rounded-lg focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 appearance-none"
            >
              <option value="pops">Pops</option>
              <option value="smokey">Smokey</option>
              <option value="normal">Normal</option>
            </select>
            <button
              onClick={playHandler}
              className="text-[20px] font-istok-web italic bg-[#2305fb] text-white py-3 px-11 rounded-lg [@media(min-width:600px)]:w-auto w-full"
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
