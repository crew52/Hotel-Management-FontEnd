import React from 'react';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '../common/AddIcon';

export default function ActionButtons({
                                          onFilterOpen,
                                          anchorElPriceTable,
                                          onPriceTableClick,
                                          onPriceTableClose,
                                          onBookingOpen,
                                      }) {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
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
                    onClick={onPriceTableClick}
                >
                    Bảng giá chung
                </Button>
                <Menu
                    anchorEl={anchorElPriceTable}
                    open={Boolean(anchorElPriceTable)}
                    onClose={onPriceTableClose}
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
                    onClick={onBookingOpen}
                >
                    Đặt phòng
                </Button>
            </Box>
        </>
    );
}