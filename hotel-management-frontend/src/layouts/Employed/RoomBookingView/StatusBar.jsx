import React from 'react';
import { Box, Typography } from '@mui/material';

export function StatusBar({ statusCounts, variant, onStatusFilter }) {
    const schematicStatusItems = [
        { label: 'Chờ xác nhận', key: 'pendingConfirmation', color: '#1976D2', apiStatus: 'PENDING_CONFIRMATION', filterable: true },
        { label: 'Đã đặt trước', key: 'preBooked', color: '#D7CCC8', apiStatus: 'RESERVED', filterable: true },
        { label: 'Sắp nhận', key: 'soonCheckIn', color: '#FF9800', apiStatus: 'UPCOMING', filterable: true },
        { label: 'Đang sử dụng', key: 'inUse', color: '#4CAF50', apiStatus: 'OCCUPIED', filterable: true },
        { label: 'Sắp trả', key: 'soonCheckOut', color: '#0288D1', apiStatus: 'CHECKOUT_SOON', filterable: true },
        { label: 'Quá giờ trả', key: 'overdue', color: '#00ACC1', apiStatus: 'OVERDUE', filterable: true },
        { label: 'Đang trống', key: 'available', color: '#B0BEC5', apiStatus: 'AVAILABLE', filterable: true },
        { label: 'Đang dọn dẹp', key: 'cleaning', color: '#FBC02D', apiStatus: 'CLEANING', filterable: true },
        { label: 'Bảo trì', key: 'maintenance', color: '#E53935', apiStatus: 'MAINTENANCE', filterable: true },
        { label: 'Không khả dụng', key: 'unavailable', color: '#9E9E9E', apiStatus: 'UNAVAILABLE', filterable: true },
    ];

    const listGridStatusItems = [
        { label: 'Chờ xác nhận', key: 'pendingConfirmation', color: '#1976D2', apiStatus: 'PENDING_CONFIRMATION', filterable: true },
        { label: 'Đã trả', key: 'checkedOut', color: '#666', apiStatus: 'CHECKED_OUT', filterable: true },
        { label: 'Đã đặt trước', key: 'preBooked', color: '#D7CCC8', apiStatus: 'RESERVED', filterable: true },
        { label: 'Sắp nhận', key: 'soonCheckIn', color: '#FF9800', apiStatus: 'UPCOMING', filterable: true },
        { label: 'Đang sử dụng', key: 'inUse', color: '#4CAF50', apiStatus: 'OCCUPIED', filterable: true },
        { label: 'Sắp trả', key: 'soonCheckOut', color: '#0288D1', apiStatus: 'CHECKOUT_SOON', filterable: true },
        { label: 'Quá giờ trả', key: 'overdue', color: '#00ACC1', apiStatus: 'OVERDUE', filterable: true },
        { label: 'Chờ tạo hóa đơn', key: 'pendingInvoice', color: '#26C6DA', apiStatus: 'PENDING_INVOICE', filterable: true },
        { label: 'Đang trống', key: 'available', color: '#B0BEC5', apiStatus: 'AVAILABLE', filterable: true },
        { label: 'Đang dọn dẹp', key: 'cleaning', color: '#FBC02D', apiStatus: 'CLEANING', filterable: true },
        { label: 'Bảo trì', key: 'maintenance', color: '#E53935', apiStatus: 'MAINTENANCE', filterable: true },
        { label: 'Không khả dụng', key: 'unavailable', color: '#9E9E9E', apiStatus: 'UNAVAILABLE', filterable: true },
    ];

    const statusItems = variant === 'schematic' ? schematicStatusItems : listGridStatusItems;

    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {statusItems.map((item) => (
                <Box
                    key={item.key}
                    onClick={() => item.filterable && onStatusFilter(item.apiStatus)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: variant === 'schematic' ? "#f7fcff" : "#fff",
                        p: 1,
                        borderRadius: 30,
                        border: variant === 'schematic' ? 'none' : '1px solid #e0e0e0',
                        cursor: item.filterable ? 'pointer' : 'default',
                        '&:hover': item.filterable ? { backgroundColor: '#f0f0f0' } : {},
                    }}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                        }}
                    />
                    <Typography variant="body2">
                        {item.label} ({statusCounts[item.key]})
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}