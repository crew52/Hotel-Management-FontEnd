import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HotelIcon from '@mui/icons-material/Hotel';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import Chip from '@mui/material/Chip';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Menu from '@mui/material/Menu';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';

// Transition cho booking dialog (slide-up)
const BookingTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Transition cho filter dialog (slide-left từ phải sang)
const FilterTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

// Styled components cho thanh tìm kiếm
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#666',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.9, 1.2, 0.9, 0),
        paddingLeft: `calc(1em + ${theme.spacing(2)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: '0.9rem',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

// Component RoomBookingView
function RoomBookingView() {
    const [viewMode, setViewMode] = React.useState('Sơ đồ');
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const [anchorElTimeFilter, setAnchorElTimeFilter] = React.useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState('');
    const [bookingOpen, setBookingOpen] = React.useState(false);
    const [filterOpen, setFilterOpen] = React.useState(false);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleSearchClick = (event) => {
        setAnchorElSearch(event.currentTarget);
    };

    const handleSearchClose = () => {
        setAnchorElSearch(null);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleTimeFilterClick = (event) => {
        setAnchorElTimeFilter(event.currentTarget);
    };

    const handleTimeFilterClose = () => {
        setAnchorElTimeFilter(null);
    };

    const handlePriceTableClick = (event) => {
        setAnchorElPriceTable(event.currentTarget);
    };

    const handlePriceTableClose = () => {
        setAnchorElPriceTable(null);
    };

    const handleBookingOpen = () => {
        setBookingOpen(true);
    };

    const handleBookingClose = () => {
        setBookingOpen(false);
    };

    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFilterClose = () => {
        setFilterOpen(false);
    };

    const renderSearchBar = () => (
        <Search>
            <SearchIconWrapper>
                <SearchIcon sx={{ color: '#666', fontSize: '1.2rem' }} />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Tìm kiếm khách hàng, mã đặt phòng..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchValue}
                onChange={handleSearchChange}
                onClick={handleSearchClick}
            />
        </Search>
    );

    const renderCommonElements = () => (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <IconButton
                    sx={{
                        backgroundColor: '#e0e0e0',
                        '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' },
                    }}
                    onClick={handleFilterOpen}
                >
                    <FilterListIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                </IconButton>
                <IconButton
                    sx={{
                        backgroundColor: '#e0e0e0',
                        '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' },
                    }}
                >
                    <QrCodeScannerIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorElSearch}
                open={Boolean(anchorElSearch)}
                onClose={handleSearchClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem sx={{ fontSize: '0.8rem' }}>Tiểu chi tiết tìm kiếm</MenuItem>
                <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.7 }}>
                    <Button
                        sx={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976d2',
                            borderRadius: 20,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#BBDEFB' },
                        }}
                    >
                        Khách hàng
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#FFF8E1',
                            color: '#FBC02D',
                            borderRadius: 20,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#FFECB3' },
                        }}
                    >
                        Mã đặt phòng
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.7 }}>
                    <Button
                        sx={{
                            backgroundColor: '#E0F7FA',
                            color: '#00ACC1',
                            borderRadius: 20,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#B2EBF2' },
                        }}
                    >
                        Mã kênh bán
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#FCE4EC',
                            color: '#EC407A',
                            borderRadius: 20,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#F8BBD0' },
                        }}
                    >
                        Tên phòng
                    </Button>
                </Box>
            </Menu>
        </>
    );

    const renderViewModeButtons = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#e0e0e0',
                borderRadius: 20,
                padding: '2px',
            }}
        >
            <Button
                sx={{
                    backgroundColor: viewMode === 'Danh sách' ? '#E3F2FD' : 'transparent',
                    color: viewMode === 'Danh sách' ? '#1976d2' : '#666',
                    borderRadius: 20,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Danh sách' ? '#BBDEFB' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<ListIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => handleViewModeChange('Danh sách')}
            >
                {viewMode === 'Danh sách' && 'Danh sách'}
            </Button>
            <Button
                sx={{
                    backgroundColor: viewMode === 'Lưới' ? '#FFF8E1' : 'transparent',
                    color: viewMode === 'Lưới' ? '#FBC02D' : '#666',
                    borderRadius: 20,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Lưới' ? '#FFECB3' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<GridViewIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => handleViewModeChange('Lưới')}
            >
                {viewMode === 'Lưới' && 'Lưới'}
            </Button>
            <Button
                sx={{
                    backgroundColor: viewMode === 'Sơ đồ' ? '#E0F7FA' : 'transparent',
                    color: viewMode === 'Sơ đồ' ? '#00ACC1' : '#666',
                    borderRadius: 20,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Sơ đồ' ? '#B2EBF2' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<MapIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => handleViewModeChange('Sơ đồ')}
            >
                {viewMode === 'Sơ đồ' && 'Sơ đồ'}
            </Button>
        </Box>
    );

    const renderSchematicView = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 0.9,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
            }}
        >
            {renderViewModeButtons()}
            {renderSearchBar()}
            {renderCommonElements()}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, ml: 'auto' }}>
                <Button
                    sx={{
                        backgroundColor: '#FCE4EC',
                        color: '#EC407A',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#F8BBD0' },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handlePriceTableClick}
                >
                    Bảng giá chung
                </Button>
                <Menu
                    anchorEl={anchorElPriceTable}
                    open={Boolean(anchorElPriceTable)}
                    onClose={handlePriceTableClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem sx={{ fontSize: '0.8rem' }}>Bảng giá chung</MenuItem>
                </Menu>
                <Button
                    sx={{
                        backgroundColor: '#FFEBEE',
                        color: '#E53935',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#FFCDD2' },
                    }}
                    startIcon={<AddIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleBookingOpen}
                >
                    Đặt phòng
                </Button>
            </Box>
        </Box>
    );

    const renderGridView = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 0.9,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
            }}
        >
            {renderViewModeButtons()}
            {renderSearchBar()}
            {renderCommonElements()}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, ml: 'auto' }}>
                <Button
                    sx={{
                        backgroundColor: '#FCE4EC',
                        color: '#EC407A',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#F8BBD0' },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleTimeFilterClick}
                >
                    Thời gian lưu trú
                </Button>
                <Menu
                    anchorEl={anchorElTimeFilter}
                    open={Boolean(anchorElTimeFilter)}
                    onClose={handleTimeFilterClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem sx={{ fontSize: '0.8rem' }}>Thời gian nhàn</MenuItem>
                    <MenuItem sx={{ fontSize: '0.8rem' }}>Thời gian trả</MenuItem>
                </Menu>
                <Button
                    sx={{
                        backgroundColor: '#E3F2FD',
                        color: '#1976d2',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#BBDEFB' },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleTimeFilterClick}
                >
                    Tuần
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 20,
                        padding: '2px 4px',
                    }}
                >
                    <IconButton
                        sx={{ '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' } }}
                    >
                        <ArrowBackIosIcon
                            fontSize="small"
                            sx={{ color: '#1976d2', fontSize: '1rem' }}
                        />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        11/04/2025 - 17/04/2025
                    </Typography>
                    <IconButton
                        sx={{ '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' } }}
                    >
                        <ArrowForwardIosIcon
                            fontSize="small"
                            sx={{ color: '#1976d2', fontSize: '1rem' }}
                        />
                    </IconButton>
                </Box>
                <Button
                    sx={{
                        backgroundColor: '#FFEBEE',
                        color: '#E53935',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#FFCDD2' },
                    }}
                    startIcon={<AddIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleBookingOpen}
                >
                    Đặt phòng
                </Button>
            </Box>
        </Box>
    );

    const renderListView = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 0.9,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
            }}
        >
            {renderViewModeButtons()}
            {renderSearchBar()}
            {renderCommonElements()}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, ml: 'auto' }}>
                <Button
                    sx={{
                        backgroundColor: '#FCE4EC',
                        color: '#EC407A',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#F8BBD0' },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleTimeFilterClick}
                >
                    Thời gian lưu trú
                </Button>
                <Menu
                    anchorEl={anchorElTimeFilter}
                    open={Boolean(anchorElTimeFilter)}
                    onClose={handleTimeFilterClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem sx={{ fontSize: '0.8rem' }}>Thời gian nhàn</MenuItem>
                    <MenuItem sx={{ fontSize: '0.8rem' }}>Thời gian trả</MenuItem>
                </Menu>
                <Button
                    sx={{
                        backgroundColor: '#E3F2FD',
                        color: '#1976d2',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#BBDEFB' },
                    }}
                    endIcon={<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleTimeFilterClick}
                >
                    Tuần
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 20,
                        padding: '2px 4px',
                    }}
                >
                    <IconButton
                        sx={{ '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' } }}
                    >
                        <ArrowBackIosIcon
                            fontSize="small"
                            sx={{ color: '#1976d2', fontSize: '1rem' }}
                        />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        11/04/2025 - 17/04/2025
                    </Typography>
                    <IconButton
                        sx={{ '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' } }}
                    >
                        <ArrowForwardIosIcon
                            fontSize="small"
                            sx={{ color: '#1976d2', fontSize: '1rem' }}
                        />
                    </IconButton>
                </Box>
                <Button
                    sx={{
                        backgroundColor: '#FFEBEE',
                        color: '#E53935',
                        borderRadius: 20,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        height: '28px',
                        '&:hover': { backgroundColor: '#FFCDD2' },
                    }}
                    startIcon={<AddIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={handleBookingOpen}
                >
                    Đặt phòng
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1, mt: 0 }}>
            {viewMode === 'Sơ đồ' && renderSchematicView()}
            {viewMode === 'Lưới' && renderGridView()}
            {viewMode === 'Danh sách' && renderListView()}
            {/* Booking Dialog */}
            <Dialog
                open={bookingOpen}
                TransitionComponent={BookingTransition}
                keepMounted
                onClose={handleBookingClose}
                aria-describedby="booking-dialog-slide-description"
            >
                <DialogTitle>{"Xác nhận đặt phòng?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="booking-dialog-slide-description">
                        Vui lòng xác nhận thông tin đặt phòng. Bạn có muốn tiếp tục đặt phòng này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBookingClose}>Hủy</Button>
                    <Button onClick={handleBookingClose}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
            {/* Filter Dialog */}
            <Dialog
                open={filterOpen}
                onClose={handleFilterClose}
                TransitionComponent={FilterTransition}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '42.86%', // 3/7 màn hình
                        maxWidth: 'none',
                        height: '100%',
                        margin: 0,
                        position: 'fixed',
                        right: 0,
                        borderRadius: 0,
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                    },
                }}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: '#1976d2' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFilterClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Bộ lọc
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFilterClose}>
                            Lưu
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItemButton>
                        <ListItemText primary="Trạng thái phòng" secondary="Trống" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText primary="Loại phòng" secondary="VIP" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText primary="Giá phòng" secondary="Dưới 1 triệu" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText primary="Tầng" secondary="Tầng 5" />
                    </ListItemButton>
                </List>
            </Dialog>
        </Box>
    );
}

const AddIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
);

// Phần EmployedView giữ nguyên
export default function EmployedView() {
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef(null);

    const handleToggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#2aa24f', borderRadius: '8px', height: 50 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box display="flex" alignItems="center">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer',
                                    borderRadius: 20,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
                                    <g fill="#64892f">
                                        <path d="m28.7 60.6l3-4.2s-1.5-1-2.4-1.1s-2.6.4-2.6.4z" />
                                        <path d="m34.3 60.1l1.8-5s-1.7-.5-2.6-.3s-2.3 1.2-2.3 1.2z" />
                                        <path
                                            d="m39.5 58.9l1.3-5.2s-1.7-.2-2.6 0c-.9.3-2.2 1.6-2.2 1.6zm18.3-13l-2-4.9s-1.5 1.1-2 1.9s-.8 2.8-.8 2.8zm3.1-7.9l-3.3-3.9s-1.1 1.5-1.3 2.5s0 2.9 0 2.9zm1.1-9.4l-4.2-2.7s-.7 1.8-.6 2.8c0 1 .8 2.8.8 2.8zm-1.3-8.8L56 18.6s-.1 2 .2 2.9s1.5 2.4 1.5 2.4zm-2.9-7.4l-4.8-.5s.1 2 .4 2.9c.4.9 1.7 2.2 1.7 2.2zm-4.4-6.3l-4.5 1.8s.8 1.7 1.5 2.4c.7.6 2.4 1.1 2.4 1.1z"
                                        />
                                    </g>
                                    <path
                                        fill="#769e2a"
                                        d="M26.4 44.7c-2-9.3-13.2-2.7-13 4.7c.1 4.4-13.5 7.1-.2 7.1c3.1 0 5.4.6 6-5.6c.2-2.2 9.4 3.7 7.2-6.2"
                                    />
                                    <path
                                        fill="#83b533"
                                        d="M51 8.7c2.1.6 12.4 19.8 4.6 34.6C43 66.9 7.4 63.5 4.8 38.5c-1.4-13.2 5.3-12.7 5.3-9c-3.1-1.1-2.5 9.8 2.3 12.7c10.9 6.6 19.9-2 23-7.6c3.1-5.7.5-12.7.5-15.5S51 8.7 51 8.7"
                                    />
                                    <path
                                        fill="#ffd93b"
                                        d="M14.1 45.2C29.2 55.9 41.7 42 46 32.7c3.6-7.7 1.7-16.8.9-22.3c-4.5 2.5-11.2 6.5-11.2 8.3c0 2.7 2.7 9.8-.5 15.5S18.9 48.7 10 39.4c.9 2.1 2.6 4.7 4.1 5.8"
                                    />
                                    <g fill="#8cc63e">
                                        <path
                                            d="M53.5 48.2c-1.6-7.1-3.8-12-6.3-10.6s.6 10.1-2.9 15.8c-5.7 9.2 1.9 2.5 5.4 4.5c13.2 7.3 5.9-.4 3.8-9.7"
                                        />
                                        <path
                                            d="M54 49.3c-2.2-4.8-4.4-7.9-6-6.2s1.9 13.7 4.7 14.2c10.5 2.1 4.2-1.7 1.3-8"
                                        />
                                    </g>
                                    <path
                                        fill="#d3b226"
                                        d="M36.8 27.1c1.8-.8 7.4-1.7 11-.6m-11.8 6c1.9-.3 5.6.2 9 2.1m-13.4 3.9c1.9.1 4.9 1 7.9 3.7M25.9 42c1.8.8 3.3 2.3 5.4 5.9M18 43.4s1 .4 1.5 4.6"
                                    />
                                    <path
                                        fill="#769e2a"
                                        d="M34.7 37.6c0 1.4-.5 2.7-2 2.7s-2.8-1.1-2.8-2.5s2.8-3.8 4.3-3.8s.5 2.2.5 3.6"
                                    />
                                    <path
                                        fill="#8cc63e"
                                        d="M33.9 49.1c-2.2-10.2-14-3-13.8 5.2c.1 4.9-14.4 7.7-.2 7.7c3.3 0 5.7.7 6.3-6.2c.2-2.4 10 4.1 7.7-6.7"
                                    />
                                    <path
                                        fill="#64892f"
                                        d="m2 34.6l3.6 2.5s.6-1.6.6-2.5s-.6-2.5-.6-2.5zm.8 6.5l4 1.5s.3-1.7.1-2.6s-1.1-2.3-1.1-2.3zm2.1 6.2l4.2.5s-.1-1.7-.4-2.5s-1.5-1.9-1.5-1.9zm3.2 6.3l4.8-.7s-.5-1.9-1-2.7s-2.1-1.7-2.1-1.7zm5.8 5.2l4.3-2.4s-1-1.6-1.7-2.2c-.7-.5-2.5-.9-2.5-.9z"
                                    />
                                    <path
                                        fill="#83b533"
                                        d="M50.6 11c1.9 1.8 6.1 6.3 3.7 10.2s-12.8 7.1-23.4 4.3S6 16.8 5.5 14.4s1.1-2.4 2.2-1.6S50.6 11 50.6 11"
                                    />
                                    <ellipse cx="38.6" cy="7.6" fill="#8cc63e" rx="5.4" ry="5.6" />
                                    <ellipse cx="38.6" cy="7.6" fill="#fff" rx="4.4" ry="4.6" />
                                    <ellipse cx="38.6" cy="7.6" fill="#3e4347" rx="3.1" ry="3.3" />
                                    <path
                                        fill="#e8f94b"
                                        d="M7 12.1v3.3l2.2-1.2l.2 2.5l2-1.7l.9 3.4l2.6-2.1l1.3 3.6l3-2.5l1.7 4.3l5.3-3.7l.4 5.3l3.8-3.4l1.9 4.8l3.4-4.5l2.6 5.2l3.2-5.2l2.8 5.1l1.8-5.3l3.9 3.4l-.4-4.8l4.4 1.2l-3.4-4.8l2.6-.2l-2.7-2.7l-17.2 4.5l-17.4-2.4z"
                                    />
                                    <path
                                        fill="#8cc63e"
                                        d="M9.8 8.6c0 2.5-.7 2.4-1.6 2.4s-1.6.1-1.6-2.4c0-1.4.7-2.4 1.6-2.4c.9-.1 1.6 1 1.6 2.4"
                                    />
                                    <ellipse cx="7.7" cy="8.6" fill="#4b662b" rx=".6" ry="1.7" />
                                    <g fill="#8cc63e">
                                        <path
                                            d="M4.5 10.7c-.3-6.3 16.2 6 36.9-2.3c5-2 9.8-.1 10.1 6.1c.3 6.3-4.1 7.1-9.5 7.8c-5.6.8-37.2-5.3-37.5-11.6"
                                        />
                                        <path
                                            d="M14.8 9.9c0 3.7-1 3.6-2.3 3.6s-2.3.1-2.3-3.6c0-2 1-3.6 2.3-3.6c1.2 0 2.3 1.6 2.3 3.6"
                                        />
                                    </g>
                                    <ellipse cx="12" cy="9.9" fill="#4b662b" rx="1.3" ry="2.6" />
                                    <ellipse cx="46.1" cy="7.6" fill="#8cc63e" rx="5.4" ry="5.6" />
                                    <ellipse cx="46.1" cy="7.6" fill="#fff" rx="4.4" ry="4.6" />
                                    <ellipse cx="46.1" cy="7.6" fill="#3e4347" rx="3.1" ry="3.3" />
                                </svg>
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="#0B2B4B" ml={1}>
                                MH370
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'left', gap: 2, marginLeft: 2, fontSize: 13 }}>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'white',
                                    borderRadius: 50,
                                    height: 34,
                                    width: 150,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        backgroundColor: '#be91ff',
                                    },
                                }}
                            >
                                <CalendarTodayIcon sx={{ color: '#2aa24f', height: 18 }} />
                                <Typography variant="body2" sx={{ fontSize: 13, color: '#2aa24f', fontWeight: 600 }}>
                                    Lịch đặt phòng
                                </Typography>
                            </IconButton>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13 }}>
                                <ReceiptIcon fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Hóa đơn bán lẻ
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13 }}>
                                <CalendarTodayIcon fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Chờ xác nhận
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton size="large" color="inherit">
                            <Badge badgeContent={2} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                                Chi nhánh trung tâm
                            </Typography>
                        </Box>

                        <Typography sx={{ fontWeight: 'bold' }}>0869931792</Typography>

                        <IconButton sx={{ p: 0 }}>
                            <AccountCircle fontSize="large" />
                        </IconButton>

                        <IconButton color="inherit" onClick={handleToggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Box>
            </AppBar>

            <RoomBookingView />

            {showMenu && (
                <Box
                    ref={menuRef}
                    sx={{
                        position: 'absolute',
                        top: 60,
                        right: 20,
                        width: 250,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: 3,
                        zIndex: 1300,
                        py: 1,
                        maxHeight: 400,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '5px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f0f0f0',
                        },
                    }}
                >
                    <MenuItem>
                        <ManageAccountsIcon fontSize="small" sx={{ mr: 1 }} /> Quản lý
                    </MenuItem>

                    <Box sx={{ px: '10px' }}>
                        <Divider sx={{ my: 1, backgroundColor: '#ccc' }} />
                    </Box>

                    <MenuItem>
                        <HotelIcon fontSize="small" sx={{ mr: 1 }} /> Buồng phòng
                    </MenuItem>
                    <MenuItem>
                        <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                        Kết nối lịch Airbnb
                        <Chip label="Mới" size="small" color="success" sx={{ ml: 1 }} />
                    </MenuItem>
                    <MenuItem>
                        <PeopleIcon fontSize="small" sx={{ mr: 1 }} /> Khách lưu trú
                    </MenuItem>
                    <MenuItem>
                        <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> Lập phiếu thu
                    </MenuItem>

                    <Box sx={{ px: '10px' }}>
                        <Divider sx={{ my: 1, backgroundColor: '#ccc' }} />
                    </Box>

                    <MenuItem>
                        <ListAltIcon fontSize="small" sx={{ mr: 1 }} /> Báo cáo lễ tân
                    </MenuItem>
                    <MenuItem>
                        <ListAltIcon fontSize="small" sx={{ mr: 1 }} /> Báo cáo cuối ngày
                    </MenuItem>
                    <MenuItem>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Tùy chọn hiển thị
                    </MenuItem>
                    <MenuItem>
                        <FeedbackIcon fontSize="small" sx={{ mr: 1 }} /> Góp ý cho KiotViet
                    </MenuItem>

                    <Box sx={{ px: '10px' }}>
                        <Divider sx={{ my: 1, backgroundColor: '#ccc' }} />
                    </Box>

                    <MenuItem>
                        <SupportAgentIcon fontSize="small" sx={{ mr: 1 }} />
                        Hỗ trợ:
                        <Typography sx={{ fontWeight: 600, ml: 1, color: 'green' }}>1900 6522</Typography>
                    </MenuItem>
                    <MenuItem sx={{ color: 'red' }}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Đăng xuất
                    </MenuItem>
                </Box>
            )}
        </Box>
    );
}