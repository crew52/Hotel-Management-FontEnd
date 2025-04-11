import React, { useState } from "react";
import {
    AppBar,
    Box,
    Typography,
    IconButton,
    Avatar,
    Button,
    Link,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function HeaderWithNav() {
    const textButtonSx = {
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 6,
        "&:hover": {
            backgroundColor: "#006ce0",
        },
    };


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

            <AppBar/>

            <section style={{backgroundColor: "#007bff", padding: "5px 18px"}}>
                <nav
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box
                        display="flex"
                        gap={1}
                        sx={{
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            "&::-webkit-scrollbar": {
                                height: "2px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#0052cc",
                                borderRadius: "20px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "#ffffff",
                                borderRadius: "20px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                background: "#e0e0e0",
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                color: "white",
                                backgroundColor: "#0052cc",
                                fontWeight: "bold",
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#0041a8",
                                },
                            }}
                        >
                            Tổng quan
                        </Button>

                        <Box>
                            <Button
                                sx={textButtonSx}
                                variant="text">

                                Phòng
                            </Button>

                        </Box>


                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Hàng hóa
                            </Button>
                        </Box>

                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Giao dịch
                            </Button>
                        </Box>

                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Đối tác
                            </Button>
                        </Box>

                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Nhân viên
                            </Button>
                        </Box>

                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Sổ quỹ
                            </Button>
                        </Box>

                        <Box>
                            <Button
                                variant="text"
                                sx={textButtonSx}
                            >
                                Báo cáo
                            </Button>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "white",
                            color: "#007bff",
                            fontWeight: "bold",
                            borderRadius: 2,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#f0f0f0",
                            },
                        }}
                        startIcon={<KeyboardArrowDownIcon/>}
                    >
                        Lễ tân
                    </Button>
                </nav>
            </section>

            <section style={{padding: "20px", flex: 1}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Tổng quan - Hàng hóa
                </Typography>
                <Typography>
                    Đây là nơi bạn có thể hiển thị nội dung chính cho mục "Tổng quan" và "Hàng hóa".
                </Typography>
            </section>

            <Box
                sx={{
                    padding: "16px",
                    backgroundColor: "#f5f5f5",
                    borderTop: "1px solid #ddd",
                    textAlign: "center",
                    color: "#666",
                }}
            >
                <Typography variant="body2">
                    © 2025 Công ty TNHH MH370. All rights reserved.
                </Typography>
                <Box display="flex" justifyContent="center" gap={2} mt={1}>
                    <Link href="#" underline="hover" color="primary">
                        Chính sách bảo mật
                    </Link>
                    <Link href="#" underline="hover" color="primary">
                        Điều khoản sử dụng
                    </Link>
                    <Link href="#" underline="hover" color="primary">
                        Liên hệ
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}