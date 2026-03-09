import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList';

describe('TodoList Component', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'incomplete',
      dueDate: '2026-03-20T00:00:00.000Z',
      priority: 'high',
      createdAt: '2026-03-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'complete',
      dueDate: '2026-03-15T00:00:00.000Z',
      priority: 'medium',
      createdAt: '2026-03-02T00:00:00.000Z',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'incomplete',
      dueDate: null,
      priority: 'low',
      createdAt: '2026-03-03T00:00:00.000Z',
    },
  ];

  const mockHandlers = {
    onTaskComplete: jest.fn(),
    onTaskEdit: jest.fn(),
    onTaskDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tasks when filter is "all"', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='all'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('filters to show only incomplete tasks', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='incomplete'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  test('filters to show only complete tasks', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='complete'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  test('sorts tasks by due date', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='all'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const taskElements = screen.getAllByText(/Task [1-3]/);
    // Task 2 (15th), Task 1 (20th), Task 3 (no due date) should be the order
    expect(taskElements[0]).toHaveTextContent('Task 2');
    expect(taskElements[1]).toHaveTextContent('Task 1');
    expect(taskElements[2]).toHaveTextContent('Task 3');
  });

  test('sorts tasks by status (incomplete first)', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='all'
        sortBy='status'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const taskElements = screen.getAllByText(/Task [1-3]/);
    // Incomplete tasks (1, 3) should come first, then complete (2)
    expect(taskElements[0]).toHaveTextContent('Task 1');
    expect(taskElements[2]).toHaveTextContent('Task 2');
  });

  test('sorts tasks by created date (newest first)', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='all'
        sortBy='createdAt'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    const taskElements = screen.getAllByText(/Task [1-3]/);
    // Task 3 (newest), Task 2, Task 1 (oldest)
    expect(taskElements[0]).toHaveTextContent('Task 3');
    expect(taskElements[1]).toHaveTextContent('Task 2');
    expect(taskElements[2]).toHaveTextContent('Task 1');
  });

  test('shows loading spinner when loading is true', () => {
    render(
      <TodoList
        tasks={[]}
        filter='all'
        sortBy='dueDate'
        loading={true}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows error alert when error is provided', () => {
    const errorMessage = 'Failed to load tasks';
    render(
      <TodoList
        tasks={[]}
        filter='all'
        sortBy='dueDate'
        loading={false}
        error={errorMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('shows empty state message when no tasks to display', () => {
    render(
      <TodoList
        tasks={[]}
        filter='all'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  test('renders TodoItem components for each task', () => {
    render(
      <TodoList
        tasks={mockTasks}
        filter='all'
        sortBy='dueDate'
        loading={false}
        error={null}
        {...mockHandlers}
      />
    );

    // Check that task descriptions are rendered (from TodoItem)
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Description 3')).toBeInTheDocument();
  });
});
