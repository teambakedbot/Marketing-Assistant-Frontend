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
  const promptsRow = prompts.split("\n").length;
  const fileRef = useRef<HTMLInputElement>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSelected, setCustomerSelected] = useState<Customer[]>([]);
  const [isRun, setIsRun] = useState<boolean>(false);
  const [streamOutput, setStreamOutput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([
    "Hi, Brandon. Welcome Back",
  ]);
  const [chatHistory, setChatHistory] = useState<string>(
    `Hey John, new strain Gelato Zkittlez at Green Rose, 20% off coupon. It's like Pink Runtz you loved - phenotype of Runtz crossed with Gelato & Zkittlez. Don't miss this deal! <br> `
  );

  // const handleClick = () => {
  //   fileRef.current?.click();
  //   fileRef.current?.addEventListener("change", showCustomers, { once: true });
  // };

  const setAllCustomerSelected = () => {
    setCustomerSelected(customers);
  };

  function playHandler() {
    if (!prompts) return;
    setLoading(true);
    axios
      .post(
        "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/chat",
        { message: prompts }
      )
      .then((res) => {
        setChatHistory(
          (prevHistory) => prevHistory + "<br>" + res?.data?.response
        );
        // setMessages([...messages, prompts]);
        setPrompts("");
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
        setStreamOutput(
          (prev) => prev + decoder.decode(value, { stream: true })
        );
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
      <div className="bg-[#1E1E1E] min-h-screen w-full overflow-hidden">
        <div className="xl:h-[75%] lg:grid [@media(min-width:1020px)]:grid-cols-2 flex-grow gap-3 py-9 [@media(min-width:600px)]:pr-10 pr-4 pl-3">
          <div className="h-[100%] mt-0 md:mt-7">
            <div className="min-h-[400px] h-full [@media(min-width:1281px)]:min-h-[590px] bg-[#1C1919] border border-white rounded-lg px-5 py-10">
              <p className="mb-10 flex flex-wrap gap-2">
                <button className="bg-[#636363] px-3 py-2 text-white font-istok-web font-medium text-sm  rounded-3xl text-[14px]">
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
              {messages.map((d: string) => (
                <p className="text-[16px] font-rhodium-libre mb-1" key={d}>
                  {d}
                </p>
              ))}
              {loading ? <p>Loading...</p> : ""}
            </div>
          </div>
          <div className="h-[100%] mt-5 md:m-0 ">
            <CannabotWorkspace
              chatHistory={chatHistory}
              streamOutput={streamOutput}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center my-5">
          <div className="flex mb-5 [@media(min-width:600px)]:flex-row flex-col items-center justify-center gap-4">
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
          </div>
          <div className="flex w-[100%] lg:w-[80%] [@media(min-width:600px)]:flex-row flex-col items-center [@media(min-width:600px)]:gap-5 gap-3 px-4 [@media(min-width:1440px)]:px-11 mb-7">
            <textarea
              className="text-xl md:pt-[20px] lg:pt-[20px] py-1 lg:py-0 resize-none italic font-istok-web placeholder:text-white bg-neutral-800 rounded-lg flex-grow placeholder:text-center focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 overflow-hidden"
              placeholder="Chat with Smokey or Enter your goal and Click Start"
              onChange={(e) => setPrompts(e.target.value)}
              value={prompts}
            ></textarea>
            <button className="text-[20px] font-istok-web italic bg-[#2305fb] text-white py-3 px-11 rounded-lg [@media(min-width:600px)]:w-auto w-full">
              Toolkit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
