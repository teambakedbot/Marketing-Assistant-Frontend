import { Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import "./styles/main.css";
import Layout from "./components/Layout";

function App() {
   return (
      <div>
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<Home />} />
            </Route>
         </Routes>
      </div>
   );
}

export default App;
