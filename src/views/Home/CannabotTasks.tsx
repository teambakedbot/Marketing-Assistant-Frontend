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

function CannabotTasks({ isRun }: CannabotTasksProps) {
   const tasks: Task[] = [
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

   const [currentIndex, setCurrentIndex] = useState < number > (0);
   const [process, setProcess] = useState < Task[] > ([]);

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
      <div>
         <h2 className="font-bold leading-[1.22em] mb-3.5 text-center">Cannabot Tasks</h2>
         <SimpleBar style={{ maxHeight: 150 }}>
            <div className="flex flex-col gap-1.5">
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
