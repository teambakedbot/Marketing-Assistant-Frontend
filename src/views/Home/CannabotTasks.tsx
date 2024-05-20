import { useEffect, useState } from "react";
import {Fragment} from "react/jsx-runtime";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

function CannabotTasks({isRun}) {
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
         img: "/images/image 5.png",
         text: "Starting Task: Collect purchase history, demographics, and psychographics data"
      },
      {
         img: "/images/image 6.png",
         text: "Executing Workspace Response"
      }
   ];
   const [currentIndex, setCurrentIndex] = useState(0);
   const [process, setProcess] = useState([]);

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

   // Reset currentIndex and process when isRun becomes false
   useEffect(() => {
      if (!isRun) {
         setCurrentIndex(0);
         setProcess([]);
      }
   }, [isRun]);
   return (
      <div>
         <h2 className="font-bold leading-[1.22em] mb-3.5 text-center">Cannabot Tasks</h2>
         <SimpleBar style={{maxHeight: 150}}>
            <div className="flex flex-col gap-1.5">
               {/* {process.map(el=>el)}
               {[...Array(10)].map((_, index) => (
                  <Fragment key={index}>
                     <div className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img src="/images/Sebo_logo (1).png" alt="" />
                        <p className="font-bold font-istok-web">
                           Calling Cannabots to send a personalized SMS Messages
                        </p>
                     </div>
                     <div className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img src="/images/image 3.png" alt="" />
                        <p className="font-bold font-istok-web">
                           Task Added: Collect purchase history, demographics, and psychographics
                           data
                        </p>
                     </div>
                     <div className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img src="/images/image 5.png" alt="" />
                        <p className="font-bold font-istok-web">
                           Starting Task: Collect purchase history, demographics, and psychographics
                           dat
                        </p>
                     </div>
                     <div className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img src="/images/image 6.png" alt="" />
                        <p className="font-bold font-istok-web">Executing Workspace Response</p>
                     </div>
                  </Fragment>
               ))} */}
               {process.map((task, index) => (
                  <Fragment key={index}>
                     <div className="flex items-center gap-1 bg-gray-600 rounded-[20px] py-[1px] pl-2.5 pr-1 mr-2.5">
                        <img src={task.img} alt="" />
                        <p className="font-bold font-istok-web">{task.text}</p>
                     </div>
                  </Fragment>
               ))}
            </div>
         </SimpleBar>
      </div>
   );
}

export default CannabotTasks;
