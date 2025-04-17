import { Routes, Route, Navigate } from "react-router-dom";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import Login from "../pages/Login.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import ContentAdmin from "../layouts/Admin/Content/contentAdmin.jsx";
import { Typography } from "@mui/material";
import React from "react";
import EmployeeAdmin from "../pages/EmployeeAdmin/EmployeeAdmin.jsx";
import RoomCategoryForm from "../components/RoomCategory/RoomCategoryForm.jsx";
import RoomCategoryList from "../components/roomAdmin/RoomCategoryList.jsx";
import RoomForm from "../components/roomAdmin/RoomForm.jsx";
import RoomList from "../components/roomAdmin/RoomList.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import HomePage from "../pages/HomePage.jsx";
import MainLayout from '../layouts/Admin/MainLayout.jsx';

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
                <Route path="partners" element={<PartnersContent />} />
                <Route path="employee" element={<EmployeeAdmin />} />
                <Route path="cashbook" element={<CashbookContent />} />
                <Route path="reports" element={<ReportsContent />} />
                <Route path="rooms" element={<RoomCategoryList />} />
                <Route path="room-categories/add" element={<RoomCategoryForm />} />
                <Route path="room-categories/edit/:id" element={<RoomCategoryForm />} />
                <Route path="rooms/add" element={<RoomForm />} />
                <Route path="rooms/edit/:id" element={<RoomForm />} />
            </Route>

            {/* Protected employee routes */}
            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <EmployedView />
                    </ProtectedRoute>
                }
            />

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

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/rooms" replace />
            },
            {
                path: 'room-categories',
                element: <RoomCategoryList />
            },
            {
                path: 'rooms',
                element: <RoomList />
            }
        ]
    }
];

export default RoutersAdmin;