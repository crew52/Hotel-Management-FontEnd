import { Routes, Route } from "react-router-dom";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import Login from "../pages/Login.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import ContentAdmin from "../layouts/Admin/Content/contentAdmin.jsx";
import { Typography } from "@mui/material";
import React from "react";
import EmployeeAdmin from "../pages/EmployeeAdmin/EmployeeAdmin.jsx";
import RoomCategoryList from "../components/roomAdmin/RoomCategoryList.jsx";
import RoomCategoryForm from "../components/roomAdmin/RoomCategoryForm.jsx";
import RoomForm from "../components/roomAdmin/RoomForm.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";

const RoomsContent = () => (
    <section style={{ padding: "20px", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách phòng
        </Typography>
        <Typography>Đây là nơi hiển thị danh sách phòng.</Typography>
    </section>
);

const TransactionsContent = () => (
    <section style={{ padding: "20px", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách giao dịch
        </Typography>
        <Typography>Đây là nơi hiển thị danh sách giao dịch.</Typography>
    </section>
);

const PartnersContent = () => (
    <section style={{ padding: "20px", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách đối tác
        </Typography>
        <Typography>Đây là nơi hiển thị danh sách đối tác.</Typography>
    </section>
);

const CashbookContent = () => (
    <section style={{ padding: "20px", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sổ quỹ
        </Typography>
        <Typography>Đây là nơi hiển thị sổ quỹ.</Typography>
    </section>
);

const ReportsContent = () => (
    <section style={{ padding: "20px", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Báo cáo
        </Typography>
        <Typography>Đây là nơi hiển thị báo cáo.</Typography>
    </section>
);

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
            >
                <Route index element={<ContentAdmin />} />
                <Route path="partners" element={<PartnersContent />} />
                <Route path="employee" element={<EmployeeAdmin />} />
                <Route path="cashbook" element={<CashbookContent />} />
                <Route path="reports" element={<ReportsContent />} />
                <Route path="rooms" element={<RoomCategoryList />} />
                <Route path="add-room-category" element={<RoomCategoryForm />} />
                <Route path="add-room" element={<RoomForm />} />
            </Route>
            
            {/* Protected employee routes */}
            <Route 
                path="/employed" 
                element={
                    <ProtectedRoute 
                        element={<EmployedView />} 
                    />
                }
            />
            
            {/* Redirect to login for unknown routes */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
}

export default RoutersAdmin;