import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import theme from './styles/theme';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TaskFilter from './components/TaskFilter';
import TaskSort from './components/TaskSort';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        filter,
        sortBy,
      }).toString();
      
      const response = await fetch(`/api/tasks?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy]);

  useEffect(() => {
    // Load tasks from localStorage for offline support
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error('Error loading tasks from localStorage:', err);
      }
    }
    
    // Fetch from server
    fetchTasks();
  }, [fetchTasks]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Create or update task
  const handleSaveTask = useCallback(async (taskData, taskId) => {
    try {
      const method = taskId ? 'PUT' : 'POST';
      const url = taskId ? `/api/tasks/${taskId}` : '/api/tasks';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      const result = await response.json();

      if (taskId) {
        setTasks(tasks.map(t => (t.id === taskId ? result : t)));
      } else {
        setTasks([...tasks, result]);
      }

      setError(null);
      setEditingTask(null);
      setFormOpen(false);
    } catch (err) {
      setError(err.message);
      console.error('Error saving task:', err);
    }
  }, [tasks]);

  // Complete/incomplete task
  const handleCompleteTask = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
    await handleSaveTask({ ...task, status: newStatus }, taskId);
  }, [tasks, handleSaveTask]);

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  // Delete task with confirmation
  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setError(null);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  // Close form
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              ✓ TODO App
            </Typography>
            <Button
              color='inherit'
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingTask(null);
                setFormOpen(true);
              }}
            >
              Add Task
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component='main' sx={{ flexGrow: 1, paddingY: 3 }}>
          <Container maxWidth='md'>
            {/* Controls */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ marginBottom: 3 }}
            >
              <Box sx={{ flex: 1 }}>
                <TaskFilter
                  activeFilter={filter}
                  onFilterChange={setFilter}
                />
              </Box>
              <Box>
                <TaskSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </Box>
            </Stack>

            {/* Error Message */}
            {error && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
                {error}
              </Box>
            )}

            {/* Task List */}
            <TodoList
              tasks={tasks}
              filter={filter}
              sortBy={sortBy}
              loading={loading}
              error={null}
              onTaskComplete={handleCompleteTask}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
            />
          </Container>
        </Box>

        {/* Task Form Dialog */}
        <TodoForm
          open={formOpen}
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseForm}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color='inherit'>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant='contained'
              color='error'
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;