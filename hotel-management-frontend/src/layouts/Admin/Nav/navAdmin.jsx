import { Box, Button, Popper, MenuList, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";

function NavAdmin() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("overview"); // Track the active button, default to "overview"
    const [selectedMenuItem, setSelectedMenuItem] = useState(null); // Track the selected item in the "Nhân viên" dropdown

    const handleMouseEnter = () => {
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    const handleButtonClick = (buttonKey) => {
        setActiveButton(buttonKey);
        setSelectedMenuItem(null); // Reset selected menu item when a top-level button is clicked
    };

    const handleMenuItemClick = (path, itemKey) => {
        setOpen(false);
        setActiveButton("employee"); // Set "Nhân viên" as active when any of its menu items are clicked
        setSelectedMenuItem(itemKey); // Track the selected menu item
        navigate(path);
    };

    const textButtonSx = (isActive) => ({
        color: isActive ? "#FFFFFF" : "#FFFFFF",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 6,
        backgroundColor: isActive ? "#FFB6C1" : "transparent", // Light pink for active, transparent for inactive
        "&:hover": {
            backgroundColor: isActive ? "#FFB6C1" : "rgba(255, 182, 193, 0.3)", // Slightly translucent light pink on hover for inactive buttons
        },
    });

    const overviewButtonSx = (isActive) => ({
        color: isActive ? "#FFFFFF" : "#FFFFFF",
        backgroundColor: isActive ? "#FFB6C1" : "transparent", // Light pink for active, transparent for inactive
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 2,
        "&:hover": {
            backgroundColor: isActive ? "#FFB6C1" : "rgba(255, 182, 193, 0.3)", // Slightly translucent light pink on hover for inactive buttons
        },
    });

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
                        variant="text"
                        sx={overviewButtonSx(activeButton === "overview")}
                        component={Link}
                        to="/admin"
                        onClick={() => handleButtonClick("overview")}
                    >
                        Tổng quan
                    </Button>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "rooms")}
                            component={Link}
                            to="/admin/rooms"
                            onClick={() => handleButtonClick("rooms")}
                        >
                            Phòng
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "goods")}
                            component={Link}
                            to="/admin/goods"
                            onClick={() => handleButtonClick("goods")}
                        >
                            Hàng hóa
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "transactions")}
                            component={Link}
                            to="/admin/transactions"
                            onClick={() => handleButtonClick("transactions")}
                        >
                            Giao dịch
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "partners")}
                            component={Link}
                            to="/admin/partners"
                            onClick={() => handleButtonClick("partners")}
                        >
                            Đối tác
                        </Button>
                    </Box>

                    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "employee")}
                            ref={anchorRef}
                            onClick={() => handleButtonClick("employee")}
                        >
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
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee", "employeeList")}
                                        sx={{
                                            color: "#000000", // Light pink text for menu items
                                            backgroundColor: selectedMenuItem === "employeeList" ? "rgba(255, 182, 193, 0.5)" : "transparent", // Slightly translucent light pink for selected
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "employeeList" ? "rgba(255, 182, 193, 0.5)" : "rgba(255, 182, 193, 0.3)", // Translucent light pink on hover for unselected items
                                            },
                                        }}
                                    >
                                        Nhân viên
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/schedule", "schedule")}
                                        sx={{
                                            color: "#000000", // Light pink text for menu items
                                            backgroundColor: selectedMenuItem === "schedule" ? "rgba(255, 182, 193, 0.5)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "schedule" ? "rgba(255, 182, 193, 0.5)" : "rgba(255, 182, 193, 0.3)",
                                            },
                                        }}
                                    >
                                        Lịch làm việc
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/attendance", "attendance")}
                                        sx={{
                                            color: "#000000", // Light pink text for menu items
                                            backgroundColor: selectedMenuItem === "attendance" ? "rgba(255, 182, 193, 0.5)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "attendance" ? "rgba(255, 182, 193, 0.5)" : "rgba(255, 182, 193, 0.3)",
                                            },
                                        }}
                                    >
                                        Chấm công
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/payroll", "payroll")}
                                        sx={{
                                            color: "#000000", // Light pink text for menu items
                                            backgroundColor: selectedMenuItem === "payroll" ? "rgba(255, 182, 193, 0.5)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "payroll" ? "rgba(255, 182, 193, 0.5)" : "rgba(255, 182, 193, 0.3)",
                                            },
                                        }}
                                    >
                                        Bảng tính lương
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/settings", "employeeSettings")}
                                        sx={{
                                            color: "#000000", // Light pink text for menu items
                                            backgroundColor: selectedMenuItem === "employeeSettings" ? "rgba(255, 182, 193, 0.5)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "employeeSettings" ? "rgba(255, 182, 193, 0.5)" : "rgba(255, 182, 193, 0.3)",
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
                            sx={textButtonSx(activeButton === "cashbook")}
                            component={Link}
                            to="/admin/cashbook"
                            onClick={() => handleButtonClick("cashbook")}
                        >
                            Sổ quỹ
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "reports")}
                            component={Link}
                            to="/admin/reports"
                            onClick={() => handleButtonClick("reports")}
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