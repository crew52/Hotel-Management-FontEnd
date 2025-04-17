"use client";

import React from "react";
import { Box, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import RoomService from "../../services/RoomService.js"; // Sửa tên import nếu cần
import { toast } from "react-toastify";

const RoomCategoryForm = ({ initialData, onClose, onSave }) => {
    const isEditMode = !!initialData;

    const initialValues = initialData || {
        code: "",
        name: "",
        description: "",
        hourlyPrice: 0,
        dailyPrice: 0,
        overnightPrice: 0,
        earlyCheckinFee: 0,
        lateCheckoutFee: 0,
        extraFeeType: "FIXED",
        defaultExtraFee: 0,
        applyToAllCategories: false,
        standardAdultCapacity: 1,
        standardChildCapacity: 0,
        maxAdultCapacity: 2,
        maxChildCapacity: 1,
        status: "ACTIVE",
        imgUrl: "",
    };

    const validate = (values) => {
        const errors = {};
        if (!values.code) {
            errors.code = "Mã hạng phòng là bắt buộc";
        } else if (values.code.length > 20) {
            errors.code = "Mã hạng phòng tối đa 20 ký tự";
        }
        if (!values.name) {
            errors.name = "Tên hạng phòng là bắt buộc";
        } else if (values.name.length > 100) {
            errors.name = "Tên hạng phòng tối đa 100 ký tự";
        }
        if (values.description && values.description.length > 1000) {
            errors.description = "Mô tả tối đa 1000 ký tự";
        }
        if (values.hourlyPrice === undefined || values.hourlyPrice < 0) {
            errors.hourlyPrice = "Giá giờ phải lớn hơn hoặc bằng 0";
        }
        if (values.dailyPrice === undefined || values.dailyPrice < 0) {
            errors.dailyPrice = "Giá cả ngày phải lớn hơn hoặc bằng 0";
        }
        if (values.overnightPrice === undefined || values.overnightPrice < 0) {
            errors.overnightPrice = "Giá qua đêm phải lớn hơn hoặc bằng 0";
        }
        if (values.earlyCheckinFee === undefined || values.earlyCheckinFee < 0) {
            errors.earlyCheckinFee = "Phí nhận phòng sớm phải lớn hơn hoặc bằng 0";
        }
        if (values.lateCheckoutFee === undefined || values.lateCheckoutFee < 0) {
            errors.lateCheckoutFee = "Phí trả phòng trễ phải lớn hơn hoặc bằng 0";
        }
        if (values.defaultExtraFee === undefined || values.defaultExtraFee < 0) {
            errors.defaultExtraFee = "Mức phí phụ thu phải lớn hơn hoặc bằng 0";
        }
        if (values.standardAdultCapacity === undefined || values.standardAdultCapacity < 0) {
            errors.standardAdultCapacity = "Số người lớn tiêu chuẩn phải lớn hơn hoặc bằng 0";
        }
        if (values.standardChildCapacity === undefined || values.standardChildCapacity < 0) {
            errors.standardChildCapacity = "Số trẻ em tiêu chuẩn phải lớn hơn hoặc bằng 0";
        }
        if (values.maxAdultCapacity === undefined || values.maxAdultCapacity < 0) {
            errors.maxAdultCapacity = "Số người lớn tối đa phải lớn hơn hoặc bằng 0";
        }
        if (values.maxChildCapacity === undefined || values.maxChildCapacity < 0) {
            errors.maxChildCapacity = "Số trẻ em tối đa phải lớn hơn hoặc bằng 0";
        }
        if (!values.status) {
            errors.status = "Trạng thái là bắt buộc";
        }
        if (values.imgUrl && values.imgUrl.length > 255) {
            errors.imgUrl = "URL hình ảnh tối đa 255 ký tự";
        }
        return errors;
    };

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                ...values,
                hourlyPrice: values.hourlyPrice !== undefined ? parseFloat(values.hourlyPrice).toFixed(2) : null,
                dailyPrice: values.dailyPrice !== undefined ? parseFloat(values.dailyPrice).toFixed(2) : null,
                overnightPrice: values.overnightPrice !== undefined ? parseFloat(values.overnightPrice).toFixed(2) : null,
                earlyCheckinFee: values.earlyCheckinFee !== undefined ? parseFloat(values.earlyCheckinFee).toFixed(2) : null,
                lateCheckoutFee: values.lateCheckoutFee !== undefined ? parseFloat(values.lateCheckoutFee).toFixed(2) : null,
                defaultExtraFee: values.defaultExtraFee !== undefined ? parseFloat(values.defaultExtraFee).toFixed(2) : "0.00",
            };
            console.log("Payload before submit:", payload);

            let response;
            if (isEditMode && initialData?.id) {
                response = await RoomService.updateRoomCategory(initialData.id, payload);
            } else {
                response = await RoomService.addRoomCategory(payload);
            }
            onSave(response.data); // Gọi onSave để cập nhật danh sách
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.defaultMessage ||
                "Lỗi khi thêm/cập nhật hạng phòng!";
            toast.error(errorMessage);
            console.error("Error during submit:", error.response?.data);
        } finally {
            setSubmitting(false);
            onClose(); // Đóng form sau khi submit
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                {isEditMode ? "Cập nhật hạng phòng" : "Thêm hạng phòng"}
            </Typography>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Mã hạng phòng"
                                    name="code"
                                    fullWidth
                                    error={Boolean(Formik.touched?.code && Formik.errors?.code)}
                                    helperText={<ErrorMessage name="code" />}
                                    disabled={isEditMode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Tên hạng phòng"
                                    name="name"
                                    fullWidth
                                    error={Boolean(Formik.touched?.name && Formik.errors?.name)}
                                    helperText={<ErrorMessage name="name" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Mô tả"
                                    name="description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={Boolean(Formik.touched?.description && Formik.errors?.description)}
                                    helperText={<ErrorMessage name="description" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá giờ"
                                    type="number"
                                    name="hourlyPrice"
                                    fullWidth
                                    error={Boolean(Formik.touched?.hourlyPrice && Formik.errors?.hourlyPrice)}
                                    helperText={<ErrorMessage name="hourlyPrice" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá cả ngày"
                                    type="number"
                                    name="dailyPrice"
                                    fullWidth
                                    error={Boolean(Formik.touched?.dailyPrice && Formik.errors?.dailyPrice)}
                                    helperText={<ErrorMessage name="dailyPrice" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field
                                    as={TextField}
                                    label="Giá qua đêm"
                                    type="number"
                                    name="overnightPrice"
                                    fullWidth
                                    error={Boolean(Formik.touched?.overnightPrice && Formik.errors?.overnightPrice)}
                                    helperText={<ErrorMessage name="overnightPrice" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Phí nhận phòng sớm"
                                    type="number"
                                    name="earlyCheckinFee"
                                    fullWidth
                                    error={Boolean(Formik.touched?.earlyCheckinFee && Formik.errors?.earlyCheckinFee)}
                                    helperText={<ErrorMessage name="earlyCheckinFee" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Phí trả phòng trễ"
                                    type="number"
                                    name="lateCheckoutFee"
                                    fullWidth
                                    error={Boolean(Formik.touched?.lateCheckoutFee && Formik.errors?.lateCheckoutFee)}
                                    helperText={<ErrorMessage name="lateCheckoutFee" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    select
                                    label="Hình thức phí phụ thu"
                                    name="extraFeeType"
                                    fullWidth
                                    error={Boolean(Formik.touched?.extraFeeType && Formik.errors?.extraFeeType)}
                                    helperText={<ErrorMessage name="extraFeeType" />}
                                >
                                    <MenuItem value="FIXED">Tiền mặt</MenuItem>
                                    <MenuItem value="PERCENTAGE">Nhân số</MenuItem>
                                </Field>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    label="Mức phí phụ thu"
                                    type="number"
                                    name="defaultExtraFee"
                                    fullWidth
                                    error={Boolean(Formik.touched?.defaultExtraFee && Formik.errors?.defaultExtraFee)}
                                    helperText={<ErrorMessage name="defaultExtraFee" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    select
                                    label="Áp dụng cho tất cả hạng phòng"
                                    name="applyToAllCategories"
                                    fullWidth
                                    error={Boolean(Formik.touched?.applyToAllCategories && Formik.errors?.applyToAllCategories)}
                                    helperText={<ErrorMessage name="applyToAllCategories" />}
                                >
                                    <MenuItem value={true}>Có</MenuItem>
                                    <MenuItem value={false}>Không</MenuItem>
                                </Field>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    select
                                    label="Trạng thái"
                                    name="status"
                                    fullWidth
                                    error={Boolean(Formik.touched?.status && Formik.errors?.status)}
                                    helperText={<ErrorMessage name="status" />}
                                >
                                    <MenuItem value="ACTIVE">Đang kinh doanh</MenuItem>
                                    <MenuItem value="INACTIVE">Ngừng kinh doanh</MenuItem>
                                </Field>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="URL hình ảnh"
                                    name="imgUrl"
                                    fullWidth
                                    error={Boolean(Formik.touched?.imgUrl && Formik.errors?.imgUrl)}
                                    helperText={<ErrorMessage name="imgUrl" />}
                                />
                            </Grid>
                            {values.imgUrl && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Hình ảnh</Typography>
                                    <img
                                        src={values.imgUrl}
                                        alt="Room Category"
                                        style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 8 }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số người lớn tiêu chuẩn"
                                    type="number"
                                    name="standardAdultCapacity"
                                    fullWidth
                                    error={Boolean(Formik.touched?.standardAdultCapacity && Formik.errors?.standardAdultCapacity)}
                                    helperText={<ErrorMessage name="standardAdultCapacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số trẻ em tiêu chuẩn"
                                    type="number"
                                    name="standardChildCapacity"
                                    fullWidth
                                    error={Boolean(Formik.touched?.standardChildCapacity && Formik.errors?.standardChildCapacity)}
                                    helperText={<ErrorMessage name="standardChildCapacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số người lớn tối đa"
                                    type="number"
                                    name="maxAdultCapacity"
                                    fullWidth
                                    error={Boolean(Formik.touched?.maxAdultCapacity && Formik.errors?.maxAdultCapacity)}
                                    helperText={<ErrorMessage name="maxAdultCapacity" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Field
                                    as={TextField}
                                    label="Số trẻ em tối đa"
                                    type="number"
                                    name="maxChildCapacity"
                                    fullWidth
                                    error={Boolean(Formik.touched?.maxChildCapacity && Formik.errors?.maxChildCapacity)}
                                    helperText={<ErrorMessage name="maxChildCapacity" />}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isEditMode ? "Cập nhật" : "Thêm"}
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ ml: 2 }}
                                onClick={onClose}
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