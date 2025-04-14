import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import RoomService from "../../services/RoomServices.js";
import { toast } from "react-toastify";

const RoomForm = ({
                      open,
                      onClose,
                      mode,
                      type,
                      initialData,
                      onSave,
                      categories,
                  }) => {
    const [formData, setFormData] = useState(
        type === "category"
            ? {
                room_category_code: "",
                room_category_name: "",
                hourly_price: 0,
                daily_price: 0,
                overnight_price: 0,
                early_checkin_fee: 0,
                late_checkout_fee: 0,
                extra_fee_type: "FIXED",
                default_extra_fee: 0,
                apply_to_all_categories: false,
                standard_adult_capacity: 0,
                standard_child_capacity: 0,
                max_adult_capacity: 0,
                max_child_capacity: 0,
                status: "ACTIVE",
                img_url: "",
            }
            : {
                room_category_id: "",
                floor: 0,
                start_date: "",
                status: "AVAILABLE",
                note: "",
                is_clean: true,
                check_in_duration: 0,
                img_1: "",
            }
    );

    useEffect(() => {
        if (initialData) {
            console.log("initialData received:", initialData);
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: inputType === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        console.log("formData before submit:", formData);
        try {
            if (type === "room" && !formData.room_category_id) {
                toast.error("Vui lòng chọn hạng phòng!");
                return;
            }
            if (type === "room" && mode === "edit" && !formData.id) {
                toast.error("Không tìm thấy ID unique của phòng để cập nhật!");
                return;
            }
            if (type === "category" && mode === "edit" && !formData.id) {
                toast.error("Không tìm thấy ID unique của hạng phòng để cập nhật!");
                return;
            }

            // Kiểm tra xem room_category_id có tồn tại trong dữ liệu không
            if (type === "room") {
                const categoriesData = await RoomService.getRoomCategories();
                const exists = categoriesData.find((cat) => cat.room_category_id === formData.room_category_id);
                if (!exists) {
                    toast.error("Hạng phòng không tồn tại trong dữ liệu!");
                    return;
                }
            }

            if (mode === "add") {
                if (type === "category") {
                    const response = await RoomService.addRoomCategory({
                        ...formData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted: false,
                    });
                    toast.success("Thêm hạng phòng thành công!");
                    onSave(response.data);
                } else {
                    const response = await RoomService.addRoom({
                        ...formData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted: false,
                    });
                    toast.success("Thêm phòng thành công!");
                    onSave(response.data);
                }
            } else if (mode === "edit") {
                if (type === "category") {
                    await RoomService.updateRoomCategory(formData.id, {
                        ...formData,
                        updated_at: new Date().toISOString(),
                    });
                    toast.success("Cập nhật hạng phòng thành công!");
                    onSave(formData);
                } else {
                    await RoomService.updateRoom(formData.id, {
                        ...formData,
                        updated_at: new Date().toISOString(),
                    });
                    toast.success("Cập nhật phòng thành công!");
                    onSave(formData);
                }
            }
            onClose();
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("Không tìm thấy tài nguyên. Vui lòng kiểm tra json-server và dữ liệu!");
            } else {
                toast.error("Có lỗi xảy ra khi lưu!");
            }
            console.error("Error during submit:", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (type === "category") {
                await RoomService.deleteRoomCategory(formData.id);
                toast.success("Xóa hạng phòng thành công!");
            } else {
                await RoomService.deleteRoom(formData.id);
                toast.success("Xóa phòng thành công!");
            }
            onSave(null);
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa!");
            console.error(error);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = formData.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            if (type === "category") {
                await RoomService.updateRoomCategory(formData.id, {
                    ...formData,
                    status: newStatus,
                    updated_at: new Date().toISOString(),
                });
                toast.success(`Đã ${newStatus === "ACTIVE" ? "kích hoạt" : "ngừng"} kinh doanh!`);
            } else {
                await RoomService.updateRoom(formData.id, {
                    ...formData,
                    status: newStatus === "ACTIVE" ? "AVAILABLE" : "MAINTENANCE",
                    updated_at: new Date().toISOString(),
                });
                toast.success(`Đã cập nhật trạng thái phòng!`);
            }
            onSave({ ...formData, status: newStatus });
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {mode === "add"
                    ? `Thêm mới ${type === "category" ? "hạng phòng" : "phòng"}`
                    : mode === "edit"
                        ? `Cập nhật ${type === "category" ? "hạng phòng" : "phòng"}`
                        : `Chi tiết ${type === "category" ? "hạng phòng" : "phòng"}`}
            </DialogTitle>
            <DialogContent>
                {type === "category" ? (
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <TextField
                                    label="Mã hạng phòng"
                                    name="room_category_code"
                                    value={formData.room_category_code}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Tên hạng phòng"
                                    name="room_category_name"
                                    value={formData.room_category_name}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="Mô tả"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField
                                    label="Giá giờ"
                                    name="hourly_price"
                                    type="number"
                                    value={formData.hourly_price}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField
                                    label="Giá cả ngày"
                                    name="daily_price"
                                    type="number"
                                    value={formData.daily_price}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <TextField
                                    label="Giá qua đêm"
                                    name="overnight_price"
                                    type="number"
                                    value={formData.overnight_price}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Phí nhận phòng sớm"
                                    name="early_checkin_fee"
                                    type="number"
                                    value={formData.early_checkin_fee}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Phí trả phòng trễ"
                                    name="late_checkout_fee"
                                    type="number"
                                    value={formData.late_checkout_fee}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Hình thức phí phụ thu</InputLabel>
                                    <Select
                                        name="extra_fee_type"
                                        value={formData.extra_fee_type}
                                        onChange={handleChange}
                                        disabled={mode === "view"}
                                    >
                                        <MenuItem value="FIXED">Tiền mặt</MenuItem>
                                        <MenuItem value="PERCENTAGE">Nhân số</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Mức phí"
                                    name="default_extra_fee"
                                    type="number"
                                    value={formData.default_extra_fee}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="apply_to_all_categories"
                                            checked={formData.apply_to_all_categories}
                                            onChange={handleChange}
                                            disabled={mode === "view"}
                                        />
                                    }
                                    label="Áp dụng cho tất cả các hạng phòng"
                                />
                            </Grid>
                            <Grid xs={3}>
                                <TextField
                                    label="Sức chứa tối đa (người lớn)"
                                    name="standard_adult_capacity"
                                    type="number"
                                    value={formData.standard_adult_capacity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={3}>
                                <TextField
                                    label="Sức chứa tối đa (trẻ em)"
                                    name="standard_child_capacity"
                                    type="number"
                                    value={formData.standard_child_capacity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={3}>
                                <TextField
                                    label="Tối đa người lớn"
                                    name="max_adult_capacity"
                                    type="number"
                                    value={formData.max_adult_capacity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={3}>
                                <TextField
                                    label="Tối đa trẻ em"
                                    name="max_child_capacity"
                                    type="number"
                                    value={formData.max_child_capacity}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="URL hình ảnh"
                                    name="img_url"
                                    value={formData.img_url}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            {formData.img_url && (
                                <Grid xs={12}>
                                    <Typography variant="subtitle1">Hình ảnh</Typography>
                                    <img
                                        src={formData.img_url}
                                        alt="Room Category"
                                        style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 8 }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Hạng phòng</InputLabel>
                                    <Select
                                        name="room_category_id"
                                        value={formData.room_category_id}
                                        onChange={handleChange}
                                        disabled={mode === "view"}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.room_category_id}>
                                                {cat.room_category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Tầng"
                                    name="floor"
                                    type="number"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Ngày bắt đầu sử dụng"
                                    name="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={mode === "view"}
                                    >
                                        <MenuItem value="AVAILABLE">Có sẵn</MenuItem>
                                        <MenuItem value="OCCUPIED">Đang sử dụng</MenuItem>
                                        <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    label="Ghi chú"
                                    name="note"
                                    value={formData.note || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_clean"
                                            checked={formData.is_clean}
                                            onChange={handleChange}
                                            disabled={mode === "view"}
                                        />
                                    }
                                    label="Phòng sạch"
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="Thời gian check-in (ngày)"
                                    name="check_in_duration"
                                    type="number"
                                    value={formData.check_in_duration}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    label="URL hình ảnh"
                                    name="img_1"
                                    value={formData.img_1 || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    disabled={mode === "view"}
                                />
                            </Grid>
                            {formData.img_1 && (
                                <Grid xs={12}>
                                    <Typography variant="subtitle1">Hình ảnh</Typography>
                                    <img
                                        src={formData.img_1}
                                        alt="Room"
                                        style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 8 }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {mode === "view" ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onSave({ ...formData, mode: "edit" })}
                        >
                            Cập nhật
                        </Button>
                        <Button
                            variant="contained"
                            color={formData.status === "ACTIVE" ? "error" : "success"}
                            onClick={handleToggleStatus}
                        >
                            {formData.status === "ACTIVE" ? "Ngừng kinh doanh" : "Kinh doanh"}
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Xóa
                        </Button>
                        <Button variant="outlined" onClick={onClose}>
                            Bỏ qua
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {mode === "edit" ? "Cập nhật" : "Lưu"}
                        </Button>
                        {mode === "add" && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={async () => {
                                    await handleSubmit();
                                    setFormData(
                                        type === "category"
                                            ? {
                                                room_category_code: "",
                                                room_category_name: "",
                                                hourly_price: 0,
                                                daily_price: 0,
                                                overnight_price: 0,
                                                early_checkin_fee: 0,
                                                late_checkout_fee: 0,
                                                extra_fee_type: "FIXED",
                                                default_extra_fee: 0,
                                                apply_to_all_categories: false,
                                                standard_adult_capacity: 0,
                                                standard_child_capacity: 0,
                                                max_adult_capacity: 0,
                                                max_child_capacity: 0,
                                                status: "ACTIVE",
                                                img_url: "",
                                            }
                                            : {
                                                room_category_id: "",
                                                floor: 0,
                                                start_date: "",
                                                status: "AVAILABLE",
                                                note: "",
                                                is_clean: true,
                                                check_in_duration: 0,
                                                img_1: "",
                                            }
                                    );
                                }}
                            >
                                Lưu & Thêm mới
                            </Button>
                        )}
                        <Button variant="outlined" onClick={onClose}>
                            Bỏ qua
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RoomForm;

