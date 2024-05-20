import {Route, Routes} from "react-router-dom";
import Home from "./views/Home";
import "./styles/main.css";
import Layout from "./components/Layout";
import  CSVConverter from "./utils/CSVConverter";



function App() {
   return (
      <div>
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<Home />} />
               {/* <Route index element={<CSVConverter/>} /> */}
            </Route>
         </Routes>
      </div>
   );
}

export default App;
