import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import RoomService from "../../services/RoomServices.js";
import { toast } from "react-toastify";

const RoomCategoryForm = () => {
    const navigate = useNavigate();

    const initialValues = {
        room_category_code: "",
        room_category_name: "",
        hourly_price: 0,
        daily_price: 0,
        overnight_price: 0,
        standard_adult_capacity: 1,
        standard_child_capacity: 0,
        max_adult_capacity: 2,
        max_child_capacity: 1,
        status: "ACTIVE",
    };

    const validate = (values) => {
        const errors = {};
        if (!values.room_category_code) {
            errors.room_category_code = "Mã hạng phòng là bắt buộc";
        }
        if (!values.room_category_name) {
            errors.room_category_name = "Tên hạng phòng là bắt buộc";
        }
        if (values.hourly_price === undefined || values.hourly_price < 0) {
            errors.hourly_price = "Giá giờ là bắt buộc và phải lớn hơn hoặc bằng 0";
        }
        if (values.daily_price === undefined || values.daily_price < 0) {
            errors.daily_price = "Giá cả ngày là bắt buộc và phải lớn hơn hoặc bằng 0";
        }
        if (values.overnight_price === undefined || values.overnight_price < 0) {
            errors.overnight_price = "Giá qua đêm là bắt buộc và phải lớn hơn hoặc bằng 0";
        }
        if (values.standard_adult_capacity === undefined || values.standard_adult_capacity < 1) {
            errors.standard_adult_capacity = "Số người lớn tiêu chuẩn phải lớn hơn 0";
        }
        if (values.standard_child_capacity === undefined || values.standard_child_capacity < 0) {
            errors.standard_child_capacity = "Số trẻ em tiêu chuẩn phải lớn hơn hoặc bằng 0";
        }
        if (values.max_adult_capacity === undefined || values.max_adult_capacity < 1) {
            errors.max_adult_capacity = "Số người lớn tối đa phải lớn hơn 0";
        }
        if (values.max_child_capacity === undefined || values.max_child_capacity < 0) {
            errors.max_child_capacity = "Số trẻ em tối đa phải lớn hơn hoặc bằng 0";
        }
        if (!values.status) {
            errors.status = "Trạng thái là bắt buộc";
        }
        return errors;
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await RoomService.addRoomCategory({
                ...values,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted: false,
            });
            toast.success("Thêm hạng phòng thành công!");
            navigate("/admin/rooms"); // Điều hướng về /admin/rooms
        } catch (error) {
            toast.error("Lỗi khi thêm hạng phòng!");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Thêm hạng phòng
            </Typography>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Mã hạng phòng"
                                    name="room_category_code"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.room_category_code &&
                                        Formik.errors?.room_category_code
                                    )}
                                    helperText={<ErrorMessage name="room_category_code" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Tên hạng phòng"
                                    name="room_category_name"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.room_category_name &&
                                        Formik.errors?.room_category_name
                                    )}
                                    helperText={<ErrorMessage name="room_category_name" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá giờ"
                                    type="number"
                                    name="hourly_price"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.hourly_price && Formik.errors?.hourly_price
                                    )}
                                    helperText={<ErrorMessage name="hourly_price" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá cả ngày"
                                    type="number"
                                    name="daily_price"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.daily_price && Formik.errors?.daily_price
                                    )}
                                    helperText={<ErrorMessage name="daily_price" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá qua đêm"
                                    type="number"
                                    name="overnight_price"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.overnight_price &&
                                        Formik.errors?.overnight_price
                                    )}
                                    helperText={<ErrorMessage name="overnight_price" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số người lớn tiêu chuẩn"
                                    type="number"
                                    name="standard_adult_capacity"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.standard_adult_capacity &&
                                        Formik.errors?.standard_adult_capacity
                                    )}
                                    helperText={<ErrorMessage name="standard_adult_capacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số trẻ em tiêu chuẩn"
                                    type="number"
                                    name="standard_child_capacity"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.standard_child_capacity &&
                                        Formik.errors?.standard_child_capacity
                                    )}
                                    helperText={<ErrorMessage name="standard_child_capacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số người lớn tối đa"
                                    type="number"
                                    name="max_adult_capacity"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.max_adult_capacity &&
                                        Formik.errors?.max_adult_capacity
                                    )}
                                    helperText={<ErrorMessage name="max_adult_capacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số trẻ em tối đa"
                                    type="number"
                                    name="max_child_capacity"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.max_child_capacity &&
                                        Formik.errors?.max_child_capacity
                                    )}
                                    helperText={<ErrorMessage name="max_child_capacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    select
                                    label="Trạng thái"
                                    name="status"
                                    fullWidth
                                    error={Boolean(
                                        Formik.touched?.status && Formik.errors?.status
                                    )}
                                    helperText={<ErrorMessage name="status" />}
                                >
                                    <MenuItem value="ACTIVE">Đang kinh doanh</MenuItem>
                                    <MenuItem value="INACTIVE">Ngừng kinh doanh</MenuItem>
                                </Field>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Thêm
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={() => navigate("/admin/rooms")} // Điều hướng về /admin/rooms
                            >
                                Hủy
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default RoomCategoryForm;