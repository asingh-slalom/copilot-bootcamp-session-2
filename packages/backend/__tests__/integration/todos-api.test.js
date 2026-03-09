/**
 * Todo API Integration Tests
 * Tests for all task CRUD endpoints and business logic
 */

const request = require('supertest');
const app = require('../../src/app');
const TaskModel = require('../../src/models/Task');

describe('Todo API Endpoints', () => {
  // Reset database before each test for isolation
  beforeEach(() => {
    // Clear all tasks for test isolation
    TaskModel.clearAllTasks();
  });

  describe('POST /api/tasks - Create Task', () => {
    it('should create a task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'A test task',
        dueDate: '2026-03-15T00:00:00Z',
        priority: 'high',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.dueDate).toBe(taskData.dueDate);
      expect(response.body.priority).toBe(taskData.priority);
      expect(response.body.status).toBe('incomplete');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should create a task with minimal data (title only)', async () => {
      const taskData = { title: 'Minimal Task' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBeNull();
      expect(response.body.status).toBe('incomplete');
    });

    it('should reject task without title', async () => {
      const taskData = { description: 'No title' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject task with empty title', async () => {
      const taskData = { title: '   ' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject task with invalid priority', async () => {
      const taskData = { title: 'Test', priority: 'urgent' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Priority');
    });

    it('should reject task with invalid dueDate', async () => {
      const taskData = { title: 'Test', dueDate: 'invalid-date' };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks - Retrieve All Tasks', () => {
    let taskId1;
    let taskId2;

    beforeEach(async () => {
      // Create test tasks
      const res1 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1', status: 'incomplete' });
      taskId1 = res1.body.id;

      const res2 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2', status: 'complete', dueDate: '2026-03-10T00:00:00Z' });
      taskId2 = res2.body.id;
    });

    it('should retrieve all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should filter tasks by status - incomplete', async () => {
      const response = await request(app)
        .get('/api/tasks?filter=incomplete')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe('incomplete');
    });

    it('should filter tasks by status - complete', async () => {
      const response = await request(app)
        .get('/api/tasks?filter=complete')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe('complete');
    });

    it('should sort tasks by dueDate', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=dueDate')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      // Task 2 has a dueDate, so it should come first
      expect(response.body[0].id).toBe(taskId2);
    });

    it('should sort tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=status')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      // Incomplete tasks should come first
      expect(response.body[0].status).toBe('incomplete');
    });

    it('should reject invalid filter parameter', async () => {
      const response = await request(app)
        .get('/api/tasks?filter=archived')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid sortBy parameter', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=priority')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/tasks/:id - Retrieve Single Task', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Single Task Test' });
      taskId = res.body.id;
    });

    it('should retrieve a task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Single Task Test');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid_task_id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tasks/:id - Update Task', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Original Title',
          description: 'Original Description',
          status: 'incomplete',
          priority: 'low',
        });
      taskId = res.body.id;
    });

    it('should update task title', async () => {
      const updates = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updates)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.description).toBe('Original Description');
    });

    it('should update task status', async () => {
      const updates = { status: 'complete' };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updates)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('complete');
    });

    it('should update multiple properties', async () => {
      const updates = {
        title: 'New Title',
        description: 'New Description',
        priority: 'high',
        dueDate: '2026-04-01T00:00:00Z',
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updates)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New Title');
      expect(response.body.description).toBe('New Description');
      expect(response.body.priority).toBe('high');
      expect(response.body.dueDate).toBe('2026-04-01T00:00:00Z');
    });

    it('should update updatedAt timestamp', async () => {
      const originalTask = await request(app).get(`/api/tasks/${taskId}`);
      const originalUpdatedAt = originalTask.body.updatedAt;

      // Wait a small amount to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated' });

      expect(response.body.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('should reject update to non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid_id')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject empty title update', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'archived' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/tasks/:id - Delete Task', () => {
    let taskId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to Delete' });
      taskId = res.body.id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(204);
    });

    it('should verify task is deleted', async () => {
      await request(app).delete(`/api/tasks/${taskId}`);

      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/invalid_id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Task Business Logic', () => {
    it('should create tasks with unique IDs', async () => {
      const res1 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 1' });

      const res2 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task 2' });

      expect(res1.body.id).not.toBe(res2.body.id);
    });

    it('should maintain data integrity through CRUD cycle', async () => {
      const originalData = {
        title: 'Full Cycle Test',
        description: 'A task for testing',
        priority: 'medium',
        dueDate: '2026-03-20T00:00:00Z',
      };

      // Create
      const createRes = await request(app)
        .post('/api/tasks')
        .send(originalData);

      const taskId = createRes.body.id;

      // Read
      const readRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(readRes.body.title).toBe(originalData.title);

      // Update
      const updateRes = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'complete' });

      expect(updateRes.body.status).toBe('complete');

      // Delete
      const deleteRes = await request(app)
        .delete(`/api/tasks/${taskId}`);

      expect(deleteRes.status).toBe(204);

      // Verify deletion
      const verifyRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(verifyRes.status).toBe(404);
    });
  });

  describe('Response Format Validation', () => {
    it('should return consistent JSON response structure', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Format Test' });

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('dueDate');
      expect(res.body).toHaveProperty('priority');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
      
      expect(typeof res.body.id).toBe('string');
      expect(typeof res.body.title).toBe('string');
      expect(typeof res.body.status).toBe('string');
      expect(typeof res.body.createdAt).toBe('string');
      expect(typeof res.body.updatedAt).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send('{invalid json}');

      expect(response.status).toBe(400);
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test' });

      // Should still work with default JSON handling
      expect(response.status).toBe(201);
    });
  });
});
