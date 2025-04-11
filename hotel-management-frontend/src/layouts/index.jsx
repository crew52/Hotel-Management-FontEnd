import React, { useState } from "react";
import {
    Box,
} from "@mui/material";
import AppbarAdmin from "./AppBar/appbarAdmin.jsx";
import NavAdmin from "./Nav/navAdmin.jsx";
import ContentAdmin from "./Content/contentAdmin.jsx";
import FooterAdmin from "./Footer/footerAdmin.jsx";

export default function HeaderWithNav() {

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
            <ContentAdmin/>
            <FooterAdmin/>

        </Box>
    );
}