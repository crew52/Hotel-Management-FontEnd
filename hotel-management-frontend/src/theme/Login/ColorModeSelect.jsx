import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { styled } from '@mui/material/styles';

// Tạo một component Select tùy chỉnh với màu sắc dựa trên mode
const StyledSelect = styled(Select)(({ mode }) => ({
  borderRadius: 20,
  minWidth: 120,
  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  
  '& .MuiOutlinedInput-notchedOutline': { 
    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)' 
  },
  '&:hover .MuiOutlinedInput-notchedOutline': { 
    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
  },
  '& .MuiSelect-select': {
    color: mode === 'dark' ? '#ffffff !important' : 'inherit',
  },
  '& .MuiSvgIcon-root': {
    color: mode === 'dark' ? '#ffffff' : 'inherit',
  }
}));

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  
  return (
    <StyledSelect
      value={mode}
      onChange={(event) => setMode(event.target.value)}
      variant="outlined"
      size="small"
      mode={mode}
      SelectDisplayProps={{
        'data-screenshot': 'toggle-mode',
      }}
      IconComponent={() => (
        mode === 'light' ? 
        <LightModeIcon sx={{ mr: 1 }} /> : 
        mode === 'dark' ? 
        <DarkModeIcon sx={{ mr: 1 }} /> : 
        <SettingsBrightnessIcon sx={{ mr: 1 }} />
      )}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: mode === 'dark' ? '#1a1a2e' : 'white',
            '& .MuiMenuItem-root': {
              color: mode === 'dark' ? 'white' : 'inherit',
            },
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : undefined,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : undefined,
            }
          }
        }
      }}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </StyledSelect>
  );
} 