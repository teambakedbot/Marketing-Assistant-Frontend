import { signOut } from "firebase/auth";
import {
  BrushSquare,
  Category,
  CloseCircle,
  Copy,
  Document,
  FolderAdd,
  Logout,
  Message,
  Setting,
} from "iconsax-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import "../styles/theme.css";
import { Link } from "react-router-dom";
import Profile from "../views/Profile";
import { auth } from "../config/firebase-config";

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
  const { displayName, photoURL } = useAuth();
  const currentPath = "/copy";

  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 w-[110px] dark-green-background-4 off-white">
        <div className="flex justify-between flex-col py-8 gap-4 h-screen overflow-y-scroll scrollbar-hidden">
          <div className="flex flex-col gap-2 items-center">
            {/* <div
              onClick={() => setMenuOpen((v) => !v)}
              role="button"
              className="mb-6 p-3"
            >
              <img className="" src="/images/Rectangle 37.png" alt="" />
            </div> */}
            <div></div>
            {pages.map(({ icon, id, path }) => {
              const IconElement = icon;

              return (
                <Link
                  key={id}
                  to={path}
                  role="button"
                  className={`w-12 h-12 rounded-xl grid place-content-center ${
                    currentPath === path ? "bg-white text-[#111111]" : ""
                  }`}
                >
                  <IconElement size={24} />
                </Link>
              );
            })}
            <p onClick={logout} className="cursor-pointer">
              <Logout />
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Link
              to="/settings"
              role="button"
              className={`w-12 h-12 rounded-xl grid place-content-center`}
            >
              <Setting size={24} />
            </Link>
            <div className="flex flex-col items-center">
              <Link to="/profile" role="button">
                <img
                  width={40}
                  height={40}
                  src={photoURL || "/images/person-image.png"}
                  className="rounded-full"
                  alt="Profile"
                />
              </Link>
              {displayName && (
                <p className="text-white text-center mt-2 text-lg max-w-[100px] overflow-hidden whitespace-normal text-ellipsis">
                  {displayName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Drawer
          className=""
          direction="left"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          style={{ width: 320 }}
        >
          <div className="dark-green-background-1 px-4 py-14 min-h-screen overflow-y-auto w-full">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-3 absolute top-4 right-4"
            >
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
