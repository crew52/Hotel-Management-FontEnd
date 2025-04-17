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
  CircularProgress
} from '@mui/material';

const RoomCategoryForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    hourlyPrice: 0,
    dailyPrice: 0,
    overnightPrice: 0,
    earlyCheckinFee: 0,
    lateCheckoutFee: 0,
    extraFeeType: 'FIXED',
    defaultExtraFee: 0,
    applyToAllCategories: false,
    standardAdultCapacity: 1,
    standardChildCapacity: 0,
    maxAdultCapacity: 2,
    maxChildCapacity: 1,
    status: 'AVAILABLE',
    imgUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? 0 : Number(value);
    if (!isNaN(numberValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code || formData.code.trim() === '') {
      newErrors.code = 'Code is required';
    } else if (formData.code.length > 20) {
      newErrors.code = 'Code must not exceed 20 characters';
    }

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    const numericFields = ['hourlyPrice', 'dailyPrice', 'overnightPrice', 'earlyCheckinFee', 
      'lateCheckoutFee', 'defaultExtraFee', 'standardAdultCapacity', 'standardChildCapacity', 
      'maxAdultCapacity', 'maxChildCapacity'];
    
    numericFields.forEach(field => {
      const value = Number(formData[field]);
      if (isNaN(value) || value < 0) {
        newErrors[field] = `${field} must be a valid positive number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while saving');
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
            <TextField
              fullWidth
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hourly Price"
              name="hourlyPrice"
              type="number"
              value={formData.hourlyPrice}
              onChange={handleNumberChange}
              error={!!errors.hourlyPrice}
              helperText={errors.hourlyPrice}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Daily Price"
              name="dailyPrice"
              type="number"
              value={formData.dailyPrice}
              onChange={handleNumberChange}
              error={!!errors.dailyPrice}
              helperText={errors.dailyPrice}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Overnight Price"
              name="overnightPrice"
              type="number"
              value={formData.overnightPrice}
              onChange={handleNumberChange}
              error={!!errors.overnightPrice}
              helperText={errors.overnightPrice}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Early Check-in Fee"
              name="earlyCheckinFee"
              type="number"
              value={formData.earlyCheckinFee}
              onChange={handleNumberChange}
              error={!!errors.earlyCheckinFee}
              helperText={errors.earlyCheckinFee}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Late Check-out Fee"
              name="lateCheckoutFee"
              type="number"
              value={formData.lateCheckoutFee}
              onChange={handleNumberChange}
              error={!!errors.lateCheckoutFee}
              helperText={errors.lateCheckoutFee}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Extra Fee Type</InputLabel>
              <Select
                name="extraFeeType"
                value={formData.extraFeeType}
                onChange={handleChange}
                label="Extra Fee Type"
              >
                <MenuItem value="FIXED">Fixed</MenuItem>
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Default Extra Fee"
              name="defaultExtraFee"
              type="number"
              value={formData.defaultExtraFee}
              onChange={handleNumberChange}
              error={!!errors.defaultExtraFee}
              helperText={errors.defaultExtraFee}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.applyToAllCategories}
                  onChange={handleSwitchChange}
                  name="applyToAllCategories"
                />
              }
              label="Apply to All Categories"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Standard Adult Capacity"
              name="standardAdultCapacity"
              type="number"
              value={formData.standardAdultCapacity}
              onChange={handleNumberChange}
              error={!!errors.standardAdultCapacity}
              helperText={errors.standardAdultCapacity}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Standard Child Capacity"
              name="standardChildCapacity"
              type="number"
              value={formData.standardChildCapacity}
              onChange={handleNumberChange}
              error={!!errors.standardChildCapacity}
              helperText={errors.standardChildCapacity}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Adult Capacity"
              name="maxAdultCapacity"
              type="number"
              value={formData.maxAdultCapacity}
              onChange={handleNumberChange}
              error={!!errors.maxAdultCapacity}
              helperText={errors.maxAdultCapacity}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Child Capacity"
              name="maxChildCapacity"
              type="number"
              value={formData.maxChildCapacity}
              onChange={handleNumberChange}
              error={!!errors.maxChildCapacity}
              helperText={errors.maxChildCapacity}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="AVAILABLE">Đang kinh doanh</MenuItem>
                <MenuItem value="MAINTENANCE">Ngừng kinh doanh</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Image URL"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleChange}
            />
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

export default RoomCategoryForm; 