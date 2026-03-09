/**
 * TodoForm Component
 * Modal form for creating and editing tasks
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { validateTask } from '../utils/helpers';

function TodoForm({ open, task, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: 'incomplete',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || '',
        status: task.status || 'incomplete',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        status: 'incomplete',
      });
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = () => {
    // Validate form
    const validation = validateTask({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
    });

    if (!validation.isValid) {
      const errorObject = {};
      validation.errors.forEach(error => {
        if (error.includes('Title')) errorObject.title = error;
        if (error.includes('due date')) errorObject.dueDate = error;
        if (error.includes('priority')) errorObject.priority = error;
      });
      setErrors(errorObject);
      return;
    }

    // Prepare data to send
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      priority: formData.priority || null,
      status: formData.status,
    };

    onSave(taskData, task?.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      aria-labelledby='todo-form-dialog'
    >
      <DialogTitle id='todo-form-dialog'>
        {task ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            label='Title *'
            name='title'
            value={formData.title}
            onChange={handleChange}
            fullWidth
            placeholder='What needs to be done?'
            error={!!errors.title}
            helperText={errors.title}
            required
          />

          <TextField
            label='Description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder='Add more details...'
          />

          <TextField
            label='Due Date'
            name='dueDate'
            type='date'
            value={formData.dueDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name='priority'
              value={formData.priority}
              label='Priority'
              onChange={handleChange}
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='low'>Low</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='high'>High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name='status'
              value={formData.status}
              label='Status'
              onChange={handleChange}
            >
              <MenuItem value='incomplete'>Incomplete</MenuItem>
              <MenuItem value='complete'>Complete</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {task ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TodoForm;
