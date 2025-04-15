import React, { useEffect, useState } from 'react';
import {
    Grid, Box, Typography, Checkbox, FormControlLabel, Select, MenuItem, Button,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, FormControl,
    TableContainer, Paper, Menu, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, InputBase, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from "@mui/icons-material/Search";
import EmployeeService from "../../services/employee.service.js";

function EmployeeAdmin() {
    const [employee, setEmployee] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionAnchorEl, setActionAnchorEl] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([
        'Mã nhân viên', 'Mã chấm công', 'Tên nhân viên', 'Số điện thoại',
        'Số CMND/CCCD', 'Địa chỉ', 'Chức vụ', 'Ghi chú'
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const [newEmployee, setNewEmployee] = useState({
        id: '',
        user_id: '',
        full_name: '',
        phone: '',
        branch: '',
        work_branch: '',
        start_date: '',
        department: '',
        position: '',
        login_account: '',
        note: ''
    });

    const columnOptions = [
        { label: 'Ảnh', key: 'image' },
        { label: 'Mã nhân viên', key: 'id' }, // Updated from employee_id to id
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
        fetchAllEmployees();
    }, []);


    const fetchAllEmployees = async () => {
        try {
            const res = await EmployeeService.getAllEmployee();
            console.log("Fetched employees:", res.data);
            setEmployee(res.data);
            setFilteredEmployees(res.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
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
                console.log("Search results:", res.data);
                const filtered = res.data.filter(emp =>
                    emp.user_id.toString().toLowerCase().includes(query.toLowerCase()) ||
                    emp.full_name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredEmployees(filtered);
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
        setNewEmployee({
            id: '',
            user_id: '',
            full_name: '',
            phone: '',
            branch: '',
            work_branch: '',
            start_date: '',
            department: '',
            position: '',
            login_account: '',
            note: ''
        });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSaveEmployee = async () => {
        try {
            console.log("New employee data:", newEmployee);


            const newEmpWithId = { ...newEmployee, id: employee.length + 1 };
            setEmployee([...employee, newEmpWithId]);
            setFilteredEmployees([...employee, newEmpWithId]);

            setSnackbarMessage('Thêm nhân viên thành công!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            handleCloseAddDialog();
        } catch (error) {
            console.error("Error adding employee:", error);
            setSnackbarMessage('Thêm nhân viên thất bại!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
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

    const handleRowSelect = (id) => { // Updated parameter to id
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
            console.log("Selected employee IDs to delete:", selectedRows);

            const invalidIds = [];
            const validIds = [];

            await Promise.all(
                selectedRows.map(async (id) => {
                    try {
                        const response = await EmployeeService.getUserById(id);
                        console.log(`Employee with ID ${id} found:`, response.data);
                        validIds.push(id);
                    } catch (error) {
                        console.error(`Employee with ID ${id} not found:`, error);
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

                const updatedEmployees = employee.filter(emp => !validIds.includes(emp.id)); // Updated to id
                setEmployee(updatedEmployees);
                setFilteredEmployees(updatedEmployees);
                setSelectedRows([]);
                setSnackbarMessage('Xóa nhân viên thành công!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            }

            setActionAnchorEl(null);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error deleting employees:", error);
            if (error.response) {
                console.log("Error response data:", error.response.data);
                console.log("Error response status:", error.response.status);
            }
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
                            <Select defaultValue={10} sx={{ borderRadius: 1 }}>
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
                                    <TableCell
                                        sx={{
                                            minWidth: 50,
                                            padding: '8px 16px',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <b></b>
                                    </TableCell>
                                    {selectedColumns.map((col, index) => (
                                        <TableCell
                                            key={index}
                                            sx={{
                                                minWidth: 120,
                                                padding: '8px 16px',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <b>{col}</b>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEmployees.map((emp, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            sx={{
                                                minWidth: 50,
                                                padding: '8px 16px',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <Checkbox
                                                checked={selectedRows.includes(emp.id)} // Updated to id
                                                onChange={() => handleRowSelect(emp.id)} // Updated to id
                                            />
                                        </TableCell>
                                        {selectedColumns.map((col, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                sx={{
                                                    minWidth: 120,
                                                    padding: '8px 16px',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                {col === 'Ảnh' && emp[labelToKeyMap[col]] ? (
                                                    <img
                                                        src={emp[labelToKeyMap[col]]}
                                                        alt="Employee"
                                                        style={{
                                                            width: 80,
                                                            height: 40,
                                                            objectFit: 'cover',
                                                            borderRadius: '10%'
                                                        }}
                                                    />
                                                ) : (
                                                    emp[labelToKeyMap[col]] || '-'
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>


                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    disableRestoreFocus={true}
                >
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa {selectedRows.length} nhân viên?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={confirmDelete} color="error">Xóa</Button>
                    </DialogActions>
                </Dialog>


                <Dialog
                    open={openAddDialog}
                    onClose={handleCloseAddDialog}
                    disableRestoreFocus={true}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Thêm mới nhân viên
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseAddDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Typography>X</Typography>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    Chọn ảnh
                                </Typography>
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        border: '1px dashed #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2
                                    }}
                                >
                                    <Typography>📷</Typography>
                                </Box>
                            </Box>


                            <Box sx={{ width: '70%' }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Thông tin khởi tạo
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Mã nhân viên"
                                            name="id"
                                            value={newEmployee.id}
                                            onChange={handleInputChange}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Mã nhân viên tự động"
                                            name="user_id"
                                            value={newEmployee.user_id}
                                            onChange={handleInputChange}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Tên nhân viên"
                                            name="full_name"
                                            value={newEmployee.full_name}
                                            onChange={handleInputChange}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                displayEmpty
                                                name="branch"
                                                value={newEmployee.branch}
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Chi nhánh trung tâm</em>
                                                </MenuItem>
                                                <MenuItem value="Chi nhánh trung tâm">Chi nhánh trung tâm</MenuItem>
                                                <MenuItem value="Chi nhánh 1">Chi nhánh 1</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                displayEmpty
                                                name="work_branch"
                                                value={newEmployee.work_branch}
                                                onChange={handleInputChange}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Chi nhánh làm việc</em>
                                                </MenuItem>
                                                <MenuItem value="Chi nhánh trung tâm">Chi nhánh trung tâm</MenuItem>
                                                <MenuItem value="Chi nhánh 1">Chi nhánh 1</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                                            Ẩn thông tin
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>


                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Thông tin công việc
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Ngày bắt đầu làm việc"
                                        name="start_date"
                                        type="date"
                                        value={newEmployee.start_date}
                                        onChange={handleInputChange}
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            displayEmpty
                                            name="department"
                                            value={newEmployee.department}
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Chọn phòng ban</em>
                                            </MenuItem>
                                            <MenuItem value="Phòng IT">Phòng IT</MenuItem>
                                            <MenuItem value="Phòng HR">Phòng HR</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            displayEmpty
                                            name="position"
                                            value={newEmployee.position}
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Chọn chức danh</em>
                                            </MenuItem>
                                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            displayEmpty
                                            name="login_account"
                                            value={newEmployee.login_account}
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Tài khoản đăng nhập</em>
                                            </MenuItem>
                                            <MenuItem value="Account 1">Account 1</MenuItem>
                                            <MenuItem value="Account 2">Account 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        fullWidth
                                        label="Ghi chú"
                                        name="note"
                                        value={newEmployee.note}
                                        onChange={handleInputChange}
                                        size="small"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog} sx={{ textTransform: 'none' }}>
                            Bỏ qua
                        </Button>
                        <Button
                            onClick={handleSaveEmployee}
                            variant="contained"
                            sx={{ textTransform: 'none', backgroundColor: '#1976d2' }}
                        >
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Grid>
        </Grid>
    );
}

export default EmployeeAdmin;