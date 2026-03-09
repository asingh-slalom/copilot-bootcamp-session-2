/**
 * TodoList Component
 * Displays list of tasks with filtering and sorting
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import TodoItem from './TodoItem';
import { filterTasks, sortTasks } from '../utils/helpers';

function TodoList({
  tasks,
  filter,
  sortBy,
  loading,
  error,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
}) {
  // Apply filtering and sorting
  let displayTasks = filterTasks(tasks, filter);
  displayTasks = sortTasks(displayTasks, sortBy);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  if (displayTasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant='h6' color='textSecondary' gutterBottom>
          {filter === 'incomplete' && 'No incomplete tasks!'}
          {filter === 'complete' && 'No completed tasks.'}
          {filter === 'all' && 'No tasks yet. Create your first task!'}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {filter === 'all' && 'Click "Add Task" to get started.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth='md' sx={{ paddingY: 3 }}>
      <Grid container spacing={2}>
        {displayTasks.map(task => (
          <Grid item xs={12} key={task.id}>
            <TodoItem
              task={task}
              onComplete={onTaskComplete}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TodoList;
