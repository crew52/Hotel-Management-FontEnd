import React, { useEffect, useState } from 'react';
import {
    Grid, Box, Typography, Checkbox, FormControlLabel, Select, MenuItem, Button,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton, FormControl,
    TableContainer, Paper, Menu, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, InputBase, TextField, Tabs, Tab, RadioGroup, Radio, InputAdornment, Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from "@mui/icons-material/Search";
import EmployeeService from "../../services/employee.service.js";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

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
                                                checked={selectedRows.includes(emp.id)}
                                                onChange={() => handleRowSelect(emp.id)}
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


{/* ___ su ly giao dien + nhan vien ___*/}

                <Dialog
                    open={openAddDialog}
                    onClose={handleCloseAddDialog}
                    disableRestoreFocus={true}
                    maxWidth="md"
                    fullWidth
                    sx={{ '& .MuiDialog-paper': { height: '70vh', display: 'flex', flexDirection: 'column' } }}
                >
                    <DialogTitle sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        backgroundColor: 'white',
                        boxShadow:1,
                        height: '70px',
                        padding:1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{fontSize:16, fontWeight: "bold"}} variant="h6">Thêm mới nhân viên</Typography>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseAddDialog}
                                sx={{ color: (theme) => theme.palette.grey[500] }}
                            >
                                <ClearIcon />
                            </IconButton>
                        </Box>
                        <Tabs
                            value={0}
                            sx={{
                                fontSize: 12,
                                minHeight: 34,
                            }}
                        >
                            <Tab
                                label="Thông tin"
                                sx={{
                                    textTransform: 'none',
                                    minHeight: 34,
                                    height: 34,
                                    padding: "6px 12px",
                                }}
                            />
                            <Tab
                                label="Thiết lập lương"
                                sx={{
                                    textTransform: 'none',
                                    minHeight: 34,
                                    height: 34,
                                    padding: "4px 12px",
                                }}
                            />
                        </Tabs>
                    </DialogTitle>



                    <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 1 ,mt:2}}>
                        <Grid container spacing={1}>

                            <Grid size={2.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: '1px dashed #ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        mt:3,
                                        backgroundColor:"#E6E6FA"
                                    }}
                                >
                                    <IconButton>
                                        <CameraAltIcon />
                                    </IconButton>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: 'none', mb: 2 }}
                                >
                                    Chọn ảnh
                                </Button>

                            </Grid>


                            <Grid size={9.2}>
                                <Box
                                    sx={{
                                        backgroundColor: "white",
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            mt: 1,
                                            color: '#333',
                                        }}
                                    >
                                        Thông tin khởi tạo
                                    </Typography>

                                    <Grid container spacing={2}>

                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Mã nhân viên
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <TextField
                                                        placeholder="Mã nhân viên tự động"
                                                        size="small"
                                                        disabled
                                                        variant="outlined"
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                backgroundColor: '#f5f5f5',
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>

                                <Box  sx={{
                                    backgroundColor: "white",
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 2,
                                }}>
                                    <Grid container spacing={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                mt: 1,
                                                color: '#333',
                                            }}
                                        >
                                            Thông tin cá nhân
                                        </Typography>

                                    </Grid>


                                    <Grid container spacing={2}>

                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        CMND/CCCD
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <TextField
                                                        placeholder="Nhập Số CMND/CCCD"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                backgroundColor: '#f5f5f5',
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Ngày sinh
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <TextField
                                                        placeholder="Nhập ngày sinh"
                                                        size="small"
                                                        variant="outlined"
                                                        name="full_name"
                                                        type="date"
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={10} alignItems="center">
                                            <Grid size={3}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mb: 0.5,
                                                        color: '#555',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Giới tính
                                                </Typography>
                                            </Grid>
                                            <Grid size={9}>
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        name="gender"
                                                        defaultValue="male"
                                                    >
                                                        <FormControlLabel
                                                            value="male"
                                                            control={<Radio size="small" />}
                                                            label="Nam"
                                                        />
                                                        <FormControlLabel
                                                            value="female"
                                                            control={<Radio size="small" />}
                                                            label="Nữ"
                                                        />

                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>


                                    </Grid>
                                </Box>


                                <Box  sx={{
                                    backgroundColor: "white",
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 2,
                                }}>

                                    <Grid container spacing={2}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                mt: 1,
                                                color: '#333',
                                            }}
                                        >
                                            Thông tin công việc
                                        </Typography>

                                    </Grid>


                                    <Grid container spacing={2}>

                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Ngày bắt đầu
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <TextField
                                                        placeholder="Nhập ngày bắt đầu làm việc"
                                                        size="small"
                                                        variant="outlined"
                                                        type={"date"}
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                backgroundColor: '#f5f5f5',
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Phòng ban
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <Grid container spacing={1} alignItems="center">
                                                    <Grid item xs>
                                                        <FormControl fullWidth size="small">
                                                            <Select
                                                                displayEmpty
                                                                variant="outlined"
                                                                defaultValue=""
                                                                sx={{ backgroundColor: '#fff' }}
                                                            >
                                                                <MenuItem value="" disabled>
                                                                    Chọn phòng ban
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    </Grid>


                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>

                                    <Grid container spacing={2} sx={{mt:2}}>

                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                       Chức danh
                                                    </Typography>
                                                </Grid>
                                                <Grid size={8}>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item xs>
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    displayEmpty
                                                                    variant="outlined"
                                                                    defaultValue=""
                                                                    sx={{ backgroundColor: '#fff' }}
                                                                >
                                                                    <MenuItem value="" disabled>
                                                                        Chọn chức danh
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>


                                    <Grid container spacing={5} alignItems="flex-start" sx={{mt:2}}>
                                        <Grid item xs={4}>
                                            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Ghi chú</Typography>
                                        </Grid>

                                        <Grid item xs={8}>
                                            <TextField
                                                multiline
                                                minRows={4}
                                                variant="outlined"
                                                placeholder="Nhập ghi chú..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EditIcon fontSize="small" sx={{ color: '#999' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    borderRadius: 2,
                                                    width:500,
                                                    backgroundColor: '#fff',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: '#e0e0e0',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#1976d2',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#7b1fa2',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>


                                </Box>


                                <Box
                                    sx={{
                                        backgroundColor: "white",
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            mt: 1,
                                            color: '#333',
                                        }}
                                    >
                                        Thông tin liên hệ
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                                sx={{
                                                                    width: '200px',
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '& fieldset': {
                                                                            borderColor: '#e0e0e0',
                                                                        },
                                                                        '&:hover fieldset': {
                                                                            borderColor: '#1976d2',
                                                                        },
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#1976d2',
                                                                        },
                                                                    },
                                                                }}
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
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                        sx={{
                                                            width: '200px',
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#e0e0e0',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#1976d2',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid size={6}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid size={4}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            mb: 0.5,
                                                            color: '#555',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                                                sx={{
                                                                    width: '200px',
                                                                    '& .MuiOutlinedInput-root': {
                                                                        '& fieldset': {
                                                                            borderColor: '#e0e0e0',
                                                                        },
                                                                        '&:hover fieldset': {
                                                                            borderColor: '#1976d2',
                                                                        },
                                                                        '&.Mui-focused fieldset': {
                                                                            borderColor: '#1976d2',
                                                                        },
                                                                    },
                                                                }}
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

                    <DialogActions
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            left: 0,
                            backgroundColor: 'white',
                            boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
                            zIndex: 1,
                            p: 2,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ textTransform: 'none', mr: 1 }}
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#555' }}
                        >
                            Bỏ qua
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