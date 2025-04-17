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
            setRooms(response.content || []);
            setTotalElements(response.totalElements || 0);
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
            </Box>
        );
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Hạng phòng</TableCell>
                            <TableCell>Tầng</TableCell>
                            <TableCell>Ngày bắt đầu</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>Trạng thái vệ sinh</TableCell>
                            <TableCell>Thời gian check-in (giờ)</TableCell>
                            <TableCell>Hình ảnh 1</TableCell>
                            <TableCell>Hình ảnh 2</TableCell>
                            <TableCell>Hình ảnh 3</TableCell>
                            <TableCell>Hình ảnh 4</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={12} align="center">
                                    Không có dữ liệu để hiển thị.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rooms.map((room) => (
                                <TableRow
                                    key={room.id}
                                    onClick={() => onOpenForm("view", "room", room)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell>{room.id}</TableCell>
                                    <TableCell>{room.roomCategory?.name || "Không xác định"}</TableCell>
                                    <TableCell>{room.floor ?? "Không xác định"}</TableCell>
                                    <TableCell>
                                        {room.startDate
                                            ? new Date(room.startDate).toLocaleDateString("vi-VN")
                                            : "Không xác định"}
                                    </TableCell>
                                    <TableCell>{room.status || "Không xác định"}</TableCell>
                                    <TableCell>{room.note || "Không có ghi chú"}</TableCell>
                                    <TableCell>{room.isClean ? "Sạch" : "Chưa sạch"}</TableCell>
                                    <TableCell>{room.checkInDuration ?? 0}</TableCell>
                                    <TableCell>{room.img1 || "Không có"}</TableCell>
                                    <TableCell>{room.img2 || "Không có"}</TableCell>
                                    <TableCell>{room.img3 || "Không có"}</TableCell>
                                    <TableCell>{room.img4 || "Không có"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenForm("edit", "room", room);
                                            }}
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