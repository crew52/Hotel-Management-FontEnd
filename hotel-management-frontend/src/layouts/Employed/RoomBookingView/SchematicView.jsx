import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomViewService from '../../../services/employee/room.service.js';

export default function SchematicView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [rooms, setRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await RoomViewService.getAllRoomView();
                const roomData = res.data.content || [];
                setRooms(roomData);
                setAllRooms(roomData);
            } catch (err) {
                console.error('Không thể tải danh sách phòng:', err);
            }
        };
        fetchRooms();
    }, []);

    const handleSearchClick = (event) => {
        setAnchorElSearch(event.currentTarget);
    };

    const handleSearchClose = () => {
        setAnchorElSearch(null);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handlePriceTableClick = (event) => {
        setAnchorElPriceTable(event.currentTarget);
    };

    const handlePriceTableClose = () => {
        setAnchorElPriceTable(null);
    };

    const getStatusLabelAndColor = (status, isClean) => {
        if (status === 'CHECKOUT_SOON') {
            return { label: 'Chưa dọn', color: 'error' };
        }
        return { label: isClean ? 'Đã dọn' : 'Chưa dọn', color: isClean ? 'success' : 'error' };
    };

    const getRoomStatusCounts = () => {
        const counts = {
            soonCheckIn: 0,
            inUse: 0,
            soonCheckOut: 0,
            overdue: 0,
            available: 0,
            maintenance: 0,
        };

        allRooms.forEach((room) => {
            switch (room.status) {
                case 'AVAILABLE': counts.available += 1; break;
                case 'UPCOMING': counts.soonCheckIn += 1; break;
                case 'IN_USE': counts.inUse += 1; break;
                case 'CHECKOUT_SOON': counts.soonCheckOut += 1; break;
                case 'MAINTENANCE': counts.maintenance += 1; break;
                case 'OVERDUE': counts.overdue += 1; break;
                default: break;
            }
        });

        return counts;
    };

    const getRoomBackgroundColor = (status) => {
        switch (status) {
            case 'IN_USE': return 'rgba(87,214,96,0.71)';
            case 'CHECKOUT_SOON': return '#FFFFFF';
            case 'AVAILABLE': return '#FFFFFF';
            default: return '#FFFFFF';
        }
    };

    const handleStatusFilter = async (status) => {
        try {
            const response = await RoomViewService.searchRoomView({ status });
            const roomData = response.data.content || [];
            setRooms(roomData);
        } catch (error) {
            console.error('Error filtering rooms:', error);
        }
    };

    const statusCounts = getRoomStatusCounts();

    return (
        <Box sx={{ flexGrow: 1 }}>
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
                <ViewModeButtons viewMode="Sơ đồ" onViewModeChange={onViewModeChange} />
                <SearchBar
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    anchorEl={anchorElSearch}
                    onSearchClick={handleSearchClick}
                    onSearchClose={handleSearchClose}
                />
                <ActionButtons
                    onFilterOpen={onFilterOpen}
                    anchorElPriceTable={anchorElPriceTable}
                    onPriceTableClick={handlePriceTableClick}
                    onPriceTableClose={handlePriceTableClose}
                    onBookingOpen={onBookingOpen}
                />
            </Box>

            <Box
                sx={{
                    mt: 1,
                    p: 2,
                    backgroundColor: '#E0F7FA',
                    borderRadius: 2,
                    height: 600,
                    overflowY: 'auto',
                }}
            >
                {rooms.length > 0 ? (
                    <>
                        <StatusBar
                            statusCounts={statusCounts}
                            variant="schematic"
                            onStatusFilter={handleStatusFilter}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                            {rooms.map((room) => {
                                const statusInfo = getStatusLabelAndColor(room.status, room.isClean);
                                const backgroundColor = getRoomBackgroundColor(room.status);
                                const roomCategory = room.roomCategory || {};
                                return (
                                    <Card
                                        key={room.id}
                                        sx={{
                                            borderRadius: 4,
                                            position: 'relative',
                                            backgroundColor: backgroundColor,
                                            color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            border: '1px solid #e0e0e0',
                                        }}
                                    >
                                        <CardContent sx={{ p: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Chip
                                                    label={statusInfo.label}
                                                    color={statusInfo.color}
                                                    size="small"
                                                    sx={{
                                                        color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF',
                                                        backgroundColor: backgroundColor === '#FFFFFF' ? undefined : 'rgba(0, 0, 0, 0.2)',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                                <IconButton size="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        textAlign: 'left',
                                                        color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    {roomCategory.code || 'N/A'}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 1,
                                                    color: backgroundColor === '#FFFFFF' ? '#757575' : '#FFFFFF',
                                                    fontSize: '0.9rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {roomCategory.name || 'Không có loại phòng'}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: backgroundColor === '#FFFFFF' ? '#757575' : '#FFFFFF',
                                                    fontSize: '0.8rem',
                                                    fontStyle: 'italic',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {roomCategory.description || 'Không có mô tả'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                    >
                                                        {roomCategory.hourlyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <WbSunnyIcon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                    >
                                                        {roomCategory.dailyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Brightness2Icon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                    >
                                                        {roomCategory.overnightPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1">Không có dữ liệu phòng để hiển thị.</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}