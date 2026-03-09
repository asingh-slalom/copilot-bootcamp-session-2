import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../components/TodoForm';

describe('TodoForm Component', () => {
  const mockHandlers = {
    onSave: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dialog when open is true', () => {
    render(
      <TodoForm
        open={true}
        task={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    const { container } = render(
      <TodoForm
        open={false}
        task={null}
        {...mockHandlers}
      />
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  test('shows "Add New Task" title when task is null', () => {
    render(
      <TodoForm
        open={true}
        task={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  test('shows "Edit Task" title when editing a task', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'incomplete',
      dueDate: '2026-03-20T00:00:00.000Z',
      priority: 'high',
      createdAt: '2026-03-01T00:00:00.000Z',
    };

    render(
      <TodoForm
        open={true}
        task={task}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  test('pre-fills form fields when editing a task', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'incomplete',
      dueDate: '2026-03-20T00:00:00.000Z',
      priority: 'high',
      createdAt: '2026-03-01T00:00:00.000Z',
    };

    render(
      <TodoForm
        open={true}
        task={task}
        {...mockHandlers}
      />
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-03-20')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoForm
        open={true}
        task={null}
        {...mockHandlers}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  test('renders form with input fields', () => {
    render(
      <TodoForm
        open={true}
        task={null}
        {...mockHandlers}
      />
    );

    // Verify form has important input elements
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add more details...')).toBeInTheDocument();
  });
});

