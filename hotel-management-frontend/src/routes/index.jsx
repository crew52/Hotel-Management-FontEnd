import {Route, Routes} from "react-router";
import HeaderWithNav from "../layouts/index.jsx";

function RoutersAdmin(){
   return(
       <Routes>
           <Route path="/admin" element={<HeaderWithNav/>}></Route>
       </Routes>
   )
}

export default RoutersAdmin;