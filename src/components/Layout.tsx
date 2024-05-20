import {Outlet} from "react-router-dom";
import Navigation from "./Navigation";
function Layout() {
   return (
      <div>
         <Navigation />
         <div className="ml-[66px] min-h-screen">
            <Outlet />
         </div>
      </div>
   );
}

export default Layout;
