# TODO App - Implementation Plan

## Overview

This document outlines the phased approach to expand the TODO application from a starter template into a fully-featured task management system. The plan follows the coding guidelines, testing standards, and UI requirements established in the project documentation.

## Status Summary

**Completed Phases:**
- ✅ **Phase 1: Backend API** - All CRUD endpoints, validation, error handling, and 30+ integration tests passing
- ✅ **Phase 2: Frontend UI** - All components (TodoItem, TodoList, TodoForm, TaskFilter, TaskSort), Material-UI theming, state management, and API integration
- ✅ **Phase 3: Frontend Testing** - 72 unit tests passing (TodoList, TodoItem, TodoForm, helpers) with comprehensive coverage
- ✅ **Phase 4: Data Persistence** - localStorage persistence for offline support

**In Progress:**
- Phase 5: Polish & Performance (Ready to implement)

**Test Execution Summary (Phase 3):**
- TodoList.test.js: 10/10 passing ✅
- TodoItem.test.js: 15/15 passing ✅
- TodoForm.test.js: 7/7 passing ✅
- helpers.test.js: 40/40 passing ✅
- **Total: 72/72 tests passing**

**Ready for Manual Testing:**
- Backend API fully functional on port 3030  
- Frontend fully functional on port 3000
- All features integrated and operational

---

## Quick Start for Manual Testing

### Start the Application

```bash
# From root directory
npm install        # Install all dependencies
npm run start      # Starts both frontend (3000) and backend (3030)
```

### Access the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3030/api/tasks

### Test Features
1. Add new tasks with title, description, due date, and priority
2. Mark tasks as complete/incomplete with checkbox
3. Edit existing tasks
4. Delete tasks with confirmation dialog
5. Filter by status (All, Active, Completed)
6. Sort by Due Date, Status, or Created Date
7. Data persists in localStorage and backend
8. Try refreshing the page - tasks remain in localStorage

---

## Phase 1: Core Backend Features

**Objective**: Build the Express.js API to support full task management

### 1.1 Task CRUD API Endpoints (`packages/backend/`)

Create Express.js routes and controllers to handle the following endpoints:

- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Retrieve all tasks with filtering/sorting
- `GET /api/tasks/:id` - Retrieve single task
- `PUT /api/tasks/:id` - Update task (title, description, status, due date, priority)
- `DELETE /api/tasks/:id` - Delete task

**Standards**:
- Follow coding guidelines: 2-space indentation, import organization, ESLint compliance
- Use proper HTTP status codes
- Return consistent JSON response format

### 1.2 Data Model & Persistence

**Task Schema**:
```javascript
{
  id: string (unique identifier),
  title: string (required),
  description: string (optional),
  status: 'incomplete' | 'complete' (default: 'incomplete'),
  dueDate: ISO string (optional),
  priority: 'low' | 'medium' | 'high' (optional),
  createdAt: ISO timestamp,
  updatedAt: ISO timestamp
}
```

**Implementation**:
- Start with in-memory storage for MVP
- Later: Upgrade to SQLite or database layer
- Add request validation middleware
- Add error handling middleware

### 1.3 Business Logic

Implement the following logic in controllers:

- **Overdue Detection**: Flag tasks with dueDate in the past
- **Sorting**: By due date (earliest first), status (incomplete first), creation date
- **Filtering**: By status (active/completed/all), priority level

### 1.4 Integration Tests (`packages/backend/__tests__/integration/`)

**File**: `todos-api.test.js`

Test coverage:
- ✅ Create task with valid data
- ✅ Update task properties
- ✅ Delete task
- ✅ Retrieve all tasks
- ✅ Retrieve single task (success and 404)
- ✅ Filter tasks by status
- ✅ Sort tasks by different criteria
- ✅ Validate required fields
- ✅ Error handling for invalid requests

**Tools**: Jest + Supertest  
**Standards**: Test isolation with setup/teardown, descriptive test names

---

## Phase 2: Frontend Components & UI

**Objective**: Build React UI with Material-UI components per UI guidelines

### 2.1 Core Components (`packages/frontend/src/components/`)

Create the following reusable React components:

- **`TodoList.jsx`** - Main container displaying filtered/sorted task list
  - Props: tasks[], filters, sortBy, onTaskUpdate, onTaskDelete
  - Renders TodoItem components in a grid or list layout
  
- **`TodoItem.jsx`** - Individual task card component
  - Display: title, description, due date, priority badge, status
  - Actions: complete toggle, edit, delete buttons
  - Visual states: overdue highlighting, priority colors
  
- **`TodoForm.jsx`** - Add/edit task form (modal or inline)
  - Form fields: title (required), description, dueDate, priority
  - Validation feedback
  - Submit and cancel actions
  
- **`TaskFilter.jsx`** - Filter control buttons
  - Options: All, Active (incomplete), Completed
  - Active state highlighting
  
- **`TaskSort.jsx`** - Sorting dropdown/select
  - Options: By Due Date, By Status, By Created Date
  - Default: By Due Date

### 2.2 Key Features

Implement the following user-facing features:

- **Quick Add Task**: Input field at top with Enter key support for fast task creation
- **Mark Complete/Incomplete**: Checkbox or toggle on each task
- **Edit Task**: Click to open form modal with pre-filled data
- **Delete Task**: Delete button with confirmation dialog (MUI Dialog)
- **Visual Overdue Indicators**: Red border/background for overdue tasks (use `#FFEBEE` background, `#EF5350` border)
- **Priority Badges**: Visual tags showing High/Medium/Low priority with icon
- **Formatted Due Dates**: Display due dates in readable format (e.g., "Mar 15, 2026")
- **Empty State**: Helpful message when task list is empty

### 2.3 State Management (`packages/frontend/src/`)

Use React hooks for state management:

```javascript
// App-level state
const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'status', 'createdAt'
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [openForm, setOpenForm] = useState(false);
const [editingTask, setEditingTask] = useState(null);
```

**API Integration**:
- Fetch tasks on component mount
- Call API on create/update/delete
- Handle loading and error states
- Sync state with backend

### 2.4 Styling with Material-UI

**Theme Setup** (`packages/frontend/src/styles/theme.js`):
- Import MUI theme and color palette from guidelines
- Define custom theme with primary/secondary colors
- Use ThemeProvider to wrap App

**Component Styling**:
- Use MUI components: Button, Dialog, TextField, Card, Checkbox, etc.
- Apply color palette from UI guidelines
- Typography: Roboto font, follow font size standards
- Spacing: Use MUI spacing system (8px grid)

### 2.5 Responsive Design

- **Mobile First**: Design for mobile first, then enhance for larger screens
- **Breakpoints**: Handle tablet (768px+) and desktop (1024px+) layouts
- **Touch friendly**: Adequate button sizes (48px minimum) for mobile
- **Flexible Layout**: Use flexbox/grid for responsive containers

---

## Phase 3: Frontend Testing

**Objective**: Comprehensive test coverage for React components

### 3.1 Unit Tests (`packages/frontend/src/__tests__/`)

**File**: `TodoList.test.js`
- Render task list correctly
- Apply filters (all, active, completed)
- Apply sorting (due date, status, created)
- Trigger edit/delete actions

**File**: `TodoItem.test.js`
- Render task data correctly
- Display priority badges
- Toggle complete status
- Handle edit/delete clicks

**File**: `TodoForm.test.js`
- Render form fields
- Validate required fields
- Submit form with valid data
- Display validation errors
- Pre-fill form for editing

**File**: `helpers.test.js` (or utils.test.js)
- Test date formatting utilities
- Test filtering/sorting logic
- Test validation functions

### 3.2 Integration Tests (`packages/backend/__tests__/integration/`)

Expand or create `todos-api.test.js`:
- Verify API responses match frontend expectations
- Test data format and structure
- Validate error responses

### 3.3 End-to-End Tests (`tests/e2e/`)

**File Structure**:
```
tests/e2e/
├── pages/
│   └── TodoPage.js (Page Object Model)
└── todo-workflow.spec.js
```

**POM Page Object** (`TodoPage.js`):
```javascript
class TodoPage {
  constructor(page) { this.page = page; }
  
  async goto() { await this.page.goto('http://localhost:3000'); }
  async addTask(title, description, dueDate) { ... }
  async completeTask(index) { ... }
  async editTask(index, data) { ... }
  async deleteTask(index) { ... }
  async filterByStatus(status) { ... }
  async sortBy(criterion) { ... }
  async getTaskList() { ... }
  // ... more methods
}
```

**Test Cases** (`todo-workflow.spec.js`):
1. ✅ Add a new task and verify it appears in list
2. ✅ Mark a task as complete and verify status change
3. ✅ Edit task title and verify change persists
4. ✅ Delete a task and verify removal from list
5. ✅ Filter tasks by Active status
6. ✅ Sort tasks by due date (earliest first)
7. ✅ Verify overdue task highlighting
8. ✅ Test responsive UI on mobile viewport (375x667)

**Configuration**:
- One browser only (chromium)
- Run against `http://localhost:3000` and `http://localhost:3030`
- Isolated tests with no ordering dependencies

---

## Phase 4: Data Persistence & Local Storage

**Objective**: Ensure tasks persist across sessions

### 4.1 Frontend Local Storage

Implement in `packages/frontend/src/App.js`:

```javascript
// Load tasks from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) setTasks(JSON.parse(saved));
}, []);

// Save tasks to localStorage whenever they change
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);
```

### 4.2 Backend Data Persistence (Future Enhancement)

When ready to upgrade from in-memory storage:
- Add database schema migrations
- Implement data models with ORM (e.g., Sequelize, TypeORM)
- Add user authentication layer
- Implement sync between frontend and backend

---

## Phase 5: Polish & Performance

**Objective**: Optimize and finalize the application

### 5.1 Performance Optimizations

- **Memoization**: Use `React.memo()` for TaskItem, TaskSort, TaskFilter
- **useMemo Hooks**: Memoize filtered/sorted task lists
- **useCallback Hooks**: Memoize event handlers passed to child components
- **Virtual Scrolling**: For large task lists (100+ items), consider react-window
- **Debouncing**: Debounce API calls during rapid edits (e.g., 500ms)

### 5.2 Accessibility (a11y)

- **Semantic HTML**: Use proper HTML elements (button, label, form, main, etc.)
- **ARIA Labels**: Add aria-labels to icon buttons and form inputs
- **Keyboard Navigation**: All features accessible via Tab, Enter, Escape, Arrow keys
- **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 ratio)
- **Focus Indicators**: Visible focus rings on interactive elements

### 5.3 Code Quality & Documentation

- **ESLint**: Run `npm run lint` and fix all warnings
- **Code Review**: Peer review all code before merging
- **Comments**: Add JSDoc comments to complex functions
- **Refactoring**: Extract reusable utilities and constants
- **Dependencies**: Keep dependencies up to date and audit for vulnerabilities

---

## Development Workflow

### Available NPM Scripts

Execute from root directory:

```bash
# Install all dependencies
npm install

# Start both frontend (port 3000) and backend (port 3030) in development mode
npm run start

# Run unit and integration tests
npm test

# Run E2E tests with Playwright
npm run test:e2e

# Run all tests (unit, integration, E2E)
npm run test:all

# Navigate to specific package for detailed work
cd packages/frontend
npm test      # Test frontend only
npm run build # Build production bundle

cd packages/backend
npm test      # Test backend only
npm start     # Start backend only
```

### Port Configuration

- **Frontend**: `http://localhost:3000` (React dev server)
- **Backend API**: `http://localhost:3030` (Express server)
- Override with `PORT` environment variable

---

## File Structure to Create

```
packages/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── todoController.js
│   │   ├── routes/
│   │   │   └── todos.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   └── models/
│   │       └── Task.js
│   ├── __tests__/
│   │   └── integration/
│   │       └── todos-api.test.js
│   └── index.js (entry point)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   └── TaskSort.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── theme.js
│   │   ├── __tests__/
│   │   │   ├── TodoList.test.js
│   │   │   ├── TodoItem.test.js
│   │   │   ├── TodoForm.test.js
│   │   │   └── helpers.test.js
│   │   ├── App.js (main component)
│   │   └── index.js (entry point)
│   └── public/
│
└── tests/
    └── e2e/
        ├── pages/
        │   └── TodoPage.js
        └── todo-workflow.spec.js
```

---

## Key Guidelines to Follow

### Code Standards
✅ **Indentation**: 2 spaces (no tabs)  
✅ **Strings**: Single quotes in JavaScript  
✅ **Semicolons**: Always required  
✅ **Line Length**: Aim for 80 characters, max 100  
✅ **Imports**: Organize in groups (Node.js → packages → local → CSS)  
✅ **Linting**: Run ESLint and fix all issues  

### Testing Standards
✅ **Unit Tests**: Jest, one component/module per test file  
✅ **Integration Tests**: Jest + Supertest for API endpoints  
✅ **E2E Tests**: Playwright with Page Object Model pattern  
✅ **Test Isolation**: Each test independent with setup/teardown  
✅ **Naming**: `*.test.js` for unit/integration, `*.spec.js` for E2E  

### UI/UX Standards
✅ **Component Library**: Material-UI v5+  
✅ **Color Palette**: Follow defined colors (Primary Blue, Warning Orange, etc.)  
✅ **Typography**: Roboto font family, sizes from guidelines  
✅ **Responsive**: Mobile-first approach, test on multiple devices  
✅ **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation  

### Data Standards
✅ **Persistence**: Local storage for MVP, backend database for production  
✅ **Auto-Save**: Changes save automatically without explicit action  
✅ **Validation**: Server-side and client-side validation  
✅ **Error Handling**: User-friendly error messages  

---

## Execution Checklist

Use this checklist to track progress:

### Phase 1: Backend
- [x] Set up backend folder structure
- [x] Implement Task model/schema
- [x] Implement CRUD controllers
- [x] Implement CRUD routes
- [x] Add validation middleware
- [x] Add error handling middleware
- [x] Write integration tests
- [x] All tests passing ✓

### Phase 2: Frontend
- [x] Install Material-UI and dependencies
- [x] Set up theme and styling
- [x] Create TodoList component
- [x] Create TodoItem component
- [x] Create TodoForm component
- [x] Create TaskFilter component
- [x] Create TaskSort component
- [x] Implement state management (hooks)
- [x] Integrate API calls
- [x] Handle loading/error states
- [x] Implement responsive design (Material-UI responsive)

### Phase 3: Frontend Testing
- [ ] Write TodoList unit tests
- [ ] Write TodoItem unit tests
- [ ] Write TodoForm unit tests
- [ ] Write utilities tests
- [ ] Expand integration tests
- [ ] Set up Playwright config
- [ ] Write E2E test page object
- [ ] Write 8 E2E test cases
- [ ] All tests passing ✓

### Phase 4: Data Persistence
- [x] Implement localStorage in frontend
- [x] Test persistence across sessions
- [ ] (Optional) Add backend database

### Phase 5: Polish & Performance
- [ ] Add performance optimizations (memoization, debouncing)
- [ ] Implement accessibility features
- [ ] Run ESLint and fix issues
- [ ] Code review and refactoring
- [ ] Final testing across browsers
- [ ] Documentation complete

---

## Success Criteria

✅ All CRUD operations work end-to-end  
✅ Tasks persist across browser sessions  
✅ Filtering and sorting work correctly  
✅ UI is responsive on mobile/tablet/desktop  
✅ Unit test coverage > 80%  
✅ Integration tests pass  
✅ E2E tests pass consistently  
✅ Code follows all guidelines  
✅ App is accessible (WCAG AA)  
✅ Performance optimized (Lighthouse > 90)  

---

## Next Steps

1. **Review** this plan with team
2. **Prioritize** features if resources are limited
3. **Assign** team members to phases
4. **Begin Phase 1**: Backend API development
5. **Track Progress**: Update checklist as work completes
