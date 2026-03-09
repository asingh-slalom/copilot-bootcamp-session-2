/**
 * Database Seed
 * Populates the in-memory database with sample test data
 */

const TaskModel = require('./models/Task');

const SAMPLE_TASKS = [
  {
    title: 'Set up project repository',
    description: 'Initialize git repository and basic project structure',
    status: 'complete',
    priority: 'high',
    dueDate: '2026-02-28',
  },
  {
    title: 'Design database schema',
    description: 'Create Task model with all required fields',
    status: 'complete',
    priority: 'high',
    dueDate: '2026-03-01',
  },
  {
    title: 'Build REST API endpoints',
    description: 'Implement CRUD operations for tasks',
    status: 'complete',
    priority: 'high',
    dueDate: '2026-03-03',
  },
  {
    title: 'Write unit tests',
    description: 'Add test coverage for controllers and models',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-03-10',
  },
  {
    title: 'Build task filtering UI',
    description: 'Implement filter by status and priority in frontend',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-03-15',
  },
  {
    title: 'Add task sorting feature',
    description: 'Allow sorting by date, priority, and status',
    status: 'incomplete',
    priority: 'medium',
    dueDate: '2026-03-20',
  },
  {
    title: 'Deploy to production',
    description: 'Set up CI/CD pipeline and deploy to cloud',
    status: 'incomplete',
    priority: 'high',
    dueDate: '2026-04-01',
  },
  {
    title: 'Add dark mode support',
    description: 'Implement theme switching in the UI',
    status: 'incomplete',
    priority: 'low',
    dueDate: '2026-04-15',
  },
];

/**
 * Seed the database with sample tasks
 */
function seedDatabase() {
  // Clear existing data
  TaskModel.clearAllTasks();

  // Create sample tasks
  const createdTasks = SAMPLE_TASKS.map((taskData) => {
    return TaskModel.createTask(taskData);
  });

  console.log(`✓ Seeded database with ${createdTasks.length} sample tasks`);
  return createdTasks;
}

module.exports = { seedDatabase, SAMPLE_TASKS };
