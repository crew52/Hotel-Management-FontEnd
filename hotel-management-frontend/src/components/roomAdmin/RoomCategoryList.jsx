"use client";

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
import roomService from "../../services/RoomService.js";
import { toast } from "react-toastify";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";
import RoomCategoryForm from "./RoomCategoryForm";

const FORM_MODES = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view'
};

const FORM_TYPES = {
    CATEGORY: 'category',
    ROOM: 'room'
};

const ROOM_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};

const INITIAL_STATE = {
    categories: [],
    roomCounts: {},
    selectedTab: 0,
    isLoading: true,
    errorMessage: null,
    isFormOpen: false,
    formMode: FORM_MODES.ADD,
    formType: FORM_TYPES.CATEGORY,
    selectedItem: null
};

const RoomCategoryList = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

            const categoriesData = await roomService.getRoomCategories();
            const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];

            const roomsResponse = await roomService.getAll(0, 100);
            const rooms = roomsResponse.content || [];

            const roomCounts = categoriesArray.reduce((counts, category) => ({
                ...counts,
                [category.id]: rooms.filter(room => room.roomCategory?.id === category.id).length
            }), {});

            setState(prev => ({
                ...prev,
                categories: categoriesArray,
                roomCounts,
                isLoading: false
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            setState(prev => ({
                ...prev,
                errorMessage: "Không thể tải dữ liệu hạng phòng. Vui lòng kiểm tra kết nối và thử lại.",
                isLoading: false
            }));
            toast.error("Lỗi khi tải dữ liệu!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setState(prev => ({ ...prev, selectedTab: newValue }));
    };

    const validateFormOpen = async (mode, type, item) => {
        if (mode === FORM_MODES.EDIT && !item) {
            toast.error("Không tìm thấy dữ liệu để chỉnh sửa!");
            return false;
        }

        if ((mode === FORM_MODES.EDIT || mode === FORM_MODES.VIEW) && !item?.id) {
            toast.error(`Không tìm thấy ID unique của ${type === FORM_TYPES.ROOM ? 'phòng' : 'hạng phòng'}!`);
            return false;
        }

        try {
            if (type === FORM_TYPES.CATEGORY) {
                const categoriesData = await roomService.getRoomCategories();
                const existingCategory = categoriesData.find(cat => cat.id === item?.id);
                if (!existingCategory && (mode === FORM_MODES.EDIT || mode === FORM_MODES.VIEW)) {
                    toast.error("Hạng phòng không tồn tại! Đang làm mới danh sách...");
                    await fetchData();
                    return false;
                }
                return existingCategory || item;
            } else {
                const roomsData = await roomService.getAll(0, 10);
                const existingRoom = roomsData.content?.find(room => room.id === item?.id);
                if (!existingRoom && (mode === FORM_MODES.EDIT || mode === FORM_MODES.VIEW)) {
                    toast.error("Phòng không tồn tại! Đang làm mới danh sách...");
                    await fetchData();
                    return false;
                }
                return existingRoom || item;
            }
        } catch (error) {
            console.error('Error validating form:', error);
            toast.error(`Không thể kiểm tra dữ liệu ${type === FORM_TYPES.ROOM ? 'phòng' : 'hạng phòng'}!`);
            return false;
        }
    };

    const handleOpenForm = async (mode, type, item = null) => {
        const validatedItem = await validateFormOpen(mode, type, item);
        if (!validatedItem && (mode === FORM_MODES.EDIT || mode === FORM_MODES.VIEW)) {
            return;
        }

        setState(prev => ({
            ...prev,
            formMode: mode,
            formType: type,
            selectedItem: validatedItem,
            isFormOpen: true
        }));
    };

    const handleCloseForm = () => {
        setState(prev => ({
            ...prev,
            isFormOpen: false,
            selectedItem: null
        }));
    };

    const handleSave = async (updatedItem) => {
        const { formType, formMode, selectedItem } = state;

        try {
            if (formType === FORM_TYPES.CATEGORY) {
                if (formMode === FORM_MODES.ADD) {
                    // Không gọi lại API, sử dụng updatedItem từ RoomCategoryForm
                    toast.success("Thêm hạng phòng thành công!");
                } else if (updatedItem === null) {
                    await roomService.deleteRoomCategory(selectedItem.id);
                    toast.success("Xóa hạng phòng thành công!");
                } else if (formMode === FORM_MODES.EDIT) {
                    // Không gọi lại API, sử dụng updatedItem từ RoomCategoryForm
                    toast.success("Cập nhật hạng phòng thành công!");
                }
            } else {
                if (formMode === FORM_MODES.ADD) {
                    // Không gọi lại API, sử dụng updatedItem từ RoomForm
                    toast.success("Thêm phòng thành công!");
                } else if (updatedItem === null) {
                    await roomService.deleteRoom(selectedItem.id);
                    toast.success("Xóa phòng thành công!");
                } else if (formMode === FORM_MODES.EDIT) {
                    // Không gọi lại API, sử dụng updatedItem từ RoomForm
                    toast.success("Cập nhật phòng thành công!");
                }
            }
            await fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu!";
            toast.error(errorMessage);
        } finally {
            handleCloseForm();
        }
    };

    const { isLoading, errorMessage, selectedTab, categories, roomCounts, isFormOpen, formMode, formType, selectedItem } = state;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{errorMessage}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                    sx={{ mt: 2 }}
                >
                    Thử lại
                </Button>
            </Box>
        );
    }

    const renderCategoryRow = (category) => (
        <TableRow
            key={category.id}
            onClick={() => handleOpenForm(FORM_MODES.VIEW, FORM_TYPES.CATEGORY, category)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell>
                <Checkbox />
            </TableCell>
            <TableCell>{category.code}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description || "Không có mô tả"}</TableCell>
            <TableCell>{roomCounts[category.id] || 0}</TableCell>
            <TableCell>
                {category.standardAdultCapacity}/{category.maxAdultCapacity}
            </TableCell>
            <TableCell>
                {category.standardChildCapacity}/{category.maxChildCapacity}
            </TableCell>
            <TableCell>
                {(category.hourlyPrice ?? 0).toLocaleString("vi-VN")}
            </TableCell>
            <TableCell>
                {(category.dailyPrice ?? 0).toLocaleString("vi-VN")}
            </TableCell>
            <TableCell>
                {(category.overnightPrice ?? 0).toLocaleString("vi-VN")}
            </TableCell>
            <TableCell>
                {(category.earlyCheckinFee ?? 0).toLocaleString("vi-VN")}
            </TableCell>
            <TableCell>
                {(category.lateCheckoutFee ?? 0).toLocaleString("vi-VN")}
            </TableCell>
            <TableCell>
                {category.status === ROOM_STATUS.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh"}
            </TableCell>
            <TableCell>
                <Button
                    variant="text"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenForm(FORM_MODES.EDIT, FORM_TYPES.CATEGORY, category);
                    }}
                >
                    Chỉnh sửa
                </Button>
            </TableCell>
        </TableRow>
    );

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
                            handleOpenForm(
                                FORM_MODES.ADD,
                                selectedTab === 0 ? FORM_TYPES.CATEGORY : FORM_TYPES.ROOM
                            )
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
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Số lượng phòng</TableCell>
                                <TableCell>Sức chứa người lớn (Tiêu chuẩn/Tối đa)</TableCell>
                                <TableCell>Sức chứa trẻ em (Tiêu chuẩn/Tối đa)</TableCell>
                                <TableCell>Giá giờ</TableCell>
                                <TableCell>Giá cả ngày</TableCell>
                                <TableCell>Giá qua đêm</TableCell>
                                <TableCell>Phí check-in sớm</TableCell>
                                <TableCell>Phí check-out muộn</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={14} align="center">
                                        Không có dữ liệu để hiển thị.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map(renderCategoryRow)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {selectedTab === 1 && <RoomList onOpenForm={handleOpenForm} onSave={handleSave} />}

            {isFormOpen && formType === FORM_TYPES.CATEGORY && (
                <RoomCategoryForm
                    initialData={selectedItem}
                    onClose={handleCloseForm}
                    onSave={handleSave}
                />
            )}
            {isFormOpen && formType === FORM_TYPES.ROOM && (
                <RoomForm
                    open={isFormOpen}
                    onClose={handleCloseForm}
                    mode={formMode}
                    type={formType}
                    initialData={selectedItem}
                    onSave={handleSave}
                    categories={categories}
                />
            )}
        </Box>
    );
};

export default RoomCategoryList;