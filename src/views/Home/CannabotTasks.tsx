import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface Task {
   img: string;
   text: string;
}

interface CannabotTasksProps {
   isRun: boolean;
}

const tasks = [
   {
      img: "/images/Sebo_logo (1).png",
      text: "Calling Cannabots to send a personalized SMS Messages"
   },
   {
      img: "/images/image 3.png",
      text: "Task Added: Collect purchase history, demographics, and psychographics data"
   },
   {
      img: "/images/image 3.png",
      text: "Task Added: Analyze the data to identify patterns and preferences"
   },
   {
      img: "/images/image 3.png",
      text: "Task Added: Compose personalized sms messages based on the analysis"
   },
   {
      img: "/images/image 3.png",
      text: "Task Added: Sending personalized sms messages"
   }
];
function CannabotTasks({ isRun }: CannabotTasksProps) {

   const [currentIndex, setCurrentIndex] = useState<number>(0);
   const [process, setProcess] = useState<Task[]>([]);

   useEffect(() => {
      if (isRun && currentIndex < tasks.length) {
         const interval = setInterval(() => {
            setProcess(prevProcess => [...prevProcess, tasks[currentIndex]]);
            setCurrentIndex(prevIndex => {
               const nextIndex = prevIndex + 1;
               if (nextIndex >= tasks.length) {
                  clearInterval(interval);
               }
               return nextIndex;
            });
         }, 5000);

         return () => clearInterval(interval);
      }
   }, [isRun, currentIndex, tasks]);

   useEffect(() => {
      if (!isRun) {
         setCurrentIndex(0);
         setProcess([]);
      }
   }, [isRun]);

   return (
      <div className="lg:mt-0 mt-5">
         <h2 className="font-bold leading-[1.22em] mb-3.5 text-center">Smokey Tasks</h2>
         <SimpleBar className="max-h-[150px] overflow-y-auto">
            <div className="flex flex-col gap-2 mr-2">
               {
                  tasks.map((item, index) => (
                     <div key={`${item.text}-${index}`} className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img className="w-4 lg:w-6" src={item.img} alt="" />
                        <p className="font-bold lg:text-base text-sm font-istok-web">{item.text}</p>
                     </div>
                  ))
               }
            </div>
         </SimpleBar>
      </div>
   );
}

export default CannabotTasks;
