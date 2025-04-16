import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchematicView from './SchematicView';
import GridView from './GridView';
import ListView from './ListView';
import BookingDialog from './BookingDialog';
import FilterDialog from './FilterDialog';
import useRoomBooking from "../hooks/useRoomBooking.js";

export default function RoomBookingView() {
    const {
        viewMode,
        bookingOpen,
        filterOpen,
        handleViewModeChange,
        handleBookingOpen,
        handleBookingClose,
        handleFilterOpen,
        handleFilterClose,
    } = useRoomBooking();

    // State để lưu trữ danh sách phòng
    const [rooms, setRooms] = useState([]);

    // Hàm để cập nhật danh sách phòng
    const handleRoomsUpdate = (roomData) => {
        setRooms(roomData);
    };

    // Định nghĩa màu nền cho từng chế độ xem
    const getBackgroundColor = () => {
        switch (viewMode) {
            case 'Sơ đồ':
                return '#E0F7FA';
            case 'Danh sách':
                return '#FFF8E1';
            case 'Lưới':
                return '#E8F5E9';
            default:
                return '#FFFFFF';
        }
    };

    // Xác định trạng thái và màu sắc của phòng
    const getStatusLabelAndColor = (status, isClean) => {
        if (status === 'CHECKOUT_SOON') {
            return { label: 'Chưa dọn', color: 'error' };
        }
        return { label: isClean ? 'Đã dọn' : 'Chưa dọn', color: isClean ? 'success' : 'error' };
    };


    const getBookingData = (room, index) => {
        return {
            stt: index + 1,
            bookingCode: `DP${room.id.toString().padStart(6, '0')}`, // Giả lập mã đặt phòng
            channelCode: "", // Không có dữ liệu
            room: `P.${room.id.toString().padStart(3, '0')}`,
            customer: "Khách lẻ\nNhập ghi chú",
            checkInTime: "",
            checkOutTime: "",
            total: room.roomCategory.dailyPrice.toLocaleString(),
            paid: "0",
            action: getActionButton(statusToAction(room.status, room.isClean)),
        };
    };

    // Xác định hành động dựa trên trạng thái phòng
    const statusToAction = (status, isClean) => {
        if (status === 'CHECKOUT_SOON') return 'CHECKOUT';
        if (status === 'AVAILABLE' && isClean) return 'CHECKIN';
        return 'PAYMENT'; // Mặc định
    };

    // Tạo nút hành động với màu sắc tương ứng
    const getActionButton = (action) => {
        switch (action) {
            case 'CHECKIN':
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Nhận phòng</Button>;
            case 'CHECKOUT':
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#2196F3', color: '#fff' }}>Trả phòng</Button>;
            case 'PAYMENT':
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#FF9800', color: '#fff' }}>Thanh toán</Button>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 0 }}>
            {viewMode === 'Sơ đồ' && (
                <SchematicView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                    onRoomsUpdate={handleRoomsUpdate}
                />
            )}
            {viewMode === 'Lưới' && (
                <GridView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                    onRoomsUpdate={handleRoomsUpdate}
                />
            )}
            {viewMode === 'Danh sách' && (
                <ListView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                    onRoomsUpdate={handleRoomsUpdate}
                />
            )}

            {/* Box hiển thị nội dung theo chế độ xem */}
            <Box
                sx={{
                    mt: 1,
                    p: 2,
                    backgroundColor: getBackgroundColor(),
                    borderRadius: 2,
                    height: 600,
                    overflowY: 'auto', // Thêm thanh cuộn nếu nội dung dài
                }}
            >
                {viewMode === 'Sơ đồ' && rooms.length > 0 ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 2,
                        }}
                    >
                        {rooms.map((room) => {
                            const statusInfo = getStatusLabelAndColor(room.status, room.isClean);

                            return (
                                <Card key={room.id} sx={{ borderRadius: 2, position: 'relative' }}>
                                    <CardContent sx={{ p: 1.5 }}>
                                        {/* Hàng 1: Trạng thái và biểu tượng ba chấm */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={statusInfo.label}
                                                color={statusInfo.color}
                                                size="small"
                                            />
                                            <IconButton size="small">
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>

                                        {/* Hàng 2: Số phòng */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                                P.{room.id.toString().padStart(3, '0')}
                                            </Typography>
                                        </Box>

                                        {/* Loại phòng */}
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {room.roomCategory.name}
                                        </Typography>

                                        {/* Giá tiền */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {room.roomCategory.hourlyPrice.toLocaleString()}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <WbSunnyIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {room.roomCategory.dailyPrice.toLocaleString()}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Brightness2Icon fontSize="small" />
                                                <Typography variant="body2">
                                                    {room.roomCategory.overnightPrice.toLocaleString()}đ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                ) : viewMode === 'Danh sách' && rooms.length > 0 ? (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="booking table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã đặt phòng</TableCell>
                                    <TableCell>Mã kênh bán</TableCell>
                                    <TableCell>Phòng</TableCell>
                                    <TableCell>Khách đặt</TableCell>
                                    <TableCell>Giờ nhận</TableCell>
                                    <TableCell>Giờ trả</TableCell>
                                    <TableCell>Tổng cộng</TableCell>
                                    <TableCell>Khách đã trả</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room, index) => {
                                    const bookingData = getBookingData(room, index);
                                    return (
                                        <TableRow key={room.id}>
                                            <TableCell>{bookingData.stt}</TableCell>
                                            <TableCell>{bookingData.bookingCode}</TableCell>
                                            <TableCell>{bookingData.channelCode}</TableCell>
                                            <TableCell>{bookingData.room}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'pre-line' }}>{bookingData.customer}</TableCell>
                                            <TableCell>{bookingData.checkInTime}</TableCell>
                                            <TableCell>{bookingData.checkOutTime}</TableCell>
                                            <TableCell>{bookingData.total}đ</TableCell>
                                            <TableCell>{bookingData.paid}đ</TableCell>
                                            <TableCell>{bookingData.action}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : viewMode === 'Lưới' && rooms.length > 0 ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 2,
                        }}
                    >
                        {rooms.map((room, index) => {
                            const bookingData = getBookingData(room, index);
                            const statusInfo = getStatusLabelAndColor(room.status, room.isClean);

                            return (
                                <Card key={room.id} sx={{ borderRadius: 2, position: 'relative' }}>
                                    <CardContent sx={{ p: 1.5 }}>
                                        {/* Hàng 1: Trạng thái và biểu tượng ba chấm */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={statusInfo.label}
                                                color={statusInfo.color}
                                                size="small"
                                            />
                                            <IconButton size="small">
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>

                                        {/* Hàng 2: Thông tin đặt phòng */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Mã đặt phòng: {bookingData.bookingCode}
                                            </Typography>
                                            <Typography variant="body2">
                                                Phòng: {bookingData.room}
                                            </Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                Khách đặt: {bookingData.customer}
                                            </Typography>
                                            <Typography variant="body2">
                                                Giờ nhận: {bookingData.checkInTime}
                                            </Typography>
                                            <Typography variant="body2">
                                                Giờ trả: {bookingData.checkOutTime}
                                            </Typography>
                                            <Typography variant="body2">
                                                Tổng cộng: {bookingData.total}đ
                                            </Typography>
                                            <Typography variant="body2">
                                                Khách đã trả: {bookingData.paid}đ
                                            </Typography>
                                        </Box>

                                        {/* Hàng 3: Nút hành động */}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {bookingData.action}
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1">
                            {(viewMode === 'Sơ đồ' || viewMode === 'Danh sách' || viewMode === 'Lưới')
                                ? 'Không có dữ liệu phòng để hiển thị.'
                                : `Đây là box của chế độ ${viewMode}`}
                        </Typography>
                    </Box>
                )}
            </Box>

            <BookingDialog open={bookingOpen} onClose={handleBookingClose} />
            <FilterDialog open={filterOpen} onClose={handleFilterClose} />
        </Box>
    );
}