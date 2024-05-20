import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

function CannabotWorkspace({streamOutput}:any) {
   return (
      <div>
         <h2 className="font-bold leading-[1.22em] mb-2 text-center">Cannabot Workspace</h2>
         <div className="border border-white py-4 [@media(min-width:600px)]:py-7 [@media(min-width:600px)]:px-6 px-3 rounded-lg">
            <div className="bg-white rounded-[20px]">
               <SimpleBar className="max-h-[160px] [@media(min-width:1281px)]:max-h-[350px]">
                  <div>
                     <div className="flex sm:flex-row flex-col items-center gap-4 px-4 py-8 [@media(min-width:1281px)]:py-28">
                        <img src="/images/image 7.png" alt="" />
                        <p className="font-bold text-[#110F0F] font-istok-web">
                           <pre id="streamOutput">{streamOutput}</pre>
                        </p>
                     </div>
                     <div className="h-[1200px]" />
                  </div>
               </SimpleBar>
            </div>
         </div>
      </div>
   );
}

export default CannabotWorkspace;
