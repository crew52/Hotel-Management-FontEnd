"use client";

import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SpaLink from '../common/SpaLink';
import { useSpaApi } from '../../hooks';
import LoadingSpinner from '../common/LoadingSpinner';

const RoomList = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Use SPA optimized API hook
  const { 
    data, 
    loading, 
    error, 
    refetch,
    deleteData
  } = useSpaApi('/rooms', {
    page: page - 1,
    size: pageSize,
    search: searchTerm,
    status: filterStatus
  }, {
    dependencies: [page, pageSize, searchTerm, filterStatus]
  });
  
  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteData(`/rooms/${roomId}`);
        refetch();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room. Please try again.');
      }
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Just updating searchTerm will trigger a refetch due to dependencies
  };
  
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  
  if (loading && !data) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error loading rooms: {error.message || 'Unknown error'}
        </Typography>
        <Button variant="contained" onClick={refetch} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }
  
  const rooms = data?.content || [];
  const totalPages = data?.totalPages || 0;
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Room Management
        </Typography>
        
        <SpaLink 
          to="/admin/rooms/add"
          prefetchEndpoints={['/room-categories']}
        >
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
          >
            Add Room
          </Button>
        </SpaLink>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Search rooms"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" edge="end">
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </form>
        
        <TextField
          select
          label="Status"
          variant="outlined"
          size="small"
          value={filterStatus}
          onChange={handleFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="OCCUPIED">Occupied</MenuItem>
          <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
        </TextField>
      </Box>
      
      {loading && <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size={30} />
      </Box>}
      
      {rooms.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          No rooms found. Try a different search or add a new room.
        </Typography>
      ) : (
        <Grid container spacing={3} className={loading ? 'opacity-50' : ''}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Room {room.roomNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {room.roomCategory?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Floor: {room.floor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {room.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${room.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <SpaLink 
                    to={`/admin/rooms/edit/${room.id}`}
                    prefetchEndpoints={[
                      `/rooms/${room.id}`,
                      '/room-categories'
                    ]}
                  >
                    <Button size="small" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                  </SpaLink>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
};

export default RoomList;