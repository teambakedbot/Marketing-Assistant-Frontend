import { BrushSquare, Category, Copy, Document, FolderAdd, Message, Setting, CloseCircle } from "iconsax-react";
import { Link, useLocation } from "react-router-dom";
import Profile from "../views/Home/Profile";
import { useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const pages = [
   {
      id: 9834,
      icon: Category,
      name: "Category",
      path: "/category",
   },
   {
      id: 6767,
      icon: Document,
      name: "Document",
      path: "/document",
   },
   {
      id: 8232,
      icon: Copy,
      name: "Copy",
      path: "/copy",
   },
   {
      id: 9676,
      icon: BrushSquare,
      name: "BrushSquare",
      path: "/brush-square",
   },
   {
      id: 2346,
      icon: FolderAdd,
      name: "FolderAdd",
      path: "/folder-add",
   },
   {
      id: 9834,
      icon: Message,
      name: "Message",
      path: "/message",
   },
];

function Navigation() {
   const location = useLocation();
   const [currentPath, setCurrentPath] = useState("/copy");
   const [menuOpen, setMenuOpen] = useState(false);


   return (
      <div>
         <div className="fixed top-0 left-0 bottom-0 w-[66px] bg-[#111111] text-white">
            <div className="flex justify-between flex-col py-8 gap-4 h-screen overflow-y-scroll scrollbar-hidden">
               <div className="flex flex-col gap-2 items-center">
                  <div onClick={() => setMenuOpen((v) => !v)} role="button" className="mb-6 lg:hidden">
                     <img className="" src="/images/Rectangle 37.png" alt="" />
                  </div>
                  {pages.map(({ icon, id, path }) => {
                     const IconElement = icon;

                     return (
                        <Link
                           key={id}
                           to={path}
                           onClick={() => setCurrentPath(path)}
                           role="button"
                           className={`w-12 h-12 rounded-xl grid place-content-center ${currentPath === path ? "bg-white text-[#111111]" : ""}`}
                        >
                           <IconElement size={24} color={currentPath === path ? "#111111" : "currentColor"} />
                        </Link>
                     );
                  })}
               </div>
               <div className="flex flex-col gap-2 items-center">
                  <Link
                     to="/settings"
                     onClick={() => setCurrentPath("/settings")}
                     role="button"
                     className={`w-12 h-12 rounded-xl grid place-content-center ${currentPath === "/settings" ? "bg-white text-[#111111]" : ""}`}
                  >
                     <Setting size={24} color={currentPath === "/settings" ? "#111111" : "currentColor"} />
                  </Link>
                  <Link to="/profile" onClick={() => setCurrentPath("/profile")} role="button">
                     <img
                        width={32}
                        height={32}
                        src="/images/person-image.png"
                        className={`rounded-full ${currentPath === "/profile" ? "bg-white" : ""}`}
                        alt=""
                     />
                  </Link>
               </div>
            </div>
         </div>
         <div className="lg:hidden">
            <Drawer
               direction="left"
               open={menuOpen}
               onClose={() => setMenuOpen(false)}
               style={{ width: 320 }}
            >
               <div className="bg-[#383434] px-4 py-14 min-h-screen overflow-y-auto w-full">
                  <button onClick={() => setMenuOpen(false)} className="p-3 absolute top-4 right-4">
                     <CloseCircle />
                  </button>
                  <Profile />
               </div>
            </Drawer>
         </div>
      </div>
   );
}

export default Navigation;
