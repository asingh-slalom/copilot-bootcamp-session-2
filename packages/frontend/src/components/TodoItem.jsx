/**
 * TodoItem Component
 * Displays an individual task with edit and delete options
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Checkbox,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate, getPriorityColor, getPriorityLabel, isOverdue } from '../utils/helpers';

function TodoItem({ task, onComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const taskStatusColor = task.status === 'complete' ? '#b0bec5' : 'inherit';

  return (
    <Card
      sx={{
        marginBottom: 2,
        borderLeft: overdue ? '4px solid #ef5350' : '4px solid #1976d2',
        backgroundColor: overdue ? '#ffebee' : 'inherit',
        opacity: task.status === 'complete' ? 0.7 : 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Checkbox
            checked={task.status === 'complete'}
            onChange={() => onComplete(task.id)}
            aria-label='Mark task as complete'
            sx={{ marginTop: -1 }}
          />

          <Box sx={{ flex: 1, mt: -1 }}>
            <Typography
              variant='h6'
              sx={{
                textDecoration: task.status === 'complete' ? 'line-through' : 'none',
                color: taskStatusColor,
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant='body2'
                color='textSecondary'
                sx={{
                  marginTop: 1,
                  wordBreak: 'break-word',
                }}
              >
                {task.description}
              </Typography>
            )}

            <Stack
              direction='row'
              spacing={1}
              sx={{ marginTop: 2, flexWrap: 'wrap', gap: 1 }}
            >
              {task.dueDate && (
                <Chip
                  label={formatDate(task.dueDate)}
                  variant='outlined'
                  size='small'
                  color={overdue ? 'error' : 'default'}
                  sx={{
                    backgroundColor: overdue ? '#ffebee' : 'transparent',
                  }}
                />
              )}

              {task.priority && (
                <Chip
                  label={getPriorityLabel(task.priority)}
                  size='small'
                  sx={{
                    backgroundColor: getPriorityColor(task.priority),
                    color: '#fff',
                  }}
                />
              )}

              {task.status === 'complete' && (
                <Chip label='Completed' size='small' color='success' />
              )}

              {overdue && (
                <Chip label='Overdue' size='small' color='error' />
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size='small'
          startIcon={<EditIcon />}
          onClick={() => onEdit(task)}
          color='primary'
        >
          Edit
        </Button>
        <Button
          size='small'
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(task.id)}
          color='error'
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default TodoItem;
