/**
 * TaskSort Component
 * Dropdown to sort tasks
 */

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

function TaskSort({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date (Earliest First)' },
    { value: 'status', label: 'Status (Incomplete First)' },
    { value: 'createdAt', label: 'Created (Newest First)' },
  ];

  return (
    <FormControl sx={{ minWidth: 200 }} size='small'>
      <InputLabel id='sort-by-label'>Sort By</InputLabel>
      <Select
        labelId='sort-by-label'
        id='sort-by-select'
        value={sortBy}
        label='Sort By'
        onChange={(e) => onSortChange(e.target.value)}
        aria-label='Sort tasks by'
      >
        {sortOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TaskSort;
