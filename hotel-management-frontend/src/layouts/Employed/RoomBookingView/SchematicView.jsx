import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import RoomViewService from "../../../services/employee/room.service.js";

export default function SchematicView({ onBookingOpen, onFilterOpen, onViewModeChange, onRoomsUpdate }) {
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [schematic, setSchematic] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await RoomViewService.getAllRoomView();
                const roomData = res.data.content;
                setSchematic(roomData);
                if (onRoomsUpdate) {
                    onRoomsUpdate(roomData);
                }
            } catch (err) {
                console.error('Không thể tải danh sách phòng:', err);
            }
        };

        fetchRooms();
    }, [onRoomsUpdate]);

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

    return (
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
    );
}