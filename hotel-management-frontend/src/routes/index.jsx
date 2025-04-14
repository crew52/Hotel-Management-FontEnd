import { Route, Routes } from "react-router";
import Login from "../pages/Login.jsx";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";

function RoutersAdmin() {
   return (
       <Routes>
           {/* Public routes */}
           <Route path="/login" element={<Login />} />
           
           {/* Protected admin routes */}
           <Route 
               path="/admin" 
               element={
                   <ProtectedRoute 
                       requireAdmin={true} 
                       element={<HomeAdmin />} 
                   />
               } 
           />
           
           {/* Protected employee routes */}
           <Route 
               path="/employees" 
               element={
                   <ProtectedRoute 
                       element={<EmployedView />} 
                   />
               }
           />
           
           {/* Redirect to login for unknown routes */}
           <Route path="*" element={<Login />} />
       </Routes>
   )
}

export default RoutersAdmin;