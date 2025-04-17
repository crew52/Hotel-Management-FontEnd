import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PhotoCamera } from '@mui/icons-material';
import { roomService } from '../../services/roomService';

const RoomForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    roomCategory: '',
    floor: '',
    startDate: null,
    status: 'AVAILABLE',
    notes: '',
    cleanliness: 'CLEAN',
    checkInDuration: '',
    images: []
  });

  const [roomCategories, setRoomCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchRoomCategories();
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate) : null
      });
    }
  }, [initialData]);

  const fetchRoomCategories = async () => {
    try {
      const response = await roomService.getRoomCategories();
      setRoomCategories(response.data);
    } catch (error) {
      console.error('Error fetching room categories:', error);
      setSubmitError('Failed to fetch room categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      startDate: date
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.roomCategory) newErrors.roomCategory = 'Room category is required';
    if (!formData.floor) newErrors.floor = 'Floor is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSubmit.append('images', image);
          });
        } else if (key === 'startDate') {
          if (formData.startDate) {
            formDataToSubmit.append('startDate', formData.startDate.toISOString());
          }
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await onSubmit(formDataToSubmit);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {submitError && (
            <Grid item xs={12}>
              <Alert severity="error">{submitError}</Alert>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.roomCategory}>
              <InputLabel>Room Category</InputLabel>
              <Select
                name="roomCategory"
                value={formData.roomCategory}
                onChange={handleChange}
                label="Room Category"
              >
                {roomCategories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              error={!!errors.floor}
              helperText={errors.floor}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="OCCUPIED">Occupied</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Cleanliness</InputLabel>
              <Select
                name="cleanliness"
                value={formData.cleanliness}
                onChange={handleChange}
                label="Cleanliness"
              >
                <MenuItem value="CLEAN">Clean</MenuItem>
                <MenuItem value="DIRTY">Dirty</MenuItem>
                <MenuItem value="CLEANING">Cleaning</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Check-in Duration"
              name="checkInDuration"
              value={formData.checkInDuration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <Typography>
                {formData.images.length} image(s) selected
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RoomForm; 