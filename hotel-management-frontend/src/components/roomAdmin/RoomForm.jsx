"use client";

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
    FormControlLabel,
    Switch,
    Button,
    Box,
    Typography,
    Grid,
    Paper
} from "@mui/material";
import roomService from "../../services/roomService.js";
import { toast } from "react-toastify";

const RoomForm = ({ open, onClose, mode, initialData, onSave, categories }) => {
    const [formData, setFormData] = useState({
        roomCategoryId: "",
        floor: 0,
        startDate: "",  // Changed to string format
        status: "AVAILABLE",
        note: "",
        isClean: true,
        checkInDuration: 0,
        img1: "",
        img2: "",
        img3: "",
        img4: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                roomCategoryId: initialData.roomCategory?.id || "",
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "", // Format date as YYYY-MM-DD
                isClean: initialData.isClean ?? true,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "isClean" ? checked : value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!formData.roomCategoryId) {
                throw new Error("Vui lòng chọn hạng phòng");
            }

            // Chuyển đổi dữ liệu để khớp với backend
            const payload = {
                id: initialData?.id,
                roomCategory: { id: parseInt(formData.roomCategoryId) },
                floor: parseInt(formData.floor),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                status: formData.status,
                note: formData.note || "",
                isClean: formData.isClean,
                checkInDuration: parseInt(formData.checkInDuration) || 0,
                img1: formData.img1 || "",
                img2: formData.img2 || "",
                img3: formData.img3 || "",
                img4: formData.img4 || "",
                deleted: false
            };

            let response;
            if (mode === "edit" && initialData?.id) {
                response = await roomService.update(initialData.id, payload);
                toast.success("Cập nhật phòng thành công!");
            } else {
                response = await roomService.create(payload);
                toast.success("Thêm phòng thành công!");
            }

            onSave(response);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.defaultMessage ||
                error.message ||
                "Có lỗi xảy ra khi lưu phòng";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {mode === "add" ? "Thêm phòng mới" : mode === "edit" ? "Cập nhật phòng" : "Chi tiết phòng"}
            </DialogTitle>
            <DialogContent>
                <Box component={Paper} sx={{ p: 2, mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Hạng phòng</InputLabel>
                                <Select
                                    name="roomCategoryId"
                                    value={formData.roomCategoryId}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tầng"
                                name="floor"
                                type="number"
                                value={formData.floor}
                                onChange={handleChange}
                                disabled={mode === "view"}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày bắt đầu sử dụng"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                disabled={mode === "view"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú"
                                name="note"
                                multiline
                                rows={3}
                                value={formData.note}
                                onChange={handleChange}
                                disabled={mode === "view"}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isClean}
                                        onChange={handleChange}
                                        name="isClean"
                                        disabled={mode === "view"}
                                    />
                                }
                                label="Phòng sạch"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Thời gian check-in (ngày)"
                                name="checkInDuration"
                                type="number"
                                value={formData.checkInDuration}
                                onChange={handleChange}
                                disabled={mode === "view"}
                            />
                        </Grid>

                        {["img1", "img2", "img3", "img4"].map((imgField, index) => (
                            <Grid item xs={12} sm={6} key={imgField}>
                                <TextField
                                    fullWidth
                                    label={`URL hình ảnh ${index + 1}`}
                                    name={imgField}
                                    value={formData[imgField]}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                {formData[imgField] && (
                                    <Box sx={{ mt: 1 }}>
                                        <img
                                            src={formData[imgField]}
                                            alt={`Room ${index + 1}`}
                                            style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        ))}
                    </Grid>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                {mode !== "view" && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : mode === "edit" ? "Cập nhật" : "Thêm mới"}
                    </Button>
                )}
                <Button onClick={onClose}>
                    {mode === "view" ? "Đóng" : "Hủy"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoomForm;