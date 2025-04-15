import { AppBar, Avatar, Box, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from "../../../hooks";
import AccountModal from "../../../components/AccountModal";

function AppbarAdmin() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { logout } = useAuth();
    const [accountModalOpen, setAccountModalOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        handleMenuClose();
        logout();
    };

    const handleAccount = () => {
        console.log("Tài khoản clicked");
        handleMenuClose();
        setAccountModalOpen(true);
    };

    const handleCloseAccountModal = () => {
        setAccountModalOpen(false);
    };

    // Dữ liệu người dùng mẫu (thực tế nên lấy từ API hoặc context)
    const userData = {
        username: 'hoangphu',
        fullName: 'hoangphu',
        email: '',
        phone: '0912149918',
        role: 'Admin',
        language: 'Tiếng Việt',
        note: ''
    };

    return (
        <>
            <AppBar position="static" color="default" elevation={1} sx={{ height: 50 }}>
                <Box
                    sx={{
                        height: "100%",
                        flexWrap: 'wrap',
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            cursor: "pointer",
                            borderRadius: 20,
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
                                <g fill="#64892f">
                                    <path d="m28.7 60.6l3-4.2s-1.5-1-2.4-1.1s-2.6.4-2.6.4z"/>
                                    <path d="m34.3 60.1l1.8-5s-1.7-.5-2.6-.3s-2.3 1.2-2.3 1.2z"/>
                                    <path d="m39.5 58.9l1.3-5.2s-1.7-.2-2.6 0c-.9.3-2.2 1.6-2.2 1.6zm18.3-13l-2-4.9s-1.5 1.1-2 1.9s-.8 2.8-.8 2.8zm3.1-7.9l-3.3-3.9s-1.1 1.5-1.3 2.5s0 2.9 0 2.9zm1.1-9.4l-4.2-2.7s-.7 1.8-.6 2.8c0 1 .8 2.8.8 2.8zm-1.3-8.8L56 18.6s-.1 2 .2 2.9s1.5 2.4 1.5 2.4zm-2.9-7.4l-4.8-.5s.1 2 .4 2.9c.4.9 1.7 2.2 1.7 2.2zm-4.4-6.3l-4.5 1.8s.8 1.7 1.5 2.4c.7.6 2.4 1.1 2.4 1.1z"/>
                                </g>
                                <path fill="#769e2a" d="M26.4 44.7c-2-9.3-13.2-2.7-13 4.7c.1 4.4-13.5 7.1-.2 7.1c3.1 0 5.9.6 6-5.6c.2-2.2 9.4 3.7 7.2-6.2"/>
                                <path fill="#83b533" d="M51 8.7c2.1.6 12.4 19.8 4.6 34.6C43 66.9 7.4 63.5 4.8 38.5c-1.4-13.2 5.3-12.7 5.3-9c-3.1-1.1-2.5 9.8 2.3 12.7c10.9 6.6 19.9-2 23-7.6c3.1-5.7.5-12.7.5-15.5S51 8.7 51 8.7"/>
                                <path fill="#ffd93b" d="M14.1 45.2C29.2 55.9 41.7 42 46 32.7c3.6-7.7 1.7-16.8.9-22.3c-4.5 2.5-11.2 6.5-11.2 8.3c0 2.7 2.7 9.8-.5 15.5S18.9 48.7 10 39.4c.9 2.1 2.6 4.7 4.1 5.8"/>
                                <g fill="#8cc63e">
                                    <path d="M53.5 48.2c-1.6-7.1-3.8-12-6.3-10.6s.6 10.1-2.9 15.8c-5.7 9.2 1.9 2.5 5.4 4.5c13.2 7.3 5.9-.4 3.8-9.7"/>
                                    <path d="M54 49.3c-2.2-4.8-4.4-7.9-6-6.2s1.9 13.7 4.7 14.2c10.5 2.1 4.2-1.7 1.3-8"/>
                                </g>
                                <path fill="#d3b226" d="M36.8 27.1c1.8-.8 7.4-1.7 11-.6m-11.8 6c1.9-.3 5.6.2 9 2.1m-13.4 3.9c1.9.1 4.9 1 7.9 3.7M25.9 42c1.8.8 3.3 2.3 5.4 5.9M18 43.4s1 .4 1.5 4.6"/>
                                <path fill="#769e2a" d="M34.7 37.6c0 1.4-.5 2.7-2 2.7s-2.8-1.1-2.8-2.5s2.8-3.8 4.3-3.8s.5 2.2.5 3.6"/>
                                <path fill="#8cc63e" d="M33.9 49.1c-2.2-10.2-14-3-13.8 5.2c.1 4.9-14.4 7.7-.2 7.7c3.3 0 5.7.7 6.3-6.2c.2-2.4 10 4.1 7.7-6.7"/>
                                <path fill="#64892f" d="m2 34.6l3.6 2.5s.6-1.6.6-2.5s-.6-2.5-.6-2.5zm.8 6.5l4 1.5s.3-1.7.1-2.6s-1.1-2.3-1.1-2.3zm2.1 6.2l4.2.5s-.1-1.7-.4-2.5s-1.5-1.9-1.5-1.9zm3.2 6.3l4.8-.7s-.5-1.9-1-2.7s-2.1-1.7-2.1-1.7zm5.8 5.2l4.3-2.4s-1-1.6-1.7-2.2c-.7-.5-2.5-.9-2.5-.9z"/>
                                <path fill="#83b533" d="M50.6 11c1.9 1.8 6.1 6.3 3.7 10.2s-12.8 7.1-23.4 4.3S6 16.8 5.5 14.4s1.1-2.4 2.2-1.6S50.6 11 50.6 11"/>
                                <ellipse cx="38.6" cy="7.6" fill="#8cc63e" rx="5.4" ry="5.6"/>
                                <ellipse cx="38.6" cy="7.6" fill="#fff" rx="4.4" ry="4.6"/>
                                <ellipse cx="38.6" cy="7.6" fill="#3e4347" rx="3.1" ry="3.3"/>
                                <path fill="#e8f94b" d="M7 12.1v3.3l2.2-1.2l.2 2.5l2-1.7l.9 3.4l2.6-2.1l1.3 3.6l3-2.5l1.7 4.3l5.3-3.7l.4 5.3l3.8-3.4l1.9 4.8l3.4-4.5l2.6 5.2l3.2-5.2l2.8 5.1l1.8-5.3l3.9 3.4l-.4-4.8l4.4 1.2l-3.4-4.8l2.6-.2l-2.7-2.7l-17.2 4.5l-17.4-2.4z"/>
                                <path fill="#8cc63e" d="M9.8 8.6c0 2.5-.7 2.4-1.6 2.4s-1.6.1-1.6-2.4c0-1.4.7-2.4 1.6-2.4c.9-.1 1.6 1 1.6 2.4"/>
                                <ellipse cx="7.7" cy="8.6" fill="#4b662b" rx=".6" ry="1.7"/>
                                <g fill="#8cc63e">
                                    <path d="M4.5 10.7c-.3-6.3 16.2 6 36.9-2.3c5-2 9.8-.1 10.1 6.1c.3 6.3-4.1 7.1-9.5 7.8c-5.6.8-37.2-5.3-37.5-11.6"/>
                                    <path d="M14.8 9.9c0 3.7-1 3.6-2.3 3.6s-2.3.1-2.3-3.6c0-2 1-3.6 2.3-3.6c1.2 0 2.3 1.6 2.3 3.6"/>
                                </g>
                                <ellipse cx="12" cy="9.9" fill="#4b662b" rx="1.3" ry="2.6"/>
                                <ellipse cx="46.1" cy="7.6" fill="#8cc63e" rx="5.4" ry="5.6"/>
                                <ellipse cx="46.1" cy="7.6" fill="#fff" rx="4.4" ry="4.6"/>
                                <ellipse cx="46.1" cy="7.6" fill="#3e4347" rx="3.1" ry="3.3"/>
                            </svg>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="#0B2B4B" ml={1}>
                            MH370
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                                borderRadius: 20,
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                                <path fill="#EDCE83"
                                    d="M446.93 303.162c-4.767-6.76-6.503-15.149-4.712-23.225a66.3 66.3 0 0 0 1.57-14.376c0-26.88-16.042-50.111-39.339-61.207c-5.232-2.492-9.655-6.421-12.498-11.47c-21.55-38.27-48.807-67.372-84.6-81.145c16.419-31.108 40.537-59.02 60.568-79.165C379.907 20.516 371.416 0 354.412 0H168.935c-16.949 0-25.422 20.37-13.582 32.498c18.479 18.928 39.89 45.296 54.169 76.837c-42.403 13.594-62.967 49.997-94.425 119.688c-3.236 7.169-9.285 12.663-16.707 15.268c-34.198 12.003-58.637 43.782-58.637 81.104c0 18.49 6.001 35.619 16.213 49.658c3.264 4.488 4.98 9.886 5.174 15.432c2.386 68.375 57.921 121.592 197.165 121.592c131.117 0 180.512-44.445 189.025-107.16c.51-3.755 1.66-7.402 3.571-10.673c7.321-12.532 11.504-27.017 11.504-42.451c-.001-18.042-5.712-34.788-15.475-48.631"/>
                                <path fill="#AA8F4D"
                                    d="M257.954 133.694c-14.867 0-28.824-1.189-39.3-3.348c-6.111-1.259-24.706-5.092-24.706-18.932a9.685 9.685 0 0 1 9.685-9.685c4.304 0 7.952 2.808 9.213 6.691c4.58 2.565 20.732 5.904 45.107 5.904c24.377 0 40.529-3.339 45.108-5.904c1.261-3.883 4.909-6.691 9.213-6.691a9.685 9.685 0 0 1 9.685 9.685c0 13.84-18.595 17.672-24.705 18.932c-10.475 2.158-24.432 3.348-39.3 3.348m23.953 98.917c12.506 2.426 22.662 7.557 31.331 15.02c1.97 1.696 2.165 4.688.481 6.668l-11.265 13.245c-1.635 1.922-4.469 2.204-6.498.702c-9.36-6.93-19.046-10.232-30.202-10.232c-12.56 0-20.468 5.35-20.468 14.886c0 9.768 5.815 13.723 29.772 21.166c29.307 9.304 46.054 21.631 46.054 50.008c0 22.674-14.447 40.037-39.482 46.404c-2.092.532-3.548 2.433-3.548 4.592v28.212a4.76 4.76 0 0 1-4.759 4.759h-17.23a4.76 4.76 0 0 1-4.759-4.759v-26.313c0-2.386-1.772-4.414-4.14-4.709c-18.275-2.272-32.347-9.238-42.761-18.163c-2.022-1.733-2.168-4.817-.375-6.787l12.572-13.814c1.688-1.855 4.514-2.059 6.483-.505c10.12 7.986 21.629 12.482 35.199 12.482c15.118 0 24.19-6.977 24.19-18.608c0-11.164-5.584-16.282-27.912-23.259c-34.889-10.7-47.217-25.12-47.217-47.915c0-22.555 16.187-38.383 40.168-43.286a4.745 4.745 0 0 0 3.793-4.648v-25.46a4.76 4.76 0 0 1 4.759-4.759h17.23a4.76 4.76 0 0 1 4.759 4.759v25.658a4.74 4.74 0 0 0 3.825 4.656"/>
                            </svg>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                                borderRadius: 20,
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22m7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A1 1 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a1 1 0 0 0-.293-.707z"/>
                            </svg>
                        </Box>

                        <IconButton>
                            <SettingsIcon />
                        </IconButton>

                        <div>
                            <Avatar
                                sx={{ bgcolor: "#e3f2fd", width: 32, height: 32, marginRight: 1, cursor: "pointer" }}
                                onClick={handleMenuOpen}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                sx={{ 
                                    "& .MuiPaper-root": { 
                                        minWidth: "200px",
                                        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)" 
                                    } 
                                }}
                            >
                                <MenuItem onClick={handleAccount} sx={{ py: 1.5 }}>
                                    <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: "#555" }} /> Tài khoản
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                                    <ArrowForwardIcon fontSize="small" sx={{ mr: 1, color: "#555" }} /> Đăng xuất
                                </MenuItem>
                            </Menu>
                        </div>
                    </Box>
                </Box>
            </AppBar>
            
            {/* Modal thông tin tài khoản */}
            <AccountModal 
                open={accountModalOpen} 
                onClose={handleCloseAccountModal} 
                userData={userData}
            />
        </>
    );
}

export default AppbarAdmin;