import React from 'react';
import { Box, Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';

export default function ViewModeButtons({ viewMode, onViewModeChange }) {
        return (
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
                        onClick={() => onViewModeChange('Danh sách')}
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
                        onClick={() => onViewModeChange('Lưới')}
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
                        onClick={() => onViewModeChange('Sơ đồ')}
                    >
                            {viewMode === 'Sơ đồ' && 'Sơ đồ'}
                    </Button>
            </Box>
        );
}