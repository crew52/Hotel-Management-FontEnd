import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
} from "@mui/material";

const RoomList = ({ rooms, categories, onOpenForm, onSave }) => {
    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.room_category_id === categoryId);
        return category ? category.room_category_name : "Không xác định";
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Checkbox />
                        </TableCell>
                        <TableCell>Tên phòng</TableCell>
                        <TableCell>Hạng phòng</TableCell>
                        <TableCell>Tầng</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ghi chú</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography>Không có phòng nào để hiển thị.</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rooms.map((room) => (
                            <TableRow
                                key={room.room_id}
                                onClick={() => onOpenForm("view", room)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{`Phòng ${room.room_id}`}</TableCell>
                                <TableCell>{getCategoryName(room.room_category_id)}</TableCell>
                                <TableCell>{room.floor}</TableCell>
                                <TableCell>
                                    {room.status === "AVAILABLE"
                                        ? "Có sẵn"
                                        : room.status === "OCCUPIED"
                                            ? "Đang sử dụng"
                                            : "Bảo trì"}
                                </TableCell>
                                <TableCell>{room.note || "Không có ghi chú"}</TableCell>
                                <TableCell />
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RoomList;
