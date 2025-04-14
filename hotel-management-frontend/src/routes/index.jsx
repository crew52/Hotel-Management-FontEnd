import { Routes, Route } from "react-router-dom";
import HomeAdmin from "../pages/HomeAdmin.jsx";
import Login from "../pages/Login.jsx";
import EmployedView from "../layouts/Employed/EmployedView/index.jsx";
import ContentAdmin from "../layouts/Admin/Content/contentAdmin.jsx";
import { Typography } from "@mui/material";
import React from "react";
import EmployeeAdmin from "../pages/EmployeeAdmin/EmployeeAdmin.jsx";


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
            <Route path="/admin" element={<HomeAdmin />}>
                <Route index element={<ContentAdmin />} />
                <Route path="partners" element={<PartnersContent />} />
                <Route path="employee" element={<EmployeeAdmin />} />
                <Route path="cashbook" element={<CashbookContent />} />
                <Route path="reports" element={<ReportsContent />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/employed" element={<EmployedView />} />
        </Routes>
    );
}

export default RoutersAdmin;