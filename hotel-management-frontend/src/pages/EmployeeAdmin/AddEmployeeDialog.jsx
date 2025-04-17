import React, { useRef, useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tabs, Tab,
    Grid, Box, Typography, TextField, FormControl, Select, MenuItem, RadioGroup, FormControlLabel,
    Radio, InputAdornment
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmployeeService from "../../services/employee.service.js";
import { toast } from "react-toastify";


const validationSchema = Yup.object({
    userId: Yup.number()
        .required("Mã người dùng là bắt buộc")
        .positive("Mã người dùng phải là số dương")
        .integer("Mã người dùng phải là số nguyên"),
    fullName: Yup.string()
        .required("Tên nhân viên là bắt buộc")
        .max(100, "Tên nhân viên tối đa 100 ký tự"),
    gender: Yup.string()
        .required("Giới tính là bắt buộc")
        .oneOf(['MALE', 'FEMALE', 'OTHER'], "Giới tính không hợp lệ"),
    dob: Yup.date()
        .required("Ngày sinh là bắt buộc")
        .max(new Date(), "Ngày sinh phải là ngày trong quá khứ")
        .typeError("Ngày sinh không hợp lệ"),
    phone: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(/^[0-9]{10,15}$/, "Số điện thoại phải có 10-15 chữ số"),
    idCard: Yup.string()
        .required("CMND/CCCD là bắt buộc")
        .matches(/^[A-Z0-9]{5,20}$/, "CMND/CCCD phải có 5-20 ký tự, chỉ chứa chữ cái in hoa và số"),
    address: Yup.string()
        .max(255, "Địa chỉ tối đa 255 ký tự"),
    position: Yup.string()
        .max(100, "Chức danh tối đa 100 ký tự"),
    department: Yup.string()
        .max(100, "Phòng ban tối đa 100 ký tự"),
    startDate: Yup.date()
        .required("Ngày bắt đầu là bắt buộc")
        .max(new Date(), "Ngày bắt đầu không được là ngày trong tương lai")
        .typeError("Ngày bắt đầu không hợp lệ"),
    note: Yup.string()
        .max(65535, "Ghi chú quá dài"),
    imgUrl: Yup.string()
        .max(255, "URL ảnh tối đa 255 ký tự")
        .url("URL ảnh không hợp lệ")
        .nullable(),
});

const AddEmployeeDialog = ({ open, onClose, fetchAllEmployees, employee }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);


    const isEditMode = !!employee;

    const formik = useFormik({
        initialValues: {
            userId: employee ? employee.userId : '',
            fullName: employee ? employee.fullName : '',
            gender: employee ? employee.gender : '',
            dob: employee ? employee.d干ob.join('-') : '',
            phone: employee ? employee.phone : '',
            idCard: employee ? employee.idCard : '',
            address: employee ? employee.address : '',
            position: employee ? employee.position : '',
            department: employee ? employee.department : '',
            startDate: employee ? employee.startDate.join('-') : '',
            note: employee ? employee.note : '',
            imgUrl: employee ? employee.imgUrl : null,
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let dobArray, startDateArray;
            try {
                const dobDate = new Date(values.dob);
                const startDateDate = new Date(values.startDate);

                if (isNaN(dobDate.getTime()) || isNaN(startDateDate.getTime())) {
                    throw new Error("Ngày không hợp lệ");
                }

                dobArray = [dobDate.getFullYear(), dobDate.getMonth() + 1, dobDate.getDate()];
                startDateArray = [startDateDate.getFullYear(), startDateDate.getMonth() + 1, startDateDate.getDate()];
            } catch (error) {
                toast.error("Ngày sinh hoặc ngày bắt đầu không hợp lệ");
                return;
            }

            const employeeData = {
                userId: parseInt(values.userId, 10),
                fullName: values.fullName,
                gender: values.gender,
                dob: dobArray,
                phone: values.phone,
                idCard: values.idCard,
                address: values.address || null,
                position: values.position || null,
                department: values.department || null,
                startDate: startDateArray,
                note: values.note || null,
                imgUrl: values.imgUrl || null,
            };

            console.log("Dữ liệu gửi đi:", employeeData);

            try {
                if (isEditMode) {
                    // Chế độ chỉnh sửa
                    await EmployeeService.updateEmployee(employee.id, employeeData);
                    toast.success("Cập nhật nhân viên thành công");
                } else {
                    // Chế độ thêm mới
                    await EmployeeService.addEmployee(employeeData);
                    toast.success("Thêm nhân viên thành công");
                }
                fetchAllEmployees();
                formik.resetForm();
                setPreviewUrl(null);
                setFile(null);
                onClose();
            } catch (error) {
                let errorMessage = "Thao tác thất bại";
                if (error.response?.data?.message) {
                    const message = error.response.data.message.toLowerCase();
                    if (message.includes("duplicate entry")) {
                        if (message.includes("user_id")) {
                            errorMessage = "Mã người dùng đã tồn tại";
                        } else if (message.includes("phone")) {
                            errorMessage = "Số điện thoại đã được sử dụng";
                        } else if (message.includes("id_card")) {
                            errorMessage = "CMND/CCCD đã tồn tại";
                        } else {
                            errorMessage = "Dữ liệu bị trùng, vui lòng kiểm tra lại";
                        }
                    } else {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
                console.error("Error processing employee:", error);
            }
        },
    });

    const openFilePicker = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            formik.setFieldValue('imgUrl', 'https://th.bing.com/th/id/OIP.f7KwRD3PN0_6gnHYOuX3KgHaG9?w=202&h=190&c=7&r=0&o=5&dpr=1.3&pid=1.7');
        }
    };

    useEffect(() => {
        if (employee && employee.imgUrl) {
            setPreviewUrl(employee.imgUrl);
        }
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [employee, previewUrl]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableRestoreFocus={true}
            maxWidth={false}
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '80vw',
                    height: '90vh',
                    maxWidth: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'white',
                boxShadow: 1,
                height: '70px',
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 'bold' }} variant="h6">
                        {isEditMode ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <ClearIcon />
                    </IconButton>
                </Box>
                <Tabs value={0} sx={{ fontSize: 12, minHeight: 34 }}>
                    <Tab label="Thông tin" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: '6px 12px' }} />
                    <Tab label="Thiết lập lương" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: '4px 12px' }} />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 1, mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid size={2.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                border: previewUrl ? 'none' : '1px dashed #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mt: 3,
                                backgroundColor: previewUrl ? 'transparent' : '#E6E6FA',
                                overflow: 'hidden',
                            }}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Selected Employee"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <IconButton>
                                    <CameraAltIcon />
                                </IconButton>
                            )}
                        </Box>
                        <Box>
                            <input
                                type="file"
                                accept="image/*"
                                ref={inputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: 'none', mb: 2 }}
                                onClick={openFilePicker}
                            >
                                Chọn ảnh
                            </Button>
                        </Box>
                    </Grid>

                    <Grid size={9.2}>
                        <Box sx={{ backgroundColor: 'white', boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin khởi tạo
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Mã người dùng
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập mã người dùng"
                                                size="small"
                                                variant="outlined"
                                                name="userId"
                                                type="number"
                                                value={formik.values.userId}
                                                onChange={formik.handleChange}
                                                error={formik.touched.userId && Boolean(formik.errors.userId)}
                                                helperText={formik.touched.userId && formik.errors.userId}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                                disabled={isEditMode} // Không cho phép sửa userId khi chỉnh sửa
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Tên nhân viên
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập tên nhân viên"
                                                size="small"
                                                variant="outlined"
                                                name="fullName"
                                                value={formik.values.fullName}
                                                onChange={formik.handleChange}
                                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                                helperText={formik.touched.fullName && formik.errors.fullName}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Số điện thoại
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập số điện thoại"
                                                size="small"
                                                variant="outlined"
                                                name="phone"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
                                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                                helperText={formik.touched.phone && formik.errors.phone}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                CMND/CCCD
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập Số CMND/CCCD"
                                                size="small"
                                                variant="outlined"
                                                name="idCard"
                                                value={formik.values.idCard}
                                                onChange={formik.handleChange}
                                                error={formik.touched.idCard && Boolean(formik.errors.idCard)}
                                                helperText={formik.touched.idCard && formik.errors.idCard}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin cá nhân
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Ngày sinh
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập ngày sinh"
                                                size="small"
                                                variant="outlined"
                                                name="dob"
                                                type="date"
                                                value={formik.values.dob}
                                                onChange={formik.handleChange}
                                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                helperText={formik.touched.dob && formik.errors.dob}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={10} alignItems="center">
                                    <Grid size={3}>
                                        <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                            Giới tính
                                        </Typography>
                                    </Grid>
                                    <Grid size={9}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                name="gender"
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                            >
                                                <FormControlLabel value="MALE" control={<Radio size="small" />} label="Nam" />
                                                <FormControlLabel value="FEMALE" control={<Radio size="small" />} label="Nữ" />
                                                <FormControlLabel value="OTHER" control={<Radio size="small" />} label="Khác" />
                                            </RadioGroup>
                                            {formik.touched.gender && formik.errors.gender && (
                                                <Typography color="error" variant="caption">{formik.errors.gender}</Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Địa chỉ
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder=""
                                                size="small"
                                                variant="outlined"
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                error={formik.touched.address && Boolean(formik.errors.address)}
                                                helperText={formik.touched.address && formik.errors.address}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin công việc
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Ngày bắt đầu
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập ngày bắt đầu làm việc"
                                                size="small"
                                                variant="outlined"
                                                type="date"
                                                name="startDate"
                                                value={formik.values.startDate}
                                                onChange={formik.handleChange}
                                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                                helperText={formik.touched.startDate && formik.errors.startDate}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Phòng ban
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    displayEmpty
                                                    variant="outlined"
                                                    name="department"
                                                    value={formik.values.department}
                                                    onChange={formik.handleChange}
                                                    sx={{ backgroundColor: '#fff' }}
                                                >
                                                    <MenuItem value="" disabled>Chọn phòng ban</MenuItem>
                                                    <MenuItem value="Front Desk">Front Desk</MenuItem>
                                                    <MenuItem value="Phòng IT">Phòng IT</MenuItem>
                                                    <MenuItem value="Phòng HR">Phòng HR</MenuItem>
                                                </Select>
                                                {formik.touched.department && formik.errors.department && (
                                                    <Typography color="error" variant="caption">{formik.errors.department}</Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Chức danh
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    displayEmpty
                                                    variant="outlined"
                                                    name="position"
                                                    value={formik.values.position}
                                                    onChange={formik.handleChange}
                                                    sx={{ backgroundColor: '#fff' }}
                                                >
                                                    <MenuItem value="" disabled>Chọn chức danh</MenuItem>
                                                    <MenuItem value="Receptionist">Receptionist</MenuItem>
                                                    <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                                                    <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                                                </Select>
                                                {formik.touched.position && formik.errors.position && (
                                                    <Typography color="error" variant="caption">{formik.errors.position}</Typography>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={5} alignItems="flex-start" sx={{ mt: 2 }}>
                                <Grid item xs={4}>
                                    <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Ghi chú</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        multiline
                                        minRows={4}
                                        variant="outlined"
                                        placeholder="Nhập ghi chú..."
                                        name="note"
                                        value={formik.values.note}
                                        onChange={formik.handleChange}
                                        error={formik.touched.note && Boolean(formik.errors.note)}
                                        helperText={formik.touched.note && formik.errors.note}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EditIcon fontSize="small" sx={{ color: '#999' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            width: 500,
                                            backgroundColor: '#fff',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#e0e0e0' },
                                                '&:hover fieldset': { borderColor: '#1976d2' },
                                                '&.Mui-focused fieldset': { borderColor: '#7b1fa2' },
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ position: 'sticky', bottom: 0, left: 0, backgroundColor: 'white', boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)', zIndex: 1, p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ textTransform: 'none', mr: 1 }}
                    onClick={formik.handleSubmit}
                >
                    {isEditMode ? "Cập nhật" : "Lưu"}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#555' }}
                    onClick={onClose}
                >
                    Bỏ qua
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployeeDialog;