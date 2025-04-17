// EmployeeAdmin.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Box, Typography, Checkbox, FormControlLabel, Select, MenuItem, Button,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, FormControl,
    TableContainer, Paper, Menu, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, InputBase
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from "@mui/icons-material/Search";
import EmployeeService from "../../services/employee.service.js";
import AddEmployeeDialog from './AddEmployeeDialog';

function EmployeeAdmin() {
    const [employee, setEmployee] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionAnchorEl, setActionAnchorEl] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([
        'Mã nhân viên', 'Tên nhân viên', 'Số điện thoại',
        'Số CMND/CCCD', 'Địa chỉ', 'Chức vụ', 'Ghi chú'
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const columnOptions = [
        { label: 'Ảnh', key: 'image' },
        { label: 'Mã nhân viên', key: 'id' },
        { label: 'Mã chấm công', key: 'user_id' },
        { label: 'Tên nhân viên', key: 'full_name' },
        { label: 'Số điện thoại', key: 'phone' },
        { label: 'Số CMND/CCCD', key: 'id_card' },
        { label: 'Ngày và tạm ứng', key: 'start_date' },
        { label: 'Ghi chú', key: 'note' },
        { label: 'Thiết bị di động', key: 'device' },
        { label: 'Ngày sinh', key: 'dob' },
        { label: 'Giới tính', key: 'gender' },
        { label: 'Email', key: 'email' },
        { label: 'Facebook', key: 'facebook' },
        { label: 'Địa chỉ', key: 'address' },
        { label: 'Chi nhánh trực thuộc', key: 'branch' },
        { label: 'Chi nhánh làm việc', key: 'work_branch' },
        { label: 'Phòng ban', key: 'department' },
        { label: 'Chức vụ', key: 'position' },
        { label: 'Ngày bắt đầu làm việc', key: 'start_date' },
        { label: 'Tài khoản đăng nhập', key: 'login_account' }
    ];

    useEffect(() => {
        fetchAllEmployees(page, size);
    }, [page, size]);

    const fetchAllEmployees = async (page, size) => {
        try {
            const res = await EmployeeService.getAllEmployee(page, size);
            const employees = res.data.content.map(emp => ({
                id: emp.id,
                user_id: emp.user?.userId || '', // Backend yêu cầu trường user
                full_name: emp.fullName,
                phone: emp.phone,
                id_card: emp.idCard,
                address: emp.address,
                position: emp.position,
                department: emp.department,
                start_date: emp.startDate,
                note: emp.note,
                image: emp.imgUrl // Hình ảnh từ backend
            }));
            setEmployee(employees);
            setFilteredEmployees(employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setSnackbarMessage('Lấy danh sách nhân viên thất bại!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSearchChange = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        try {
            if (query.trim() === '') {
                setFilteredEmployees(employee);
            } else {
                const res = await EmployeeService.searchEmployees(query);
                const employees = res.data.content.map(emp => ({
                    id: emp.id,
                    user_id: emp.user?.userId || '',
                    full_name: emp.fullName,
                    phone: emp.phone,
                    id_card: emp.idCard,
                    address: emp.address,
                    position: emp.position,
                    department: emp.department,
                    start_date: emp.startDate,
                    note: emp.note,
                    image: emp.imgUrl
                }));
                setFilteredEmployees(employees);
            }
        } catch (error) {
            console.error("Error searching employees:", error);
            setSnackbarMessage('Tìm kiếm nhân viên thất bại!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleActionMenuClick = (event) => {
        setActionAnchorEl(event.currentTarget);
    };

    const handleActionMenuClose = () => {
        setActionAnchorEl(null);
    };

    const handleColumnToggle = (label) => {
        if (selectedColumns.includes(label)) {
            setSelectedColumns(selectedColumns.filter(col => col !== label));
        } else {
            setSelectedColumns([...selectedColumns, label]);
        }
    };

    const handleRowSelect = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handleDeleteSelected = () => {
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            const invalidIds = [];
            const validIds = [];

            await Promise.all(
                selectedRows.map(async (id) => {
                    try {
                        await EmployeeService.getUserById(id);
                        validIds.push(id);
                    } catch (error) {
                        invalidIds.push(id);
                    }
                })
            );

            if (invalidIds.length > 0) {
                setSnackbarMessage(`Không tìm thấy nhân viên với ID: ${invalidIds.join(', ')}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);

                if (invalidIds.length === selectedRows.length) {
                    setOpenDialog(false);
                    setActionAnchorEl(null);
                    return;
                }
            }

            if (validIds.length > 0) {
                await Promise.all(validIds.map(id => EmployeeService.deleteEmployee(id)));
                fetchAllEmployees(page, size); // Làm mới danh sách
                setSelectedRows([]);
                setSnackbarMessage('Xóa nhân viên thành công!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            }

            setActionAnchorEl(null);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error deleting employees:", error);
            setSnackbarMessage('Xóa nhân viên thất bại!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setOpenDialog(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const labelToKeyMap = columnOptions.reduce((acc, option) => {
        acc[option.label] = option.key;
        return acc;
    }, {});

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 4, md: 2.4 }}>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ ml: 2, mb: 1, fontWeight: 'bold' }}>
                        Danh sách nhân viên
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ fontSize: 13, ml: 2, mb: 1 }}>
                        Đã sử dụng nhân viên
                    </Typography>
                </Box>

                <Box sx={{ marginLeft: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2, boxShadow: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', fontSize: 14 }}>
                        Trạng thái nhân viên
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Đang làm việc" />
                        <FormControlLabel control={<Checkbox />} label="Đã nghỉ" />
                    </Box>
                </Box>

                <Box sx={{ marginLeft: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2, boxShadow: 1, backgroundColor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Phòng ban
                        </Typography>
                        <Box>
                            <IconButton size="small" sx={{ mr: 0.5 }}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <ExpandLessIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue="" sx={{ borderRadius: 1 }}>
                            <MenuItem value="" disabled><em>Chọn phòng ban</em></MenuItem>
                            <MenuItem value="Phòng IT">Phòng IT</MenuItem>
                            <MenuItem value="Phòng HR">Phòng HR</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ marginLeft: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, mb: 8, boxShadow: 1, backgroundColor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Chức danh
                        </Typography>
                        <Box>
                            <IconButton size="small" sx={{ mr: 0.5 }}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <ExpandLessIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue="" sx={{ borderRadius: 1 }}>
                            <MenuItem value="" disabled><em>Chọn chức danh</em></MenuItem>
                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ ml: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 1, backgroundColor: '#fff', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">Số bản ghi:</Typography>
                        <FormControl size="small" sx={{ width: 80 }}>
                            <Select
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                sx={{ borderRadius: 1 }}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 9.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', ml: 2, mt: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: 420, height: 26, border: '1px solid #e0e0e0', borderRadius: '12px', px: 1.5, py: 0.5, mt: 1, ml: 2, backgroundColor: '#fff', boxShadow: 1 }}>
                        <SearchIcon sx={{ fontSize: 20, color: 'gray', mr: 1 }} />
                        <InputBase
                            placeholder="Tìm theo mã chấm công, tên nhân viên"
                            sx={{ fontSize: 14, flex: 1 }}
                            inputProps={{ 'aria-label': 'search employee' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    {selectedRows.length > 0 && (
                        <>
                            <Button
                                variant="contained"
                                startIcon={<UploadFileIcon sx={{ fontSize: '16px' }} />}
                                size="small"
                                sx={{
                                    backgroundColor: '#388e3c',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                    '& .MuiButton-startIcon': { marginRight: '4px' }
                                }}
                                onClick={handleActionMenuClick}
                            >
                                Thao tác
                            </Button>
                            <Menu
                                anchorEl={actionAnchorEl}
                                open={Boolean(actionAnchorEl)}
                                onClose={handleActionMenuClose}
                                disableAutoFocusItem={true}
                            >
                                <MenuItem onClick={handleDeleteSelected}>Xóa</MenuItem>
                            </Menu>
                        </>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon sx={{ fontSize: '16px' }} />}
                            size="small"
                            sx={{
                                backgroundColor: '#388e3c',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '6px 10px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': { marginRight: '4px' }
                            }}
                            onClick={handleOpenAddDialog}
                        >
                            Nhân viên
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon sx={{ fontSize: '16px' }} />}
                            size="small"
                            sx={{
                                backgroundColor: '#388e3c',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': { marginRight: '4px' }
                            }}
                        >
                            Nhập file
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon sx={{ fontSize: '16px' }} />}
                            size="small"
                            sx={{
                                backgroundColor: '#388e3c',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': { marginRight: '4px' }
                            }}
                        >
                            Xuất file
                        </Button>
                        <IconButton sx={{ padding: '4px' }} onClick={handleMenuClick}>
                            <ExpandLessIcon sx={{ fontSize: '20px' }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            PaperProps={{
                                style: { maxHeight: 400, width: 300 }
                            }}
                            disableAutoFocusItem={true}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                <Box>
                                    {columnOptions.slice(0, 10).map(option => (
                                        <FormControlLabel
                                            key={option.label}
                                            control={
                                                <Checkbox
                                                    checked={selectedColumns.includes(option.label)}
                                                    onChange={() => handleColumnToggle(option.label)}
                                                />
                                            }
                                            label={<Typography variant="body2">{option.label}</Typography>}
                                        />
                                    ))}
                                </Box>
                                <Box>
                                    {columnOptions.slice(10).map(option => (
                                        <FormControlLabel
                                            key={option.label}
                                            control={
                                                <Checkbox
                                                    checked={selectedColumns.includes(option.label)}
                                                    onChange={() => handleColumnToggle(option.label)}
                                                />
                                            }
                                            label={<Typography variant="body2">{option.label}</Typography>}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Box sx={{ mt: 3, ml: 2, border: '1px solid #e0e0e0', borderRadius: 1, boxShadow: 1, backgroundColor: '#fff' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#eaf2ff' }}>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 50, padding: '8px 16px', whiteSpace: 'nowrap', textAlign: 'left' }}>
                                        <b></b>
                                    </TableCell>
                                    {selectedColumns.map((col, index) => (
                                        <TableCell key={index} sx={{ minWidth: 120, padding: '8px 16px', whiteSpace: 'nowrap', textAlign: 'left' }}>
                                            <b>{col}</b>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEmployees.map((emp, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ minWidth: 50, padding: '8px 16px', textAlign: 'left' }}>
                                            <Checkbox
                                                checked={selectedRows.includes(emp.id)}
                                                onChange={() => handleRowSelect(emp.id)}
                                            />
                                        </TableCell>
                                        {selectedColumns.map((col, colIndex) => (
                                            <TableCell key={colIndex} sx={{ minWidth: 120, padding: '8px 16px', whiteSpace: 'nowrap', textAlign: 'left' }}>
                                                {col === 'Ảnh' && emp.image ? (
                                                    <img
                                                        src={emp.image}
                                                        alt="Employee"
                                                        style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: '10%' }}
                                                    />
                                                ) : col === 'Mã nhân viên' ? emp.id :
                                                    col === 'Mã chấm công' ? emp.user_id :
                                                        col === 'Tên nhân viên' ? emp.full_name :
                                                            col === 'Số điện thoại' ? emp.phone :
                                                                col === 'Số CMND/CCCD' ? emp.id_card :
                                                                    col === 'Địa chỉ' ? emp.address :
                                                                        col === 'Chức vụ' ? emp.position :
                                                                            col === 'Ghi chú' ? emp.note : '-'
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} disableRestoreFocus={true}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa {selectedRows.length} nhân viên?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={confirmDelete} color="error">Xóa</Button>
                    </DialogActions>
                </Dialog>

                <AddEmployeeDialog
                    open={openAddDialog}
                    onClose={handleCloseAddDialog}
                    fetchAllEmployees={() => fetchAllEmployees(page, size)}
                />

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Grid>
        </Grid>
    );
}

export default EmployeeAdmin;