# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Project Status

**Current Phase**: Phase 5 - Polish & Performance Optimization

**Completed** ✅:
- Phase 1: Backend API with CRUD endpoints, validation, error handling
- Phase 2: Frontend UI components with Material-UI theming and state management
- Phase 3: Comprehensive test coverage (11 backend unit tests, 77 frontend unit tests, 30 integration tests, 6 E2E tests)
- Phase 4: Data persistence with localStorage

**Test Coverage**:
- Backend Unit Tests: 11/11 passing (app.test.js)
- Backend Integration Tests: 30/30 passing (todos-api.test.js)
- Frontend Unit Tests: 77/77 passing (App.test.js, TodoList, TodoItem, TodoForm, helpers)
- E2E Tests: 6 tests (Playwright configured and ready)

## Documentation Overview

- [Project Overview](../docs/project-overview.md) - Overview of the project
- [Functional Requirements](../docs/functional-requirements.md) - Core functional requirements for the TODO app
- [Coding Guidelines](../docs/coding-guidelines.md) - Coding standards, formatting rules, import organization, linting, and best practices
- [Testing Guidelines](../docs/testing-guidelines.md) - Testing standards, best practices, and directory structure for unit, integration, and E2E tests
- [UI Guidelines](../docs/ui-guidelines.md) - UI guidelines, design system, and accessibility requirements for the TODO app
- [Implementation Plan](../docs/implementation-plan.md) - Detailed implementation phases and progress checklist

## Project Structure

### Key Directories
- `packages/backend/` - Express.js API server (port 3030)
  - `src/` - Source code (models, controllers, routes, middleware)
  - `__tests__/unit/` - Backend unit tests
  - `__tests__/integration/` - Backend integration tests
- `packages/frontend/` - React application (port 3000)
  - `src/components/` - Reusable React components
  - `src/utils/` - Helper functions and utilities
  - `src/styles/` - Material-UI theme configuration
  - `src/__tests__/` - Frontend unit tests
- `tests/e2e/` - End-to-end tests with Playwright
  - `pages/` - Page Object Model classes
  - `*.spec.js` - Playwright test files

## Key Development Commands

```bash
npm install              # Install all dependencies
npm run start           # Start both frontend and backend
npm test               # Run all unit tests
npm run test:e2e       # Run E2E tests
npm run test:all       # Run all tests

# Frontend only
cd packages/frontend
npm test               # Test frontend
npm run build          # Build production bundle

# Backend only
cd packages/backend
npm test               # Test backend
npm start              # Start backend only
```

## Code Standards (Follow These!)

✅ **Indentation**: 2 spaces (no tabs)
✅ **Strings**: Single quotes in JavaScript
✅ **Semicolons**: Always required
✅ **Imports**: Organize in groups (Node.js → packages → local → CSS)
✅ **Components**: Use React.memo() for optimization, useCallback for handlers
✅ **Testing**: Jest for unit tests, Supertest for API tests, Playwright for E2E

## Next Phase: Phase 5 - Polish & Performance

When working on Phase 5, focus on:
- Performance optimizations (memoization, debouncing, caching)
- Accessibility improvements (WCAG AA compliance)
- Code quality (ESLint, JSDoc comments, refactoring)
- Testing & QA (lighthouse score ≥90, cross-browser testing)
