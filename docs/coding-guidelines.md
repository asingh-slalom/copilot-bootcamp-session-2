# Coding Guidelines

## Overview

This document establishes the coding standards and best practices for the Copilot Bootcamp project. All code contributions should adhere to these guidelines to ensure consistency, maintainability, and code quality across the full-stack JavaScript application.

## General Formatting Rules

### Indentation & Spacing

- Use **2 spaces** for indentation (not tabs)
- No trailing whitespace
- Use blank lines to separate logical sections within functions and between functions
- Maximum line length: **80 characters** for readability (aim for this, but 100 characters is acceptable for complex statements)
- Use single quotes for JavaScript strings (e.g., `'string'` not `"string"`)

### Brace Style

- Use opening braces on the same line (Egyptian style)
- Always use braces for control structures, even for single statements:

```javascript
// Good
if (condition) {
  doSomething();
}

// Avoid
if (condition)
  doSomething();
```

### Semicolons

- Always use semicolons at the end of statements
- Enable automatic semicolon insertion rules through ESLint

## Import Organization

### Import Order

Organize imports in the following order with blank lines between groups:

1. Node.js built-in modules
2. Third-party packages and dependencies
3. Local application modules and utilities
4. Style files (CSS)

### Examples

**Backend (Node.js):**
```javascript
const express = require('express');
const cors = require('cors');

const todoController = require('./controllers/todoController');
const errorMiddleware = require('./middleware/errorHandler');
```

**Frontend (React):**
```javascript
import React, { useState } from 'react';
import axios from 'axios';

import TodoList from './components/TodoList';
import { formatDate } from './utils/helpers';

import './App.css';
```

### Import Best Practices

- Use named imports when importing multiple items from a module
- Use default imports for modules that export a single primary export
- Avoid circular dependencies
- Keep imports at the top of files; lazy loading is acceptable for performance-critical routes

## Linter Usage

### Frontend: ESLint Configuration

The frontend is configured with ESLint through `react-app` preset installed via `create-react-app`.

- **Config Location**: `packages/frontend/package.json` (eslintConfig section)
- **Extends**: `react-app` and `react-app/jest` presets
- Run linting: This is automatically performed during development via `react-scripts`
- **Recommended**: Run `npm run test` in the frontend package to check for linting issues

### Backend: ESLint Setup

The backend currently uses Jest for testing. Consider adding ESLint for code quality:

```bash
# Recommended: Install ESLint in backend
npm install --save-dev eslint eslint-plugin-node
```

Create `.eslintrc.js` in `packages/backend/`:
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
  },
};
```

### Running Linting

- **Frontend**: Linting runs automatically during development
- **Backend**: Run `npx eslint src/` (once configured)
- **All**: Consider adding a root-level lint script for consistency

## Code Quality Best Practices

### DRY Principle (Don't Repeat Yourself)

- Extract repeated logic into reusable functions or utility modules
- Create shared utilities in `utils/` directories
- Use utility functions instead of duplicating logic across components

**Example:**
```javascript
// Good: Reusable utility
// utils/validators.js
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// In components
if (isValidEmail(userInput)) {
  // Process email
}

// Avoid: Repeating validation in multiple places
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput)) {
  // Process email
}
```

### SOLID Principles

**Single Responsibility**: Each function and component should have one reason to change
```javascript
// Good: Component focused on UI rendering only
function TodoItem({ todo, onDelete }) {
  return (
    <li>
      {todo.title}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

// Avoid: Component mixed with business logic
function TodoItem({ todo }) {
  const handleDelete = () => {
    fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
    // ... more logic
  };
  return <li>{todo.title}</li>;
}
```

### Naming Conventions

- **Files**: Use camelCase for JavaScript files (`todoController.js`, `helpers.js`)
- **Constants**: Use UPPER_SNAKE_CASE for truly constant values
- **Variables & Functions**: Use camelCase (`let userData`, `function getTodos()`)
- **React Components**: Use PascalCase (`TodoList.js`, `TodoItem.js`)
- **Boolean Variables**: Prefix with `is`, `has`, or `can` (`isLoading`, `hasError`)
- **Descriptive Names**: Use clear, intention-revealing names

```javascript
// Good
const isUserAuthenticated = true;
const MAX_RETRIES = 3;
function calculateTotalPrice(items) { ... }

// Avoid
const auth = true;
const mr = 3;
function calc(i) { ... }
```

### Code Comments

- Write comments that explain *why*, not *what* (code shows what it does)
- Use single-line comments for brief explanations
- Use block comments for complex sections or before functions
- Keep comments up-to-date with code changes

```javascript
// Good: Explains the reason
// Retry with exponential backoff for transient network failures
while (retries < MAX_RETRIES && !success) {
  attemptRequest();
}

// Avoid: Obvious comment
// Increment the counter
retries++;
```

### Error Handling

- Always handle errors explicitly
- Use try-catch for async operations
- Provide meaningful error messages
- Log errors appropriately (not sensitive data)

```javascript
// Good
try {
  const response = await fetch('/api/todos');
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error('Failed to fetch todos:', error.message);
  throw error;
}
```

### Avoid Magic Numbers

- Extract magic numbers into named constants
- Provide context through clear variable names

```javascript
// Good
const DEBOUNCE_DELAY_MS = 300;
const MIN_PASSWORD_LENGTH = 8;

function debounceSearch(query) {
  setTimeout(() => search(query), DEBOUNCE_DELAY_MS);
}

// Avoid
setTimeout(() => search(query), 300);
if (password.length < 8) { ... }
```

## React-Specific Guidelines

### Component Structure

- Use functional components with hooks (no class components unless necessary)
- Keep components small and focused
- Separate presentation logic from business logic

```javascript
// Good: Simple, focused component
function TodoItem({ todo, onToggle }) {
  return (
    <li onClick={() => onToggle(todo.id)}>
      {todo.title}
    </li>
  );
}

// Avoid: Too much logic in component
function TodoItem({ todo }) {
  const [completed, setCompleted] = useState(todo.completed);
  const handleToggle = () => {
    setCompleted(!completed);
    fetch(`/api/todos/${todo.id}`, { ... });
    // ... more complex logic
  };
  return <li onClick={handleToggle}>{todo.title}</li>;
}
```

### Hook Usage

- Call hooks only at the top level of components
- Create custom hooks to extract reusable logic
- Use the ESLint `eslint-plugin-react-hooks` to catch violations (included in `react-app` config)

### Props and State Management

- Keep state as local as possible
- Lift state only when multiple components need access
- Use props to pass data down and callbacks up
- Avoid unnecessary prop drilling; consider context for deeply nested components

## Node.js/Backend Guidelines

### Middleware Organization

- Order middleware correctly (authentication before authorization)
- Keep middleware focused and reusable
- Use middleware for cross-cutting concerns (logging, error handling, CORS)

### Error Handling Middleware

Always implement centralized error handling:

```javascript
// middleware/errorHandler.js
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message,
    status: error.status || 500,
  });
});
```

### Route Organization

- Group related routes by feature
- Keep route files focused on HTTP concerns
- Delegate business logic to controllers/services

## Testing Best Practices

- Write tests alongside production code
- Aim for high coverage on critical paths
- Test behavior, not implementation details
- Use descriptive test names that explain what is being tested and the expected outcome
- Keep tests isolated and independent
- Avoid testing framework internals; test user-facing behavior

```javascript
// Good test name
it('should display error message when todo creation fails', () => {
  // test code
});

// Avoid vague test names
it('should work', () => {
  // test code
});
```

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] Code follows all formatting rules (indentation, spacing, line length)
- [ ] Imports are organized correctly
- [ ] No linting errors or warnings
- [ ] Variable and function names are clear and descriptive
- [ ] DRY principle is applied; no unnecessary duplication
- [ ] Error handling is in place
- [ ] Comments are present for complex logic
- [ ] Tests are written for new functionality
- [ ] No hardcoded values (use constants instead)
- [ ] Code passes all tests locally
- [ ] No console.log statements left in production code (use proper logging)

## Resources

- [ESLint Documentation](https://eslint.org/)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [JavaScript Standard Style](https://standardjs.com/)
