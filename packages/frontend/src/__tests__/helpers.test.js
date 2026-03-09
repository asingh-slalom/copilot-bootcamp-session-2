import {
  formatDate,
  isOverdue,
  getPriorityColor,
  getPriorityLabel,
  filterTasks,
  sortTasks,
  validateTask,
  debounce,
} from '../utils/helpers';

describe('Helper Utilities', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      status: 'incomplete',
      dueDate: '2026-03-20T00:00:00.000Z',
      priority: 'high',
      createdAt: '2026-03-01T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Task 2',
      status: 'complete',
      dueDate: '2026-03-15T00:00:00.000Z',
      priority: 'medium',
      createdAt: '2026-03-02T10:00:00.000Z',
    },
    {
      id: '3',
      title: 'Task 3',
      status: 'incomplete',
      dueDate: null,
      priority: 'low',
      createdAt: '2026-03-03T10:00:00.000Z',
    },
  ];

  describe('formatDate', () => {
    test('formats ISO date string correctly', () => {
      // Use a date in the middle of the day to avoid timezone edge cases
      const result = formatDate('2026-03-20T12:00:00.000Z');
      expect(result).toMatch(/Mar.*20.*2026/);
    });

    test('returns empty string for null date', () => {
      const result = formatDate(null);
      expect(result).toBe('');
    });

    test('returns empty string for undefined date', () => {
      const result = formatDate(undefined);
      expect(result).toBe('');
    });

    test('returns empty string for empty string', () => {
      const result = formatDate('');
      expect(result).toBe('');
    });

    test('formats various dates correctly', () => {
      // Use times in the middle of the day to avoid timezone edge cases
      const jan1Result = formatDate('2026-01-01T12:00:00.000Z');
      const dec31Result = formatDate('2026-12-31T12:00:00.000Z');
      const jun15Result = formatDate('2025-06-15T12:00:00.000Z');
      
      expect(jan1Result).toMatch(/Jan.*1.*2026/);
      expect(dec31Result).toMatch(/Dec.*31.*2026/);
      expect(jun15Result).toMatch(/Jun.*15.*2025/);
    });
  });

  describe('isOverdue', () => {
    test('returns true for incomplete task with past due date', () => {
      const task = {
        dueDate: '2020-01-01T00:00:00.000Z',
        status: 'incomplete',
      };
      expect(isOverdue(task)).toBe(true);
    });

    test('returns false for incomplete task with future due date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const task = {
        dueDate: futureDate.toISOString(),
        status: 'incomplete',
      };
      expect(isOverdue(task)).toBe(false);
    });

    test('returns false for completed task with past due date', () => {
      const task = {
        dueDate: '2020-01-01T00:00:00.000Z',
        status: 'complete',
      };
      expect(isOverdue(task)).toBe(false);
    });

    test('returns false for task without due date', () => {
      const task = {
        dueDate: null,
        status: 'incomplete',
      };
      expect(isOverdue(task)).toBe(false);
    });
  });

  describe('getPriorityColor', () => {
    test('returns high priority color', () => {
      expect(getPriorityColor('high')).toBe('#d32f2f');
    });

    test('returns medium priority color', () => {
      expect(getPriorityColor('medium')).toBe('#f57c00');
    });

    test('returns low priority color', () => {
      expect(getPriorityColor('low')).toBe('#388e3c');
    });

    test('returns default color for unknown priority', () => {
      expect(getPriorityColor('unknown')).toBe('#757575');
      expect(getPriorityColor(null)).toBe('#757575');
      expect(getPriorityColor('')).toBe('#757575');
    });
  });

  describe('getPriorityLabel', () => {
    test('returns uppercase priority label', () => {
      expect(getPriorityLabel('high')).toBe('HIGH');
      expect(getPriorityLabel('medium')).toBe('MEDIUM');
      expect(getPriorityLabel('low')).toBe('LOW');
    });

    test('returns empty string for null priority', () => {
      expect(getPriorityLabel(null)).toBe('');
    });

    test('returns empty string for undefined priority', () => {
      expect(getPriorityLabel(undefined)).toBe('');
    });
  });

  describe('filterTasks', () => {
    test('returns all tasks when filter is "all"', () => {
      const result = filterTasks(mockTasks, 'all');
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockTasks);
    });

    test('returns only incomplete tasks when filter is "incomplete"', () => {
      const result = filterTasks(mockTasks, 'incomplete');
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'incomplete')).toBe(true);
    });

    test('returns only complete tasks when filter is "complete"', () => {
      const result = filterTasks(mockTasks, 'complete');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    test('returns all tasks for unknown filter', () => {
      const result = filterTasks(mockTasks, 'unknown');
      expect(result).toHaveLength(3);
    });

    test('returns empty array for empty task list', () => {
      const result = filterTasks([], 'incomplete');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortTasks', () => {
    test('sorts by due date (earliest first)', () => {
      const result = sortTasks(mockTasks, 'dueDate');
      expect(result[0].id).toBe('2'); // 2026-03-15
      expect(result[1].id).toBe('1'); // 2026-03-20
      expect(result[2].id).toBe('3'); // null dueDate at end
    });

    test('sorts by status (incomplete first)', () => {
      const result = sortTasks(mockTasks, 'status');
      // Incomplete tasks first (1, 3), then complete (2)
      expect(result[0].status).toBe('incomplete');
      expect(result[1].status).toBe('incomplete');
      expect(result[2].status).toBe('complete');
    });

    test('sorts by created date (newest first)', () => {
      const result = sortTasks(mockTasks, 'createdAt');
      expect(result[0].id).toBe('3'); // 2026-03-03
      expect(result[1].id).toBe('2'); // 2026-03-02
      expect(result[2].id).toBe('1'); // 2026-03-01
    });

    test('returns copy of original array (does not mutate)', () => {
      const original = JSON.parse(JSON.stringify(mockTasks));
      const result = sortTasks(mockTasks, 'dueDate');
      expect(result).not.toBe(mockTasks);
      expect(mockTasks).toEqual(original);
    });

    test('returns array unchanged for unknown sort criterion', () => {
      const result = sortTasks(mockTasks, 'unknown');
      expect(result).toHaveLength(3);
    });

    test('handles tasks with null due dates correctly', () => {
      const result = sortTasks(mockTasks, 'dueDate');
      // Tasks with null due dates should be at the end
      expect(result[result.length - 1].dueDate).toBeNull();
    });
  });

  describe('validateTask', () => {
    test('validates task with all required fields', () => {
      const task = {
        title: 'Valid Task',
        description: 'Description',
        dueDate: '2026-03-20',
        priority: 'high',
        status: 'incomplete',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('returns error for missing title', () => {
      const task = {
        title: '',
        description: 'Description',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    test('returns error for whitespace-only title', () => {
      const task = {
        title: '   ',
        description: 'Description',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    test('returns error for invalid due date', () => {
      const task = {
        title: 'Valid Task',
        dueDate: 'invalid-date',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid due date');
    });

    test('returns error for invalid priority', () => {
      const task = {
        title: 'Valid Task',
        priority: 'urgent',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid priority');
    });

    test('returns error for invalid status', () => {
      const task = {
        title: 'Valid Task',
        status: 'pending',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status');
    });

    test('allows null for optional fields', () => {
      const task = {
        title: 'Valid Task',
        description: null,
        dueDate: null,
        priority: null,
        status: 'incomplete',
      };
      const result = validateTask(task);
      expect(result.isValid).toBe(true);
    });

    test('allows valid priority values', () => {
      ['low', 'medium', 'high'].forEach(priority => {
        const task = { title: 'Task', priority };
        const result = validateTask(task);
        expect(result.errors).not.toContain('Invalid priority');
      });
    });

    test('allows valid status values', () => {
      ['incomplete', 'complete'].forEach(status => {
        const task = { title: 'Task', status };
        const result = validateTask(task);
        expect(result.errors).not.toContain('Invalid status');
      });
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('arg1');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(499);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledWith('arg1');
    });

    test('only calls function once if invoked multiple times within delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    test('calls function again if invoked after delay expires', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('arg1');
      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);

      debouncedFn('arg2');
      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('arg2');
    });

    test('handles multiple arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('arg1', 'arg2', 'arg3');
      jest.advanceTimersByTime(300);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });
});
