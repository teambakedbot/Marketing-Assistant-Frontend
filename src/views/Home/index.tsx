import { Link } from "react-router-dom";
import { IoStopOutline } from "react-icons/io5";
import { LuPlay } from "react-icons/lu";
import { PiPause } from "react-icons/pi";
import ReviewRate from "./ReviewRate";
import CannabotWorkspace from "./CannabotWorkspace";
import CannabotTasks from "./CannabotTasks";
import { useRef, useState } from "react";
import Papa from 'papaparse';
import '../../styles/main.css'


const buttons = [
   {
      name: "Load Customer(s)",
      path: "/",
      isUpload: true
   },
   {
      name: "Choose Goal or Segment",
      path: "/",
      ComingSoon: "Coming Soon!",
   },
];

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
   [key: string]: any;
}

function Home() {
   const [prompts, setPrompts] = useState < string > ("");
   const promptsRow = prompts.split("\n").length;
   const fileRef = useRef < HTMLInputElement > (null);
   const [customers, setCustomers] = useState < Customer[] > ([]);
   const [customerSelected, setCustomerSelected] = useState < Customer[] | Customer | null > (null);
   const [isRun, setIsRun] = useState < boolean > (false);
   const [streamOutput, setStreamOutput] = useState < string > ("");

   const handleClick = () => {
      fileRef.current?.click()
   }

   const setAllCustomerSelected = () => {
      setCustomerSelected(customers)
   }

   const showCustomers = () => {
      if (fileRef?.current?.files) {
         const file = fileRef?.current?.files[0];
         if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
               if (event) {
                  const text = event.target?.result;
                  if (typeof text === 'string') {
                     const parsedData = Papa.parse < Customer > (text, { header: true });
                     setCustomers(parsedData.data);
                  }
               }
            };
            reader.readAsText(file);
         }
      }
   }

   const typeBtnClick = (type: string) => {
      start(type);
   }

   const start = (type: string) => {
      if (Array.isArray(customerSelected)) {
         generateCSVAndCallAPI(customerSelected, type);
      } else if (customerSelected) {
         generateCSVAndCallAPI([customerSelected], type);
      }
   }

   const generateCSV = (data: Customer[]) => {
      const csv = Papa.unparse(data);
      return csv;
   };

   const generateCSVAndCallAPI = async (customerData: Customer[], contentType: string) => {
      const csv = generateCSV(customerData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('content_type', contentType);
      const response = await fetch('http://localhost:8000/upload/', {
         method: 'POST',
         body: formData,
         headers: {
            'Accept': 'text/event-stream',
         },
      });
      setIsRun(true);
      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
         while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            setStreamOutput(prev => prev + decoder.decode(value, { stream: true }));
         }
      }
      setIsRun(false);
   };


   return (
      <div className="flex gap-3 bg-[#1E1E1E] min-h-screen overflow-hidden">
         <div className="grid [@media(min-width:1020px)]:grid-cols-2 flex-grow gap-3 py-9 [@media(min-width:600px)]:pr-10 pr-4 pl-3">
            <div className="">
               <div className="pl-4 flex flex-col [@media(min-width:600px)]:flex-row gap-6  mb-9">
                  {buttons.map(({ name, ComingSoon, isUpload }, index) => (
                     <div key={index} className="relative z-0">
                        {ComingSoon && (
                           <img
                              className="absolute -right-1 [@media(min-width:600px)]:-right-7 -bottom-4"
                              src="/images/Coming Soon!.svg"
                              alt=""
                           />
                        )}
                        {isUpload ? (
                           <>
                              <input type="file" ref={fileRef} style={{ display: "none" }} onChange={showCustomers} />
                              <div
                                 role="button"
                                 className={`py-2.5 px-9 font-bold font-istok-web bg-gray-600 rounded-[20px]`}
                                 onClick={handleClick}
                              >
                                 {name}
                              </div>
                           </>
                        ) : (
                           <div
                              role="button"
                              className={`py-2.5 px-9 font-bold font-istok-web bg-gray-600 rounded-[20px]`}
                           >
                              {name}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
               <div className="min-h-[400px] [@media(min-width:1281px)]:min-h-[590px] bg-[#1C1919] border border-white rounded-lg px-5 py-10 mb-7">
                  <p className="text-5xl font-rhodium-libre mb-1">
                     Hi, Brandon. Time to spark connections with your{" "}
                     <Link to="/" className="text-9xl font-reenie-beanie text-red-700 underline">
                        Winbacks.
                     </Link>
                  </p>
                  <div className="grid grid-cols-2 [@media(min-width:1440px)]:grid-cols-4 gap-3 [@media(min-width:1440px)]:gap-6">
                     {marketingSite.map(({ icon, title, content, popup, type }, index) => (
                        <div
                           role="button"
                           key={index}
                           className={`bg-white bg- rounded-xl px-6 py-1 relative flex flex-col items-center`}
                           onClick={() => typeBtnClick(type)}
                        >
                           <h3 className="text-cyan-900 font-bold ml-5 self-start">{title}</h3>
                           <p
                              className={`font-light text-black -mt-1.5 text-center ${popup ? "text-base" : ""
                                 }`}
                           >
                              {content}
                           </p>
                           <div className="absolute -top-1.5 left-1.5 py-1 px-1.5 bg-grey-grey rounded-full">
                              <img src={icon} alt="" />
                           </div>
                           {popup && (
                              <img className="-my-1" src="/images/Coming Soon! (1).svg" alt="" />
                           )}
                        </div>
                     ))}
                  </div>
                  <ul style={{ height: "400px", overflowY: "scroll", marginTop: "20px", marginLeft: "20px" }}>
                     {isRun ?
                        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                           <h1 style={
                              {
                                 color: "white",
                                 fontSize: "30px",
                                 fontWeight: "bold"
                              }
                           }>
                              Now running...
                           </h1>
                        </div>
                        :
                        <>
                           <li key="-1" className="li-customer-name">
                              <input type="radio" onChange={() => setAllCustomerSelected()} name="customer_name" id={`radio_-1`} />
                              <label htmlFor={`radio_-1`} style={{ cursor: "pointer" }}>All Customers</label>
                           </li>
                           {customers.map((customer, index) => {
                              return customer["Customer Name"] && (
                                 <li key={index} className="li-customer-name">
                                    <input type="radio" onChange={() => setCustomerSelected(customer)} name="customer_name" id={`radio_${index}`} />
                                    <label htmlFor={`radio_${index}`} style={{ cursor: "pointer" }}>{customer["Customer Name"]}</label>
                                 </li>
                              )
                           })}
                        </>
                     }
                  </ul>
               </div>
               <div className="flex [@media(min-width:600px)]:flex-row flex-col items-center [@media(min-width:600px)]:gap-5 gap-3 px-4 [@media(min-width:1440px)]:px-11 mb-7">
                  <textarea
                     rows={promptsRow}
                     className="text-7xl italic font-istok-web placeholder:text-neutral-400 bg-neutral-800 p-1 rounded-3xl flex-grow placeholder:text-center focus:outline-0 [@media(min-width:600px)]:w-auto w-full px-4 overflow-hidden"
                     placeholder="Run a CannaBot or Let’s Chat"
                     onChange={(e) => setPrompts(e.target.value)}
                     value={prompts}
                  ></textarea>

                  <button className="text-5xl font-istok-web italic bg-emerald-500 text-dark-0 pt-2 pb-1 px-11 rounded-3xl [@media(min-width:600px)]:w-auto w-full">
                     Start
                  </button>
               </div>
               <div className="flex [@media(min-width:600px)]:flex-row flex-col items-center justify-center gap-4">
                  <div className="flex gap-4">
                     <button className="bg-emerald-500 py-1.5 px-9 rounded-md border border-[#999999]">
                        <LuPlay className="text-3xl text-black" />
                     </button>
                     <button className="bg-yellow-600 py-1.5 px-9 rounded-md border border-[#999999]">
                        <PiPause className="text-3xl text-white" />
                     </button>
                     <button className="bg-red-400 py-1.5 px-9 rounded-md border border-[#999999]">
                        <IoStopOutline className="text-3xl text-[#999999]" />
                     </button>
                  </div>
                  <div
                     className="py-1 pt-2 min-h-10 flex items-center justify-center px-9 font-bold font-istok-web bg-blue-400 rounded-xl [@media(min-width:600px)]:w-auto w-full"
                     role="button"
                  >
                     <span>Toolkit</span>
                  </div>
               </div>
            </div>
            <div className="pt-9">
               <div className="mb-10">
                  <div className="mb-3.5">
                     <CannabotTasks isRun={isRun} />
                  </div>
                  <div>
                     <CannabotWorkspace streamOutput={streamOutput} />
                  </div>
               </div>
               <div className="grid gap-x-2 gap-y-6 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                  <ReviewRate
                     icon="/images/Group 2.svg"
                     value="5%"
                     content="Conversion Rate"
                     color="success"
                  />
                  <ReviewRate
                     icon="/images/Group 3.svg"
                     value="$35"
                     content="Customer Acquisition Cost"
                     color="primary"
                  />
                  <ReviewRate
                     icon="/images/Group 4.svg"
                     value="$600"
                     content="Customer Lifetime Value"
                     color="error"
                  />
                  <ReviewRate
                     icon="/images/Group 5.svg"
                     value="20%"
                     content="Engagement Rate"
                     color="dark"
                  />
                  <ReviewRate
                     icon="/images/Group 5.svg"
                     value="+"
                     content="Add More"
                     color="info"
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default Home;
