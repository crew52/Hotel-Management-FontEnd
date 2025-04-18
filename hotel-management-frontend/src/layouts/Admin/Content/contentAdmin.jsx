import React from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress,
    Link,
} from "@mui/material";
import { Person, ArrowDropDown, OpenInNew } from "@mui/icons-material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useState, useEffect } from "react";
import api from "../../../services";

function ContentAdmin() {
    const formatNumber = (num) => {
        if (num === undefined || num === null) return "";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // State for activity logs and users
    const [activityLogs, setActivityLogs] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch activity logs
    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                setLoading(true);
                const response = await api.getActivityLogs();
                console.log('Activity logs response:', response.data);
                const logs = response.data || [];
                
                // Sort logs by date and time (most recent first)
                const sortedLogs = [...logs].sort((a, b) => {
                    if (!a.date || !a.time || !b.date || !b.time) return 0;
                    
                    // Compare years
                    const [dayA, monthA, yearA] = a.date.split("-").map(Number);
                    const [dayB, monthB, yearB] = b.date.split("-").map(Number);
                    
                    if (yearA !== yearB) return yearB - yearA;
                    
                    // Compare months
                    if (monthA !== monthB) return monthB - monthA;
                    
                    // Compare days
                    if (dayA !== dayB) return dayB - dayA;
                    
                    // Compare times
                    const [hourA, minuteA, secondA] = a.time.split(":").map(Number);
                    const [hourB, minuteB, secondB] = b.time.split(":").map(Number);
                    
                    if (hourA !== hourB) return hourB - hourA;
                    if (minuteA !== minuteB) return minuteB - minuteA;
                    return secondB - secondA;
                });
                
                setActivityLogs(sortedLogs);
                
                // Extract unique user IDs from logs
                const userIds = [...new Set(logs.map(log => {
                    // Handle case where log might have user_id or user object
                    return log.user?.id || log.userId || log.user_id;
                }).filter(id => id))];
                
                // Fetch usernames if we only have IDs
                if (userIds.length > 0) {
                    try {
                        // Attempt to fetch users if needed, or construct a mapping
                        const userMap = {};
                        
                        // Method 1: If we already have user objects in the logs
                        logs.forEach(log => {
                            if (log.user && log.user.id && log.user.username) {
                                userMap[log.user.id] = log.user.username;
                            }
                        });
                        
                        // Method 2: If we need to fetch users by ID
                        // This is a fallback if users aren't included in the logs
                        const missingUserIds = userIds.filter(id => !userMap[id]);
                        if (missingUserIds.length > 0) {
                            // For now, we'll just use a placeholder
                            missingUserIds.forEach(id => {
                                userMap[id] = `User ${id}`;
                            });
                        }
                        
                        setUsers(userMap);
                    } catch (userErr) {
                        console.error("Error fetching user details:", userErr);
                    }
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching activity logs:", err);
                setError("Failed to load activity logs");
                setLoading(false);
            }
        };

        fetchActivityLogs();
        
        // Set up refresh interval (every 30 seconds)
        const intervalId = setInterval(() => {
            fetchActivityLogs();
        }, 30000);
        
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Get username from user ID
    const getUserName = (log) => {
        if (log.username) {
            return log.username;
        }
        
        // Try different possible structures
        if (log.user && log.user.username) {
            return log.user.username;
        }
        
        const userId = log.user?.id || log.userId || log.user_id;
        if (userId && users[userId]) {
            return users[userId];
        }
        
        return log.fullName || "Unknown";
    };

    // Hàm tính toán thời gian đã trôi qua
    const calculateElapsedTime = (log) => {
        if (!log || !log.date || !log.time) return "Không xác định";
        
        // Định dạng: date là "17-04-2025", time là "22:04:50"
        const [day, month, year] = log.date.split("-").map(Number);
        const [hour, minute, second] = log.time.split(":").map(Number);
        
        // Tạo đối tượng Date từ các trường riêng biệt
        const logDateTime = new Date(year, month-1, day, hour, minute, second);
        const now = new Date();
        
        // Tính khoảng thời gian chênh lệch (tính bằng giây)
        const diffInSeconds = Math.floor((now - logDateTime) / 1000);
        
        // Chuyển đổi thành định dạng thân thiện
        const days = Math.floor(diffInSeconds / (3600 * 24));
        const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        
        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return "Vừa xong";
    };
    
    // Các màu chủ đạo của KiotViet
    const colors = {
        primary: "#0078d4", // Màu xanh chính
        background: "#f5f5f5", // Màu nền
        border: "#e0e0e0", // Màu viền
        text: {
            primary: "#333333", // Màu chữ chính
            secondary: "#666666", // Màu chữ phụ
            blue: "#0078d4", // Màu chữ xanh
        }
    };
    
    // Mock hoạt động gần đây để giống KiotViet
    const mockActivities = [
        { name: "Hoàng Long", action: "vừa tạo hóa đơn", value: 60732000, time: "12 giờ tại" },
        { name: "Hoàng Long", action: "vừa tạo hóa đơn", value: 41400000, time: "11 giờ tại" },
        { name: "Mai Hương", action: "vừa tạo hóa đơn", value: 41300000, time: "10 giờ tại" },
        { name: "asdaad", action: "vừa tạo hóa đơn", value: 28100000, time: "9 giờ tại" },
    ];

    return (
        <Box sx={{ bgcolor: colors.background, display: 'flex', minHeight: "100vh", py: 2 }}>
            <Grid container sx={{ flexGrow: 1 }}>
                {/* CỘT TRÁI - 40% */}
                <Grid item xs={12} sx={{ flexGrow: 0, '@media (min-width:1200px)': { flexBasis: '40%', maxWidth: '40%', paddingLeft: '8px', paddingRight: '8px' } }}>
                    <Grid container direction="column" spacing={1.5} sx={{ flexGrow: 1, height: '100%' }}>
                        {/* DOANH THU HÔM NAY - 1/3 chiều cao */}
                        <Grid item sx={{ flexGrow: 1, display: 'flex' , width : "100%"}}>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: `1px solid ${colors.border}`,
                                        px: 2,
                                        py: 1.2
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{
                                                fontSize: "0.75rem",
                                                textTransform: "uppercase",
                                                color: colors.text.primary
                                            }}
                                        >
                                            Doanh thu hôm nay
                                        </Typography>
                                        <OpenInNew
                                            sx={{
                                                fontSize: 14,
                                                color: colors.primary,
                                                cursor: "pointer",
                                                ml: 0.5
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: colors.primary
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: colors.primary,
                                                fontWeight: 500,
                                                mr: 0.5
                                            }}
                                        >
                                            Hôm nay
                                        </Typography>
                                        <ArrowDropDown
                                            sx={{
                                                fontSize: 18,
                                                color: colors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 2, flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: colors.text.secondary,
                                                        fontSize: "0.75rem"
                                                    }}
                                                >
                                                    Tổng
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: colors.text.primary,
                                                    fontSize: "1.25rem"
                                                }}
                                            >
                                                {formatNumber(1102942000)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: colors.text.secondary,
                                                        fontSize: "0.75rem"
                                                    }}
                                                >
                                                    Hóa đơn
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: colors.text.primary,
                                                    fontSize: "1.25rem"
                                                }}
                                            >
                                                9
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: colors.text.secondary,
                                                fontSize: "0.7rem"
                                            }}
                                        >
                                            Trung bình
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: colors.text.primary,
                                                fontWeight: "bold",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            0 /phòng/ngày
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        {/* HOẠT ĐỘNG LỄ TÂN HÔM NAY - 1/4 chiều cao */}
                        <Grid item sx={{ flexGrow: 1, display: 'flex' , width : "100%"}}>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: `1px solid ${colors.border}`,
                                        px: 2,
                                        py: 1.2
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            color: colors.text.primary
                                        }}
                                    >
                                        Hoạt động lễ tân hôm nay
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: colors.primary
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: colors.primary,
                                                fontWeight: 500,
                                                mr: 0.5
                                            }}
                                        >
                                            Hôm nay
                                        </Typography>
                                        <ArrowDropDown
                                            sx={{
                                                fontSize: 18,
                                                color: colors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", height: 70, flexGrow: 1 }}>
                                    <Box
                                        sx={{
                                            width: "25%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            borderRight: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Đã nhận
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            1/1 phòng
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "25%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            borderRight: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Đã trả
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            0/1 phòng
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "25%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            borderRight: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Có khách
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            3 phòng
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "25%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Quá dự kiến
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            0 phòng
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        {/* CÔNG SUẤT SỬ DỤNG PHÒNG - 1/2 chiều cao */}
                        <Grid item sx={{ flexGrow: 1, display: 'flex' ,
                            width:"177%"}}>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: `1px solid ${colors.border}`,
                                        px: 2,
                                        py: 1.2
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            color: colors.text.primary
                                        }}
                                    >
                                        Công suất sử dụng phòng tháng này
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: colors.primary
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: colors.primary,
                                                fontWeight: 500,
                                                mr: 0.5
                                            }}
                                        >
                                            Tháng này
                                        </Typography>
                                        <ArrowDropDown
                                            sx={{
                                                fontSize: 18,
                                                color: colors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mr: 1.5
                                            }}
                                        >
                                            <svg viewBox="0 0 36 36" width="80" height="80">
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.91549430918954"
                                                    fill="none"
                                                    stroke="#f0f0f0"
                                                    strokeWidth="3"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="15.91549430918954"
                                                    fill="none"
                                                    stroke={colors.primary}
                                                    strokeWidth="3"
                                                    strokeDasharray="100"
                                                    strokeDashoffset={100 - 31.85}
                                                    transform="rotate(-90 18 18)"
                                                    strokeLinecap="round"
                                                />
                                                <text
                                                    x="18"
                                                    y="20"
                                                    textAnchor="middle"
                                                    fontSize="9"
                                                    fontWeight="bold"
                                                    fill="#333"
                                                >
                                                    31.85%
                                                </text>
                                            </svg>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: colors.text.secondary,
                                                fontSize: "0.7rem"
                                            }}
                                        >
                                            Trung bình
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2, flexGrow: 1 }}>
                                        {[100, 90, 80, 70, 60, 50].map((percent) => (
                                            <Box
                                                key={percent}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 1
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        width: 35,
                                                        color: colors.text.secondary,
                                                        fontSize: "0.7rem"
                                                    }}
                                                >
                                                    {percent}%
                                                </Typography>
                                                <Divider
                                                    sx={{
                                                        flexGrow: 1,
                                                        ml: 1,
                                                        borderColor: "#f0f0f0"
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* --- CỘT GIỮA - 30% (ĐÃ SỬA) --- */}
                <Grid item xs={12} sx={{ flexGrow: 0, '@media (min-width:1200px)': { flexBasis: '30%', maxWidth: '30%', paddingLeft: '8px', paddingRight: '8px' } }}>
                    {/* Giảm spacing từ 5 xuống 1.5 */}
                    <Grid container direction="column" spacing={1.5} sx={{ flexGrow: 1, height: '100%' }}>
                        {/* THU - CHI HÔM NAY */}
                        {/* Loại bỏ flexGrow và display:flex khỏi Grid item này để nó chỉ chiếm không gian cần thiết + spacing */}
                        <Grid item>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width:"100%",
                                    height:"300px"
                                    // Không cần height: '48%' nữa, để nó tự co giãn theo nội dung
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: `1px solid ${colors.border}`,
                                        px: 2,
                                        py: 1.2
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{
                                                fontSize: "0.75rem",
                                                textTransform: "uppercase",
                                                color: colors.text.primary
                                            }}
                                        >
                                            Thu - Chi hôm nay
                                        </Typography>
                                        <OpenInNew
                                            sx={{
                                                fontSize: 14,
                                                color: colors.primary,
                                                cursor: "pointer",
                                                ml: 0.5
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: colors.primary
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: colors.primary,
                                                fontWeight: 500,
                                                mr: 0.5
                                            }}
                                        >
                                            Hôm nay
                                        </Typography>
                                        <ArrowDropDown
                                            sx={{
                                                fontSize: 18,
                                                color: colors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 2, flexGrow: 1 }}> {/* Giữ flexGrow ở đây để nội dung bên trong Paper có thể giãn nở */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: colors.primary,
                                            fontSize: "1.25rem",
                                            mb: 2
                                        }}
                                    >
                                        {formatNumber(1083580000)}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1.5
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    bgcolor: colors.primary,
                                                    mr: 1
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: colors.text.secondary,
                                                    fontSize: "0.7rem"
                                                }}
                                            >
                                                Tổng thu
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    ml: 1,
                                                    fontWeight: "bold",
                                                    fontSize: "0.7rem",
                                                    color: colors.text.primary
                                                }}
                                            >
                                                {formatNumber(1102934000)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    bgcolor: "red",
                                                    mr: 1
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: colors.text.secondary,
                                                    fontSize: "0.7rem"
                                                }}
                                            >
                                                Tổng chi
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    ml: 1,
                                                    fontWeight: "bold",
                                                    fontSize: "0.7rem",
                                                    color: colors.text.primary
                                                }}
                                            >
                                                {formatNumber(19354000)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {/* Đảm bảo nội dung Box này có chiều cao đủ để hiển thị */}
                                    <Box sx={{ height: 'auto', minHeight: 30 }}> {/* Điều chỉnh chiều cao nếu cần */}
                                        <Box sx={{ height: 10, display: "flex", mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: `${(1102934000 / (1102934000 + 19354000)) * 100}%`,
                                                    height: "100%",
                                                    bgcolor: colors.primary,
                                                    borderTopLeftRadius: 5,
                                                    borderBottomLeftRadius: 5
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    width: `${(19354000 / (1102934000 + 19354000)) * 100}%`,
                                                    height: "100%",
                                                    bgcolor: "red",
                                                    borderTopRightRadius: 5,
                                                    borderBottomRightRadius: 5
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* ĐẶT PHÒNG HÔM NAY */}
                        {/* Loại bỏ flexGrow khỏi Grid item này */}
                        <Grid item>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height:"223px"
                                    // Không cần height: '100%' nữa, để nó tự co giãn
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderBottom: `1px solid ${colors.border}`,
                                        px: 2,
                                        py: 1.2
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            color: colors.text.primary
                                        }}
                                    >
                                        Đặt phòng hôm nay
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: colors.primary
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: "0.75rem",
                                                color: colors.primary,
                                                fontWeight: 500,
                                                mr: 0.5
                                            }}
                                        >
                                            Hôm nay
                                        </Typography>
                                        <ArrowDropDown
                                            sx={{
                                                fontSize: 18,
                                                color: colors.primary
                                            }}
                                        />
                                    </Box>
                                </Box>
                                {/* Giữ flexGrow ở đây để phần nội dung bên trong Paper có thể giãn nở nếu cần */}
                                <Box sx={{ display: "flex", minHeight: 70, flexGrow: 1 }}>
                                    <Box
                                        sx={{
                                            width: "50%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            borderRight: `1px solid ${colors.border}`,
                                            py: 1 // Thêm padding dọc nếu cần
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Đặt phòng mới
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            10 đặt phòng
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "50%",
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            py: 1 // Thêm padding dọc nếu cần
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mb: 0.5,
                                                color: colors.text.secondary,
                                                fontSize: "0.65rem"
                                            }}
                                        >
                                            Đặt phòng hủy
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: colors.text.primary,
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            0 đặt phòng
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* --- KẾT THÚC CỘT GIỮA --- */}


                {/* CỘT PHẢI - 30% */}
                <Grid item xs={12} sx={{ flexGrow: 1, '@media (min-width:1200px)': { flexBasis: '30%', maxWidth: '30%', paddingLeft: '8px', paddingRight: '8px' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            border: `1px solid ${colors.border}`,
                            borderRadius: 0,
                            display: "flex",
                            flexDirection: "column",
                            height: '100%' // Đảm bảo Paper chiếm đủ chiều cao của Grid item
                        }}
                    >
                        <Box
                            sx={{
                                borderBottom: `1px solid ${colors.border}`,
                                px: 2,
                                py: 1.2
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    color: colors.text.primary
                                }}
                            >
                                Các hoạt động gần đây
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : error ? (
                                <Box sx={{ p: 2, textAlign: "center", color: "error.main" }}>
                                    <Typography variant="body2">{error}</Typography>
                                </Box>
                            ) : activityLogs.length > 0 ? (
                                <List disablePadding>
                                    {activityLogs.map((log, index) => (
                                        <ListItem
                                            key={log.id || index}
                                            sx={{
                                                py: 1.2,
                                                px: 2,
                                                borderBottom: index === activityLogs.length - 1 ? 'none' : `1px solid ${colors.border}`
                                            }}
                                        >
                                            <ListItemAvatar sx={{ minWidth: 40 }}>
                                                <Avatar sx={{ bgcolor: "#e3f2fd", width: 32, height: 32 }}>
                                                    <ReceiptIcon fontSize="small" sx={{ color: colors.primary }} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                color: colors.primary,
                                                                fontWeight: 500,
                                                                fontSize: "0.8rem",
                                                                mr: 0.5
                                                            }}
                                                        >
                                                            {getUserName(log)}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                color: colors.text.secondary,
                                                                fontSize: "0.8rem"
                                                            }}
                                                        >
                                                            {` vừa ${log.action?.toLowerCase() || ''}`}
                                                        </Typography>
                                                        {log.description && (
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: colors.text.secondary,
                                                                    fontSize: "0.8rem"
                                                                }}
                                                            >
                                                                {` ${log.description}`}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: colors.text.secondary,
                                                            fontSize: "0.7rem"
                                                        }}
                                                    >
                                                        {calculateElapsedTime(log)}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <List disablePadding>
                                    {mockActivities.map((activity, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                py: 1.2,
                                                px: 2,
                                                borderBottom: index === mockActivities.length - 1 ? 'none' : `1px solid ${colors.border}`
                                            }}
                                        >
                                            <ListItemAvatar sx={{ minWidth: 40 }}>
                                                <Avatar sx={{ bgcolor: "#e3f2fd", width: 32, height: 32 }}>
                                                    <ReceiptIcon fontSize="small" sx={{ color: colors.primary }} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                color: colors.primary,
                                                                fontWeight: 500,
                                                                fontSize: "0.8rem",
                                                                mr: 0.5
                                                            }}
                                                        >
                                                            {activity.name}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                color: colors.text.secondary,
                                                                fontSize: "0.8rem"
                                                            }}
                                                        >
                                                            {activity.action}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                color: colors.text.secondary,
                                                                fontSize: "0.8rem"
                                                            }}
                                                        >
                                                            {" với giá trị "}
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    color: colors.primary,
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {formatNumber(activity.value)}
                                                            </Box>
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: colors.text.secondary,
                                                            fontSize: "0.7rem"
                                                        }}
                                                    >
                                                        {activity.time}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{ component: 'div' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
export default ContentAdmin;