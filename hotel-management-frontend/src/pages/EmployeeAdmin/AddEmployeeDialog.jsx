import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tabs, Tab,
    Grid, Box, Typography, TextField, FormControl, Select, MenuItem, RadioGroup, FormControlLabel,
    Radio, Autocomplete, InputAdornment
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

const AddEmployeeDialog = ({ open, onClose, newEmployee, handleInputChange }) => {
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
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }} variant="h6">Thêm mới nhân viên</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <ClearIcon />
                    </IconButton>
                </Box>
                <Tabs value={0} sx={{ fontSize: 12, minHeight: 34 }}>
                    <Tab label="Thông tin" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: "6px 12px" }} />
                    <Tab label="Thiết lập lương" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: "4px 12px" }} />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 1, mt: 2 }}>
                <Grid container spacing={1}>
                    <Grid size={2.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 120, height: 120, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, mt: 3, backgroundColor: "#E6E6FA" }}>
                            <IconButton>
                                <CameraAltIcon />
                            </IconButton>
                        </Box>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', mb: 2 }}>
                            Chọn ảnh
                        </Button>
                    </Grid>

                    <Grid size={9.2}>
                        <Box sx={{ backgroundColor: "white", boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin khởi tạo
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Mã nhân viên
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Mã nhân viên tự động"
                                                size="small"
                                                disabled
                                                variant="outlined"
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { backgroundColor: '#f5f5f5', '& fieldset': { borderColor: '#e0e0e0' } } }}
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
                                                name="full_name"
                                                value={newEmployee.full_name}
                                                onChange={handleInputChange}
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
                                                value={newEmployee.phone}
                                                onChange={handleInputChange}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: "white", boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin cá nhân
                            </Typography>
                            <Grid container spacing={2}>
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
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { backgroundColor: '#f5f5f5', '& fieldset': { borderColor: '#e0e0e0' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
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
                                            <RadioGroup row name="gender" defaultValue="male">
                                                <FormControlLabel value="male" control={<Radio size="small" />} label="Nam" />
                                                <FormControlLabel value="female" control={<Radio size="small" />} label="Nữ" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: "white", boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
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
                                                name="start_date"
                                                value={newEmployee.start_date}
                                                onChange={handleInputChange}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { backgroundColor: '#f5f5f5', '& fieldset': { borderColor: '#e0e0e0' } } }}
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
                                                    defaultValue=""
                                                    name="department"
                                                    value={newEmployee.department}
                                                    onChange={handleInputChange}
                                                    sx={{ backgroundColor: '#fff' }}
                                                >
                                                    <MenuItem value="" disabled>Chọn phòng ban</MenuItem>
                                                    <MenuItem value="Phòng IT">Phòng IT</MenuItem>
                                                    <MenuItem value="Phòng HR">Phòng HR</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
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
                                                    defaultValue=""
                                                    name="position"
                                                    value={newEmployee.position}
                                                    onChange={handleInputChange}
                                                    sx={{ backgroundColor: '#fff' }}
                                                >
                                                    <MenuItem value="" disabled>Chọn chức danh</MenuItem>
                                                    <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                                                    <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                                                </Select>
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
                                        value={newEmployee.note}
                                        onChange={handleInputChange}
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

                        <Box sx={{ backgroundColor: "white", boxShadow: 3, borderRadius: 2, p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333' }}>
                                Thông tin liên hệ
                            </Typography>
                            <Grid container spacing={2}>
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
                                                value={newEmployee.address}
                                                onChange={handleInputChange}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Khu vực
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Autocomplete
                                                options={['Thành/TP - Quận/Huyện 1', 'Thành/TP - Quận/Huyện 2']}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn Thành/TP - Quận/Huyện..."
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                                    />
                                                )}
                                                value={newEmployee.area}
                                                onChange={(event, newValue) => {
                                                    handleInputChange({ target: { name: 'area', value: newValue } });
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Email
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder=""
                                                size="small"
                                                variant="outlined"
                                                name="email"
                                                value={newEmployee.email}
                                                onChange={handleInputChange}
                                                sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap' }}>
                                                Phường xã
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Autocomplete
                                                options={['Phường/Xã 1', 'Phường/Xã 2']}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Chọn Phường/Xã"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e0e0e0' }, '&:hover fieldset': { borderColor: '#1976d2' }, '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                                                    />
                                                )}
                                                value={newEmployee.ward}
                                                onChange={(event, newValue) => {
                                                    handleInputChange({ target: { name: 'ward', value: newValue } });
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ position: 'sticky', bottom: 0, left: 0, backgroundColor: 'white', boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)', zIndex: 1, p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none', mr: 1 }}>
                    Lưu
                </Button>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#555' }}>
                    Bỏ qua
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployeeDialog;