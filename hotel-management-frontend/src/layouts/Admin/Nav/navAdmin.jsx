import {Box, Button,} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";
import { useNavigate } from "react-router-dom";
function NavAdmin(){
    const navigate = useNavigate();
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
                            variant="text"
                            onClick={() => navigate("/admin/rooms")}
                        >
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
    )
}

export default NavAdmin;