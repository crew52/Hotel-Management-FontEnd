"use client";

import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import RoomService from "../../services/RoomService.js";
import { toast } from "react-toastify";

// Constants cho các giá trị lặp lại
const EXTRA_FEE_TYPES = [
    { value: "FIXED", label: "Tiền mặt" },
    { value: "PERCENTAGE", label: "Nhân số" },
];

const STATUSES = [
    { value: "ACTIVE", label: "Đang kinh doanh" },
    { value: "INACTIVE", label: "Ngừng kinh doanh" },
];

const YES_NO_OPTIONS = [
    { value: true, label: "Có" },
    { value: false, label: "Không" },
];

const RoomCategoryForm = ({ initialData, onClose, onSave }) => {
    const isEditMode = !!initialData;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State để ngăn click kép

    // Initial values dựa trên dữ liệu từ backend hoặc giá trị mặc định
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

    // Hàm validate khớp với ràng buộc của backend
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

        if (values.hourlyPrice < 0) {
            errors.hourlyPrice = "Giá giờ phải lớn hơn hoặc bằng 0";
        }
        if (values.dailyPrice < 0) {
            errors.dailyPrice = "Giá cả ngày phải lớn hơn hoặc bằng 0";
        }
        if (values.overnightPrice < 0) {
            errors.overnightPrice = "Giá qua đêm phải lớn hơn hoặc bằng 0";
        }
        if (values.earlyCheckinFee < 0) {
            errors.earlyCheckinFee = "Phí nhận phòng sớm phải lớn hơn hoặc bằng 0";
        }
        if (values.lateCheckoutFee < 0) {
            errors.lateCheckoutFee = "Phí trả phòng trễ phải lớn hơn hoặc bằng 0";
        }
        if (values.defaultExtraFee < 0) {
            errors.defaultExtraFee = "Mức phí phụ thu phải lớn hơn hoặc bằng 0";
        }

        if (values.standardAdultCapacity < 0) {
            errors.standardAdultCapacity = "Số người lớn tiêu chuẩn phải lớn hơn hoặc bằng 0";
        }
        if (values.standardChildCapacity < 0) {
            errors.standardChildCapacity = "Số trẻ em tiêu chuẩn phải lớn hơn hoặc bằng 0";
        }
        if (values.maxAdultCapacity < 0) {
            errors.maxAdultCapacity = "Số người lớn tối đa phải lớn hơn hoặc bằng 0";
        }
        if (values.maxChildCapacity < 0) {
            errors.maxChildCapacity = "Số trẻ em tối đa phải lớn hơn hoặc bằng 0";
        }

        if (!values.status) {
            errors.status = "Trạng thái là bắt buộc";
        } else if (!["ACTIVE", "INACTIVE"].includes(values.status)) {
            errors.status = "Trạng thái không hợp lệ";
        }

        if (!["FIXED", "PERCENTAGE"].includes(values.extraFeeType)) {
            errors.extraFeeType = "Hình thức phí phụ thu không hợp lệ";
        }

        if (values.imgUrl && values.imgUrl.length > 255) {
            errors.imgUrl = "URL hình ảnh tối đa 255 ký tự";
        }

        return errors;
    };

    const preparePayload = (values) => {
        return {
            ...values,
            hourlyPrice: values.hourlyPrice !== undefined && values.hourlyPrice !== "" ? parseFloat(values.hourlyPrice) : null,
            dailyPrice: values.dailyPrice !== undefined && values.dailyPrice !== "" ? parseFloat(values.dailyPrice) : null,
            overnightPrice: values.overnightPrice !== undefined && values.overnightPrice !== "" ? parseFloat(values.overnightPrice) : null,
            earlyCheckinFee: values.earlyCheckinFee !== undefined && values.earlyCheckinFee !== "" ? parseFloat(values.earlyCheckinFee) : null,
            lateCheckoutFee: values.lateCheckoutFee !== undefined && values.lateCheckoutFee !== "" ? parseFloat(values.lateCheckoutFee) : null,
            defaultExtraFee: values.defaultExtraFee !== undefined && values.defaultExtraFee !== "" ? parseFloat(values.defaultExtraFee) : 0,
            applyToAllCategories: values.applyToAllCategories,
            description: values.description || null,
            imgUrl: values.imgUrl || null,
        };
    };

    const onSubmit = async (values, { setSubmitting }) => {
        console.log("onSubmit called at:", new Date().toISOString()); // Log để kiểm tra
        setIsButtonDisabled(true); // Vô hiệu hóa nút ngay khi submit

        try {
            const payload = preparePayload(values);
            console.log("Payload before submit:", payload);

            let response;
            if (isEditMode && initialData?.id) {
                response = await RoomService.updateRoomCategory(initialData.id, payload);
            } else {
                response = await RoomService.addRoomCategory(payload);
            }
            onSave(response);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.defaultMessage ||
                "Lỗi khi thêm/cập nhật hạng phòng!";
            toast.error(errorMessage);
            console.error("Error during submit:", error.response?.data || error.message);
        } finally {
            setSubmitting(false);
            setIsButtonDisabled(false); // Kích hoạt lại nút sau khi hoàn tất
            onClose();
        }
    };

    const renderField = (name, label, type = "text", options = null, extraProps = {}) => (
        <Field
            as={TextField}
            label={label}
            name={name}
            type={type}
            select={!!options}
            fullWidth
            error={Boolean(Formik.touched?.[name] && Formik.errors?.[name])}
            helperText={<ErrorMessage name={name} />}
            {...extraProps}
        >
            {options &&
                options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </Field>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                {isEditMode ? "Cập nhật hạng phòng" : "Thêm hạng phòng"}
            </Typography>
            <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                {({ isSubmitting, values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid xs={12} sm={6}>
                                {renderField("code", "Mã hạng phòng", "text", null, {
                                    disabled: isEditMode,
                                })}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("name", "Tên hạng phòng")}
                            </Grid>
                            <Grid xs={12}>
                                {renderField("description", "Mô tả", "text", null, {
                                    multiline: true,
                                    rows: 3,
                                })}
                            </Grid>
                            <Grid xs={12} sm={4}>
                                {renderField("hourlyPrice", "Giá giờ", "number")}
                            </Grid>
                            <Grid xs={12} sm={4}>
                                {renderField("dailyPrice", "Giá cả ngày", "number")}
                            </Grid>
                            <Grid xs={12} sm={4}>
                                {renderField("overnightPrice", "Giá qua đêm", "number")}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("earlyCheckinFee", "Phí nhận phòng sớm", "number")}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("lateCheckoutFee", "Phí trả phòng trễ", "number")}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("extraFeeType", "Hình thức phí phụ thu", "select", EXTRA_FEE_TYPES)}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("defaultExtraFee", "Mức phí phụ thu", "number")}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("applyToAllCategories", "Áp dụng cho tất cả hạng phòng", "select", YES_NO_OPTIONS)}
                            </Grid>
                            <Grid xs={12} sm={6}>
                                {renderField("status", "Trạng thái", "select", STATUSES)}
                            </Grid>
                            <Grid xs={12}>
                                {renderField("imgUrl", "URL hình ảnh")}
                            </Grid>
                            {values.imgUrl && (
                                <Grid xs={12}>
                                    <Typography variant="subtitle1">Hình ảnh</Typography>
                                    <img
                                        src={values.imgUrl}
                                        alt="Room Category"
                                        style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginTop: 8 }}
                                    />
                                </Grid>
                            )}
                            <Grid xs={12} sm={3}>
                                {renderField("standardAdultCapacity", "Số người lớn tiêu chuẩn", "number")}
                            </Grid>
                            <Grid xs={12} sm={3}>
                                {renderField("standardChildCapacity", "Số trẻ em tiêu chuẩn", "number")}
                            </Grid>
                            <Grid xs={12} sm={3}>
                                {renderField("maxAdultCapacity", "Số người lớn tối đa", "number")}
                            </Grid>
                            <Grid xs={12} sm={3}>
                                {renderField("maxChildCapacity", "Số trẻ em tối đa", "number")}
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || isButtonDisabled} // Kết hợp cả isSubmitting và isButtonDisabled
                            >
                                {isEditMode ? "Cập nhật" : "Thêm"}
                            </Button>
                            <Button variant="outlined" sx={{ ml: 2 }} onClick={onClose}>
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