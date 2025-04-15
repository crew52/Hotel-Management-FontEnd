import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Checkbox,
    CircularProgress,
    Typography,
} from "@mui/material";
import RoomService from "../../services/RoomServices.js";
import { toast } from "react-toastify";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";

const RoomCategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [formType, setFormType] = useState("category");
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [categoriesData, roomsData] = await Promise.all([
                RoomService.getRoomCategories(),
                RoomService.getRooms(),
            ]);

            setCategories(categoriesData);
            setRooms(roomsData);
        } catch (error) {
            setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.");
            toast.error("Lỗi khi tải dữ liệu!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const getRoomCount = (categoryId) => {
        return rooms.filter((room) => room.room_category_id === categoryId).length;
    };

    const handleOpenForm = async (mode, type, item = null) => {
        if (mode === "edit" && !item) {
            toast.error("Không tìm thấy dữ liệu để chỉnh sửa!");
            return;
        }
        if (type === "room" && mode === "edit" && item && !item.id) {
            toast.error("Không tìm thấy ID unique của phòng để chỉnh sửa!");
            return;
        }
        if (type === "room" && mode === "view" && item && !item.id) {
            toast.error("Không tìm thấy ID unique của phòng để xem chi tiết!");
            return;
        }
        if (type === "category" && mode === "edit" && item && !item.id) {
            toast.error("Không tìm thấy ID unique của hạng phòng để chỉnh sửa!");
            return;
        }
        if (type === "category" && (mode === "edit" || mode === "view")) {
            try {
                const categoriesData = await RoomService.getRoomCategories();
                const exists = categoriesData.find((cat) => cat.id === item.id);
                if (!exists) {
                    toast.error("Hạng phòng không tồn tại trong dữ liệu! Đang làm mới danh sách...");
                    await fetchData();
                    return;
                }
                item = categoriesData.find((cat) => cat.id === item.id);
            } catch (error) {
                toast.error("Không thể kiểm tra dữ liệu hạng phòng!");
                console.error(error);
                return;
            }
        }
        if (type === "room" && (mode === "edit" || mode === "view")) {
            try {
                const roomsData = await RoomService.getRooms();
                const exists = roomsData.find((room) => room.id === item.id);
                if (!exists) {
                    toast.error("Phòng không tồn tại trong dữ liệu! Đang làm mới danh sách...");
                    await fetchData();
                    return;
                }
                item = roomsData.find((room) => room.id === item.id);
            } catch (error) {
                toast.error("Không thể kiểm tra dữ liệu phòng!");
                console.error(error);
                return;
            }
        }

        console.log("Opening form with mode:", mode, "type:", type, "item:", item);
        setFormMode(mode);
        setFormType(type);
        setSelectedItem(item);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedItem(null);
    };

    const handleSave = async (updatedItem) => {
        console.log("handleSave called with updatedItem:", updatedItem);
        if (formType === "category") {
            if (formMode === "add") {
                setCategories([...categories, updatedItem]);
            } else if (updatedItem === null) {
                setCategories(categories.filter((cat) => cat.id !== selectedItem.id));
            } else if (updatedItem.mode === "edit") {
                setFormMode("edit");
                setSelectedItem(updatedItem);
                return;
            } else {
                setCategories(
                    categories.map((cat) =>
                        cat.id === updatedItem.id ? updatedItem : cat
                    )
                );
            }
        } else {
            if (formMode === "add") {
                setRooms([...rooms, updatedItem]);
            } else if (updatedItem === null) {
                setRooms(rooms.filter((room) => room.id !== selectedItem.id));
            } else if (updatedItem.mode === "edit") {
                setFormMode("edit");
                setSelectedItem(updatedItem);
                return;
            } else {
                setRooms(rooms.map((room) => (room.id === updatedItem.id ? updatedItem : room)));
            }
        }
        await fetchData();
        handleCloseForm();
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Hạng phòng" />
                    <Tab label="Danh sách phòng" />
                </Tabs>
                <Box>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                            handleOpenForm("add", selectedTab === 0 ? "category" : "room")
                        }
                        sx={{ mr: 1 }}
                    >
                        Thêm mới
                    </Button>
                </Box>
            </Box>

            {selectedTab === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Mã hạng phòng</TableCell>
                                <TableCell>Tên hạng phòng</TableCell>
                                <TableCell>Số lượng phòng</TableCell>
                                <TableCell>Giá giờ</TableCell>
                                <TableCell>Giá cả ngày</TableCell>
                                <TableCell>Giá qua đêm</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        Không có dữ liệu để hiển thị.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow
                                        key={category.id}
                                        onClick={() => handleOpenForm("view", "category", category)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>{category.room_category_code}</TableCell>
                                        <TableCell>{category.room_category_name}</TableCell>
                                        <TableCell>{getRoomCount(category.room_category_id)}</TableCell>
                                        <TableCell>
                                            {category.hourly_price.toLocaleString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            {category.daily_price.toLocaleString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            {category.overnight_price.toLocaleString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            {category.status === "ACTIVE" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="text" color="primary">
                                                Chỉnh sửa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {selectedTab === 1 && (
                <RoomList
                    rooms={rooms}
                    categories={categories}
                    onOpenForm={(mode, item) => handleOpenForm(mode, "room", item)}
                    onSave={handleSave}
                />
            )}

            <RoomForm
                open={openForm}
                onClose={handleCloseForm}
                mode={formMode}
                type={formType}
                initialData={selectedItem}
                onSave={handleSave}
                categories={categories}
            />
        </Box>
    );
};

export default RoomCategoryList;
