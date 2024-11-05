/* eslint-disable prefer-const */

import { ReviewRateProps } from "../../models/ReviewRateModel";
function ReviewRate(props: ReviewRateProps) {
   const {icon, value, content, color = "success"} = props;

   const background = {
      success: "bg-green-emerald",
      primary: "bg-blue-blue",
      error: "bg-red-pink",
      dark: "bg-dark",
      info: "bg-blue-black",
   };

   return (
      <div role="button" className="bg-white py-2.5 px-0.5 w-full rounded-xl relative group">
         <div
            className={`absolute -top-3.5 left-4 max-w-11 aspect-square p-2 flex items-center justify-center rounded-xl ${background[color]}`}
         >
            <img src={icon} alt="" />
         </div>
         <h3 className="text-4xl md:text-7xl font-bold text-cyan-900 text-center xl:text-end mb-1 px-2">
            {value}
         </h3>
         <p className="text-sm font-medium text-center text-gray-950 group-last:text-3xl group-last:leading-[1.0em]">
            {content}
         </p>
      </div>
   );
}

export default ReviewRate;
