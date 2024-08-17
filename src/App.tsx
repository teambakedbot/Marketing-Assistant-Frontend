import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import "./styles/main.css";
import Layout from "./components/Layout";
import Category from "./views/Category";
import Document from "./views/Document";
import BrushSquare from "./views/BrushSquare";
import FolderAdd from "./views/FolderAdd";
import Message from "./views/Message";
import Settings from "./views/Settings";
import Profile from "./views/Profile";

function App() {
   return (
      <div>
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<Home />} ></Route>
               <Route path="category" element={<Category />}></Route>
               <Route path="document" element={<Document />}></Route>
               <Route path="copy" element={<Home />}></Route>
               <Route path="brush-square" element={<BrushSquare />}></Route>
               <Route path="folder-add" element={<FolderAdd />}></Route>
               <Route path="message" element={<Message />}></Route>
               <Route path="settings" element={<Settings />}></Route>
               <Route path="profile" element={<Profile />}></Route>
            </Route>
         </Routes>
      </div>
   );
}

export default App;
