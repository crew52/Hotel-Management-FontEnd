import { Route, Routes } from "react-router";
import Login from "../pages/Login.jsx";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import RoomCategoryList from "../components/roomAdmin/RoomCategoryList.jsx";
import RoomCategoryForm from "../components/roomAdmin/RoomCategoryForm.jsx";
import RoomForm from "../components/roomAdmin/RoomForm.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import HomePage from "../pages/HomePage.jsx";

function RoutersAdmin() {
   return (
       <Routes>
           {/* Public routes */}
           <Route path="/" element={<HomePage />} />
           <Route path="/login" element={<Login />} />
           
           {/* Protected routes */}
           <Route 
               path="/admin" 
               element={
                   <ProtectedRoute roles={['ROLE_ADMIN']}>
                       <HomeAdmin />
                   </ProtectedRoute>
               } 
           />
           
           <Route 
               path="/employees" 
               element={
                   <ProtectedRoute>
                       <EmployedView />
                   </ProtectedRoute>
               }
           />
           
           {/* Redirect to home page for unknown routes */}
           <Route path="*" element={<HomePage />} />
       </Routes>
   )
}

export default RoutersAdmin;