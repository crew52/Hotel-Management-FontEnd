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
    CircularProgress,
    Typography,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Menu,
    MenuItem as MuiMenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
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
    selectedItem: null,
    filters: {
        keyword: '',
        status: '',
        minHourlyPrice: '',
        maxHourlyPrice: '',
        minDailyPrice: '',
        maxDailyPrice: '',
        minOvernightPrice: '',
        maxOvernightPrice: '',
    },
    visibleColumns: {
        code: true,
        name: true,
        description: true,
        roomCount: true,
        adultCapacity: true,
        childCapacity: true,
        hourlyPrice: true,
        dailyPrice: true,
        overnightPrice: true,
        earlyCheckinFee: true,
        lateCheckoutFee: true,
        status: true,
        actions: true,
    },
    anchorEl: null,
};

const RoomCategoryList = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));
            const { keyword, status, minHourlyPrice, maxHourlyPrice, minDailyPrice, maxDailyPrice, minOvernightPrice, maxOvernightPrice } = state.filters;

            const params = {
                keyword: keyword || undefined,
                status: status || undefined,
                minHourlyPrice: minHourlyPrice ? parseFloat(minHourlyPrice) : undefined,
                maxHourlyPrice: maxHourlyPrice ? parseFloat(maxHourlyPrice) : undefined,
                minDailyPrice: minDailyPrice ? parseFloat(minDailyPrice) : undefined,
                maxDailyPrice: maxDailyPrice ? parseFloat(maxDailyPrice) : undefined,
                minOvernightPrice: minOvernightPrice ? parseFloat(minOvernightPrice) : undefined,
                maxOvernightPrice: maxOvernightPrice ? parseFloat(maxOvernightPrice) : undefined,
                page: 0,
                size: 100
            };

            console.log("Fetching room categories with params:", params);
            const response = await roomService.searchRoomCategories(params);
            console.log("Room categories response:", response);
            
            // Xử lý nhiều dạng response khác nhau cho danh mục phòng
            let categoriesArray = [];
            if (response && response.content) {
                categoriesArray = response.content;
            } else if (Array.isArray(response)) {
                categoriesArray = response;
            } else if (response && typeof response === 'object' && !Array.isArray(response)) {
                categoriesArray = [response];
            }

            console.log("Processed categories:", categoriesArray);
            
            // Lấy danh sách phòng để đếm số lượng
            console.log("Fetching rooms for counting");
            const roomsResponse = await roomService.getAll(0, 100);
            console.log("Rooms response:", roomsResponse);
            
            // Xử lý nhiều dạng response khác nhau cho phòng
            let rooms = [];
            if (roomsResponse && roomsResponse.content) {
                rooms = roomsResponse.content;
            } else if (Array.isArray(roomsResponse)) {
                rooms = roomsResponse;
            } else if (roomsResponse && typeof roomsResponse === 'object' && !Array.isArray(roomsResponse)) {
                rooms = [roomsResponse];
            }
            
            console.log("Processed rooms:", rooms);

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
    }, [state.filters]);

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
                    toast.success("Thêm hạng phòng thành công!");
                } else if (updatedItem === null) {
                    await roomService.deleteRoomCategory(selectedItem.id);
                    toast.success("Xóa hạng phòng thành công!");
                } else if (formMode === FORM_MODES.EDIT) {
                    toast.success("Cập nhật hạng phòng thành công!");
                }
            } else {
                if (formMode === FORM_MODES.ADD) {
                    toast.success("Thêm phòng thành công!");
                } else if (updatedItem === null) {
                    await roomService.deleteRoom(selectedItem.id);
                    toast.success("Xóa phòng thành công!");
                } else if (formMode === FORM_MODES.EDIT) {
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

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa hạng phòng này?")) return;
        try {
            await roomService.deleteRoomCategory(id);
            toast.success("Xóa hạng phòng thành công!");
            await fetchData();
        } catch (error) {
            console.error('Error deleting room category:', error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xóa hạng phòng!";
            toast.error(errorMessage);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, [name]: value }
        }));
    };

    const resetFilters = () => {
        setState(prev => ({
            ...prev,
            filters: {
                keyword: '',
                status: '',
                minHourlyPrice: '',
                maxHourlyPrice: '',
                minDailyPrice: '',
                maxDailyPrice: '',
                minOvernightPrice: '',
                maxOvernightPrice: '',
            }
        }));
    };

    const handleColumnVisibilityChange = (event) => {
        const { name, checked } = event.target;
        setState(prev => ({
            ...prev,
            visibleColumns: {
                ...prev.visibleColumns,
                [name]: checked
            }
        }));
    };

    const handleOpenColumnMenu = (event) => {
        setState(prev => ({ ...prev, anchorEl: event.currentTarget }));
    };

    const handleCloseColumnMenu = () => {
        setState(prev => ({ ...prev, anchorEl: null }));
    };

    const { isLoading, errorMessage, selectedTab, categories, roomCounts, isFormOpen, formMode, formType, selectedItem, filters, visibleColumns, anchorEl } = state;
    const open = Boolean(anchorEl);

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
                <Button variant="contained" color="primary" onClick={fetchData} sx={{ mt: 2 }}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    const renderCategoryRow = (category) => (
        <TableRow
            key={category.id}
            onClick={() => handleOpenForm(FORM_MODES.VIEW, FORM_TYPES.CATEGORY, category)}
            sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" }
            }}
        >
            {visibleColumns.code && (
                <TableCell sx={{ width: "100px" }}>{category.code}</TableCell>
            )}
            {visibleColumns.name && (
                <TableCell sx={{ width: "150px" }}>{category.name}</TableCell>
            )}
            {visibleColumns.description && (
                <TableCell sx={{ width: "200px" }}>{category.description || "Không có mô tả"}</TableCell>
            )}
            {visibleColumns.roomCount && (
                <TableCell sx={{ width: "80px", textAlign: "center" }}>{roomCounts[category.id] || 0}</TableCell>
            )}
            {visibleColumns.adultCapacity && (
                <TableCell sx={{ width: "120px", textAlign: "center" }}>
                    {category.standardAdultCapacity}/{category.maxAdultCapacity}
                </TableCell>
            )}
            {visibleColumns.childCapacity && (
                <TableCell sx={{ width: "120px", textAlign: "center" }}>
                    {category.standardChildCapacity}/{category.maxChildCapacity}
                </TableCell>
            )}
            {visibleColumns.hourlyPrice && (
                <TableCell sx={{ width: "100px", textAlign: "right" }}>
                    {(category.hourlyPrice ?? 0).toLocaleString("vi-VN")}
                </TableCell>
            )}
            {visibleColumns.dailyPrice && (
                <TableCell sx={{ width: "100px", textAlign: "right" }}>
                    {(category.dailyPrice ?? 0).toLocaleString("vi-VN")}
                </TableCell>
            )}
            {visibleColumns.overnightPrice && (
                <TableCell sx={{ width: "100px", textAlign: "right" }}>
                    {(category.overnightPrice ?? 0).toLocaleString("vi-VN")}
                </TableCell>
            )}
            {visibleColumns.earlyCheckinFee && (
                <TableCell sx={{ width: "100px", textAlign: "right" }}>
                    {(category.earlyCheckinFee ?? 0).toLocaleString("vi-VN")}
                </TableCell>
            )}
            {visibleColumns.lateCheckoutFee && (
                <TableCell sx={{ width: "100px", textAlign: "right" }}>
                    {(category.lateCheckoutFee ?? 0).toLocaleString("vi-VN")}
                </TableCell>
            )}
            {visibleColumns.status && (
                <TableCell sx={{ width: "100px" }}>
                    {category.status === ROOM_STATUS.ACTIVE ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                </TableCell>
            )}
            {visibleColumns.actions && (
                <TableCell sx={{ width: "180px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenForm(FORM_MODES.EDIT, FORM_TYPES.CATEGORY, category);
                        }}
                        sx={{ mr: 1, width: "80px" }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(category.id);
                        }}
                        sx={{ width: "80px" }}
                    >
                        Xóa
                    </Button>
                </TableCell>
            )}
        </TableRow>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Hạng phòng" />
                    <Tab label="Danh sách phòng" />
                </Tabs>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        onClick={handleOpenColumnMenu}
                        color="primary"
                        title="Chọn cột hiển thị"
                    >
                        <ViewColumnIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseColumnMenu}
                        PaperProps={{
                            style: {
                                maxHeight: 400,
                                width: '250px',
                            },
                        }}
                    >
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.code}
                                        onChange={handleColumnVisibilityChange}
                                        name="code"
                                        size="small"
                                    />
                                }
                                label="Mã hạng phòng"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.name}
                                        onChange={handleColumnVisibilityChange}
                                        name="name"
                                        size="small"
                                    />
                                }
                                label="Tên hạng phòng"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.description}
                                        onChange={handleColumnVisibilityChange}
                                        name="description"
                                        size="small"
                                    />
                                }
                                label="Mô tả"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.roomCount}
                                        onChange={handleColumnVisibilityChange}
                                        name="roomCount"
                                        size="small"
                                    />
                                }
                                label="Số lượng phòng"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.adultCapacity}
                                        onChange={handleColumnVisibilityChange}
                                        name="adultCapacity"
                                        size="small"
                                    />
                                }
                                label="Sức chứa người lớn"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.childCapacity}
                                        onChange={handleColumnVisibilityChange}
                                        name="childCapacity"
                                        size="small"
                                    />
                                }
                                label="Sức chứa trẻ em"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.hourlyPrice}
                                        onChange={handleColumnVisibilityChange}
                                        name="hourlyPrice"
                                        size="small"
                                    />
                                }
                                label="Giá giờ"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.dailyPrice}
                                        onChange={handleColumnVisibilityChange}
                                        name="dailyPrice"
                                        size="small"
                                    />
                                }
                                label="Giá cả ngày"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.overnightPrice}
                                        onChange={handleColumnVisibilityChange}
                                        name="overnightPrice"
                                        size="small"
                                    />
                                }
                                label="Giá qua đêm"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.earlyCheckinFee}
                                        onChange={handleColumnVisibilityChange}
                                        name="earlyCheckinFee"
                                        size="small"
                                    />
                                }
                                label="Phí check-in sớm"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.lateCheckoutFee}
                                        onChange={handleColumnVisibilityChange}
                                        name="lateCheckoutFee"
                                        size="small"
                                    />
                                }
                                label="Phí check-out muộn"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.status}
                                        onChange={handleColumnVisibilityChange}
                                        name="status"
                                        size="small"
                                    />
                                }
                                label="Trạng thái"
                            />
                        </MuiMenuItem>
                        <MuiMenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleColumns.actions}
                                        onChange={handleColumnVisibilityChange}
                                        name="actions"
                                        size="small"
                                    />
                                }
                                label="Hành động"
                            />
                        </MuiMenuItem>
                    </Menu>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenForm(FORM_MODES.ADD, selectedTab === 0 ? FORM_TYPES.CATEGORY : FORM_TYPES.ROOM)}
                    >
                        Thêm mới
                    </Button>
                </Box>
            </Box>

            {selectedTab === 0 && (
                <>
                    <Box sx={{ mb: 2, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Tìm kiếm (Mã, Tên, Mô tả)"
                                    name="keyword"
                                    value={filters.keyword}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    select
                                    label="Trạng thái"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="ACTIVE">Đang kinh doanh</MenuItem>
                                    <MenuItem value="INACTIVE">Ngừng kinh doanh</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá giờ (Tối thiểu)"
                                    name="minHourlyPrice"
                                    type="number"
                                    value={filters.minHourlyPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá giờ (Tối đa)"
                                    name="maxHourlyPrice"
                                    type="number"
                                    value={filters.maxHourlyPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá ngày (Tối thiểu)"
                                    name="minDailyPrice"
                                    type="number"
                                    value={filters.minDailyPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá ngày (Tối đa)"
                                    name="maxDailyPrice"
                                    type="number"
                                    value={filters.maxDailyPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá qua đêm (Tối thiểu)"
                                    name="minOvernightPrice"
                                    type="number"
                                    value={filters.minOvernightPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Giá qua đêm (Tối đa)"
                                    name="maxOvernightPrice"
                                    type="number"
                                    value={filters.maxOvernightPrice}
                                    onChange={handleFilterChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={resetFilters}
                                    fullWidth
                                    size="small"
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {visibleColumns.code && (
                                        <TableCell sx={{ fontWeight: "bold" }}>Mã hạng phòng</TableCell>
                                    )}
                                    {visibleColumns.name && (
                                        <TableCell sx={{ fontWeight: "bold" }}>Tên hạng phòng</TableCell>
                                    )}
                                    {visibleColumns.description && (
                                        <TableCell sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
                                    )}
                                    {visibleColumns.roomCount && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Số lượng phòng</TableCell>
                                    )}
                                    {visibleColumns.adultCapacity && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Sức chứa người lớn</TableCell>
                                    )}
                                    {visibleColumns.childCapacity && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Sức chứa trẻ em</TableCell>
                                    )}
                                    {visibleColumns.hourlyPrice && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Giá giờ</TableCell>
                                    )}
                                    {visibleColumns.dailyPrice && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Giá cả ngày</TableCell>
                                    )}
                                    {visibleColumns.overnightPrice && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Giá qua đêm</TableCell>
                                    )}
                                    {visibleColumns.earlyCheckinFee && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Phí check-in sớm</TableCell>
                                    )}
                                    {visibleColumns.lateCheckoutFee && (
                                        <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Phí check-out muộn</TableCell>
                                    )}
                                    {visibleColumns.status && (
                                        <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                                    )}
                                    {visibleColumns.actions && (
                                        <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} align="center">
                                            Không có dữ liệu để hiển thị.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map(renderCategoryRow)
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
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