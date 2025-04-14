import React from 'react';
import Box from '@mui/material/Box';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';

export default function SchematicView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = React.useState(null);
    const [searchValue, setSearchValue] = React.useState('');

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