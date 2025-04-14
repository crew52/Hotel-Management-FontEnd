import ContentAdmin from "../layouts/Admin/Content/contentAdmin.jsx";
import {Box} from "@mui/material";
import AppbarAdmin from "../layouts/Admin/AppBar/appbarAdmin.jsx";
import NavAdmin from "../layouts/Admin/Nav/navAdmin.jsx";
import FooterAdmin from "../layouts/Admin/Footer/footerAdmin.jsx";
import React from "react";
import {Outlet} from "react-router-dom";


function HomeAdmin() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                margin: 0,
                padding: 0,
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#a8a8a8",
                },
            }}>

            <AppbarAdmin/>
            <NavAdmin/>
            <div>
            <Outlet/>
            </div>
            {/*<ContentAdmin/>*/}
            <FooterAdmin/>

        </Box>

    )
}

export default HomeAdmin;