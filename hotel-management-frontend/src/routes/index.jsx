import {Route, Routes} from "react-router";
import Login from "../pages/Login.jsx";
import HomeAdmin from "../pages/HomeAdmin.jsx";

function RoutersAdmin(){
   return(
       <Routes>
           <Route path="/admin" element={<HomeAdmin/>}></Route>
           <Route path="/login" element={<Login />} />
       </Routes>
   )
}

export default RoutersAdmin;