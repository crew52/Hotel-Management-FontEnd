import { Box, Button, Popper, MenuList, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";

function NavAdmin() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate();


    const handleMouseEnter = () => {
        setOpen(true);
    };


    const handleMouseLeave = () => {
        setOpen(false);
    };

    const handleMenuItemClick = (path) => {
        setOpen(false);
        navigate(path);
    };


    const textButtonSx = {
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 6,
        "&:hover": {
            backgroundColor: "#006ce0",
        },
    };


    const overviewButtonSx = {
        color: "white",
        backgroundColor: "#0052cc",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 2,
        "&:hover": {
            backgroundColor: "#0041a8",
        },
    };

    return (
        <section style={{ backgroundColor: "#007bff", padding: "5px 18px" }}>
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
                        sx={overviewButtonSx}
                        component={Link}
                        to="/admin"
                    >
                        Tổng quan
                    </Button>

                    <Box>
                        <Button variant="text" sx={textButtonSx} component={Link} to="/admin/rooms">
                            Phòng
                        </Button>
                    </Box>

                    <Box>
                        <Button variant="text" sx={textButtonSx} component={Link} to="/admin/goods">
                            Hàng hóa
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx}
                            component={Link}
                            to="/admin/transactions"
                        >
                            Giao dịch
                        </Button>
                    </Box>

                    <Box>
                        <Button variant="text" sx={textButtonSx} component={Link} to="/admin/partners">
                            Đối tác
                        </Button>
                    </Box>


                    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Button variant="text" sx={textButtonSx} ref={anchorRef}>
                            Nhân viên
                        </Button>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            placement="bottom-start"
                            disablePortal
                            style={{ zIndex: 9999 }}
                        >
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1,
                                    boxShadow: 3,
                                    minWidth: 180,
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <MenuList dense>
                                    <MenuItem onClick={() => handleMenuItemClick("/admin/employee")}>
                                        Nhân viên
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick()}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }}
                                    >
                                        Lịch làm việc
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick()}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }}
                                    >
                                        Chấm công
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick()}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }}
                                    >
                                        Bảng tính lương
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick()}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f0f0f0",
                                            },
                                        }}
                                    >
                                        Thiết lập nhân viên
                                    </MenuItem>
                                </MenuList>
                            </Box>
                        </Popper>

                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx}
                            component={Link}
                            to="/admin/cashbook"
                        >
                            Sổ quỹ
                        </Button>
                    </Box>

                    <Box>
                        <Button variant="text" sx={textButtonSx} component={Link} to="/admin/reports">
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
                    startIcon={<KeyboardArrowDownIcon />}
                    onClick={() => navigate('/employees')}
                >
                    Lễ tân
                </Button>
            </nav>
        </section>
    );
}

export default NavAdmin;