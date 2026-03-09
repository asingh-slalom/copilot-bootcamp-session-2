/**
 * TaskFilter Component
 * Buttons to filter tasks by status
 */

import React from 'react';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';

function TaskFilter({ activeFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'incomplete', label: 'Active' },
    { value: 'complete', label: 'Completed' },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        {filters.map(filter => (
          <Button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            variant={activeFilter === filter.value ? 'contained' : 'outlined'}
            color={activeFilter === filter.value ? 'primary' : 'inherit'}
            fullWidth={{xs: true, sm: 'auto'}}
            aria-label={`Filter by ${filter.label}`}
            aria-pressed={activeFilter === filter.value}
          >
            {filter.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export default TaskFilter;
