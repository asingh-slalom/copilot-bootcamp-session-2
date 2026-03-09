import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/tasks handler
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Test description 1',
          status: 'incomplete',
          priority: 'high',
          dueDate: '2026-03-15T00:00:00.000Z',
          createdAt: '2026-03-09T00:00:00.000Z',
          updatedAt: '2026-03-09T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Test description 2',
          status: 'complete',
          priority: 'low',
          dueDate: '2026-03-20T00:00:00.000Z',
          createdAt: '2026-03-08T00:00:00.000Z',
          updatedAt: '2026-03-09T00:00:00.000Z',
        },
      ])
    );
  }),

  // POST /api/tasks handler
  rest.post('/api/tasks', (req, res, ctx) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        title,
        description: req.body.description || '',
        status: 'incomplete',
        priority: req.body.priority || 'low',
        dueDate: req.body.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders TODO App header', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for the header to appear
    await waitFor(() => {
      expect(screen.getByText(/TODO App/i)).toBeInTheDocument();
    });
  });

  test('renders Add Task button', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for Add Task button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });
  });

  test('loads and displays tasks from API', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('displays component containers', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for main content area to render
    await waitFor(() => {
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  test('displays error message when API fails', async () => {
    // Override the handler to simulate a network error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
    });
  });
});

