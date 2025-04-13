import { AppBar, Box, IconButton, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from '@mui/material/Badge';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function AppBarHeader({ onToggleMenu }) {
    return (
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
                                {/* SVG content giữ nguyên */}
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

                    <IconButton color="inherit" onClick={onToggleMenu}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>
        </AppBar>
    );
}