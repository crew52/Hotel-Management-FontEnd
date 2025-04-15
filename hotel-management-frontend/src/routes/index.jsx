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
import HomePage from "../pages/HomePage.jsx";

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
    console.log('Routes initialized');
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin routes */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute roles={['ROLE_ADMIN']}>
                        <HomeAdmin />
                    </ProtectedRoute>
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
            
            {/* Protected employee routes - hỗ trợ cả hai đường dẫn */}
            <Route 
                path="/employees" 
                element={
                    <ProtectedRoute>
                        <EmployedView />
                    </ProtectedRoute>
                }
            />
            
            {/* Hỗ trợ tương thích ngược với đường dẫn cũ /employed */}
            <Route 
                path="/employed" 
                element={
                    <ProtectedRoute>
                        <EmployedView />
                    </ProtectedRoute>
                }
            />
            
            {/* Redirect to home page for unknown routes */}
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}

export default RoutersAdmin;