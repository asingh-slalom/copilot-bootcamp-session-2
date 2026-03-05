# Testing Guidelines

This document outlines the testing standards and best practices for the TODO application project.

## Unit Tests

### Framework and Tools
- Use **Jest** to test individual functions and React components in isolation

### Naming Convention
- Unit tests should use the naming convention `*.test.js` or `*.test.ts`

### Directory Structure
- **Backend** unit tests: `packages/backend/__tests__/` directory
- **Frontend** unit tests: `packages/frontend/src/__tests__/` directory

### File Naming
- Name unit test files to match what they're testing
- Example: `app.test.js` for testing `app.js`

## Integration Tests

### Framework and Tools
- Use **Jest + Supertest** to test backend API endpoints with real HTTP requests

### Naming Convention
- Integration tests should use the naming convention `*.test.js` or `*.test.ts`

### Directory Structure
- Integration tests should be placed in `packages/backend/__tests__/integration/` directory

### File Naming
- Name integration test files intelligently based on what they test
- Example: `todos-api.test.js` for testing TODO API endpoints

## End-to-End (E2E) Tests

### Framework and Tools
- Use **Playwright** to test complete UI workflows through browser automation

### Naming Convention
- E2E tests should use the naming convention `*.spec.js` or `*.spec.ts`

### Directory Structure
- E2E tests should be placed in `tests/e2e/` directory

### File Naming
- Name E2E test files based on the user journey they test
- Example: `todo-workflow.spec.js`

### Browser Configuration
- Playwright tests must use **one browser only**

### Design Pattern
- Playwright tests must use the **Page Object Model (POM) pattern** for maintainability

### Test Scope
- Limit E2E tests to **5-8 critical user journeys**
- Focus on happy paths and key edge cases, not exhaustive coverage

## Port Configuration

### Environment Variables
Always use environment variables with sensible defaults for port configuration:

#### Backend
```javascript
const PORT = process.env.PORT || 3030;
```

#### Frontend
- React's default port is `3000`
- Can be overridden with `PORT` environment variable

### Benefits
- Allows CI/CD workflows to dynamically detect ports
- Enables flexible deployment configurations

## Test Quality Standards

### Test Isolation
- All tests must be isolated and independent
- Each test should set up its own data
- Tests should not rely on other tests
- Tests must have no execution order dependencies

### Initialization & Cleanup
- Setup and teardown hooks are **required**
- Tests must succeed on multiple runs
- Each test run should produce consistent results

### Feature Implementation
- All new features should include appropriate tests
- Tests should be maintainable and follow best practices
- Tests serve as documentation for expected behavior

## Best Practices Summary

- ✅ Test in isolation - each test is self-contained
- ✅ Use meaningful test names - describe what is being tested and expected outcome
- ✅ Mock external dependencies - isolate the code under test
- ✅ Keep tests focused - test one thing per test
- ✅ Maintain test data - use realistic but minimal test data
- ✅ Keep E2E tests lean - focus on critical paths only
- ✅ Use page objects for E2E tests - improve maintainability and reduce duplication
- ✅ Run tests frequently - catch issues early in development
