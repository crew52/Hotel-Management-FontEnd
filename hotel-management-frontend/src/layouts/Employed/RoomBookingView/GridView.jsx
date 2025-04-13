import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterListIcon from '@mui/icons-material/FilterList';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '../common/AddIcon';
import PropTypes from 'prop-types';

export default function GridView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const [anchorElTimeFilter, setAnchorElTimeFilter] = React.useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState('');

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

    const handlePreviousWeek = () => {
        console.log('Điều hướng đến tuần trước');
    };

    const handleNextWeek = () => {
        console.log('Điều hướng đến tuần sau');
    };

    return (
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

            <ViewModeButtons viewMode="Lưới" onViewModeChange={onViewModeChange} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mx: 2 }}>
                {/* 1. Thanh tìm kiếm */}
                <SearchBar
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    anchorEl={anchorElSearch}
                    onSearchClick={handleSearchClick}
                    onSearchClose={handleSearchClose}
                />


                <IconButton
                    sx={{
                        backgroundColor: '#e0e0e0',
                        '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' },
                    }}
                    onClick={onFilterOpen}
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

                {/* 4. Tuần */}
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

                {/* 5. Ngày tháng */}
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
                        onClick={handlePreviousWeek}
                    >
                        <ArrowBackIosIcon fontSize="small" sx={{ color: '#1976d2', fontSize: '1rem' }} />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        11/04/2025 - 17/04/2025
                    </Typography>
                    <IconButton
                        sx={{ '&:hover': { backgroundColor: '#d0d0d0', padding: '4px' } }}
                        onClick={handleNextWeek}
                    >
                        <ArrowForwardIosIcon fontSize="small" sx={{ color: '#1976d2', fontSize: '1rem' }} />
                    </IconButton>
                </Box>
            </Box>


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

                {/* 7. Đặt phòng */}
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
                    onClick={onBookingOpen}
                >
                    Đặt phòng
                </Button>
            </Box>
        </Box>
    );
}

GridView.propTypes = {
    onBookingOpen: PropTypes.func.isRequired,
    onFilterOpen: PropTypes.func.isRequired,
    onViewModeChange: PropTypes.func.isRequired,
};