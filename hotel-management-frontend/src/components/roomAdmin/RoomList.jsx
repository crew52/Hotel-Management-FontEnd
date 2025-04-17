"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import roomService from "../../services/roomService.js";
import { toast } from "react-toastify";

const RoomList = ({ onOpenForm, onSave }) => {
    const [rooms, setRooms] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRooms = async (pageNum = 0, size = 5) => {
        try {
            setLoading(true);
            setError(null);
            const response = await roomService.getAll(pageNum, size);
            
            // Xử lý nhiều dạng response khác nhau
            console.log("Raw response from room service:", response);
            
            let content = [];
            let total = 0;
            
            if (response && response.content) {
                // Trường hợp 1: Response có định dạng {content: [...], totalElements: number}
                content = response.content;
                total = response.totalElements || 0;
            } else if (Array.isArray(response)) {
                // Trường hợp 2: Response là array trực tiếp
                content = response;
                total = response.length;
            } else if (response && typeof response === 'object') {
                // Trường hợp 3: Response là object nhưng không có content
                content = [response];
                total = 1;
            }
            
            setRooms(content);
            setTotalElements(total);
            
            console.log("Processed data:", { content, total });
        } catch (error) {
            setError("Không thể tải danh sách phòng. Vui lòng thử lại!");
            toast.error("Lỗi khi tải dữ liệu!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRefresh = () => {
        fetchRooms(page, rowsPerPage);
    };

    const handleSaveAction = async (updatedItem) => {
        if (onSave) {
            await onSave(updatedItem);
            handleRefresh();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefresh}
                    sx={{ mt: 2 }}
                >
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <Paper sx={{ boxShadow: 1 }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", width: "80px" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "150px" }}>Hạng phòng</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "80px", textAlign: "center" }}>Tầng</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "120px" }}>Ngày bắt đầu</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "150px" }}>Ghi chú</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Trạng thái vệ sinh</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px", textAlign: "center" }}>Thời gian check-in (giờ)</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Hình ảnh 1</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Hình ảnh 2</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Hình ảnh 3</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }}>Hình ảnh 4</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: "100px" }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={13} align="center">
                                    Không có dữ liệu để hiển thị.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rooms.map((room) => (
                                <TableRow
                                    key={room.id}
                                    onClick={() => onOpenForm("view", "room", room)}
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": { backgroundColor: "#f5f5f5" }
                                    }}
                                >
                                    <TableCell>{room.id}</TableCell>
                                    <TableCell>{room.roomCategory?.name || "Không xác định"}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{room.floor ?? "Không xác định"}</TableCell>
                                    <TableCell>
                                        {room.startDate
                                            ? new Date(room.startDate).toLocaleDateString("vi-VN")
                                            : "Không xác định"}
                                    </TableCell>
                                    <TableCell>{room.status || "Không xác định"}</TableCell>
                                    <TableCell>{room.note || "Không có ghi chú"}</TableCell>
                                    <TableCell>{room.isClean ? "Sạch" : "Chưa sạch"}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{room.checkInDuration ?? 0}</TableCell>
                                    <TableCell>{room.img1 || "Không có"}</TableCell>
                                    <TableCell>{room.img2 || "Không có"}</TableCell>
                                    <TableCell>{room.img3 || "Không có"}</TableCell>
                                    <TableCell>{room.img4 || "Không có"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenForm("edit", "room", room);
                                            }}
                                            sx={{ width: "80px" }}
                                        >
                                            Chỉnh sửa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} trong ${count}`
                }
            />
        </Paper>
    );
};

export default RoomList;