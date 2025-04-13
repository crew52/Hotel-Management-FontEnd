import React from 'react';
import Box from '@mui/material/Box';
import AppBarHeader from "./AppBarHeader.jsx";
import SideMenu from "./SideMenu.jsx";
import RoomBookingView from "../RoomBookingView/RoomBookingView.jsx";


export default function EmployedView() {
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef(null);

    const handleToggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBarHeader onToggleMenu={handleToggleMenu} />
            <RoomBookingView />
            {showMenu && <SideMenu menuRef={menuRef} />}
        </Box>
    );
}