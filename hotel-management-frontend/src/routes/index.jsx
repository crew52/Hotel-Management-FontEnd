import {Route, Routes} from "react-router";
import Login from "../pages/Login.jsx";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";

function RoutersAdmin(){
   return(
       <Routes>
           <Route path="/admin" element={<HomeAdmin/>}></Route>
           <Route path="/login" element={<Login />} />
           <Route path="/employed" element={<EmployedView/>}></Route>
       </Routes>
   )
}

export default RoutersAdmin;