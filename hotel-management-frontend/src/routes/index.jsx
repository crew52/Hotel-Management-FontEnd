import { Routes, Route } from "react-router-dom";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import RoomCategoryList from "../components/roomAdmin/RoomCategoryList.jsx";
import RoomCategoryForm from "../components/roomAdmin/RoomCategoryForm.jsx";
import RoomForm from "../components/roomAdmin/RoomForm.jsx";
function RoutersAdmin(){
   return(
       <Routes>
           <Route path="/admin" element={<HomeAdmin />}>
               <Route
                   index
                   element={
                       <div>
                           <h2>Trang Tổng Quan</h2>
                           <p>Chào mừng đến với trang quản trị. Vui lòng chọn một mục từ thanh điều hướng.</p>
                       </div>
                   }
               />
               <Route path="rooms" element={<RoomCategoryList />} />
               <Route path="add-room-category" element={<RoomCategoryForm />} />
               <Route path="add-room" element={<RoomForm />} />
           </Route>
           {/*<Route path="/login" element={<Login />} />*/}
           <Route path="/employed" element={<EmployedView />} />
       </Routes>
   )
}

export default RoutersAdmin;