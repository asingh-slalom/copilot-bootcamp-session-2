const request = require('supertest');
const app = require('../src/app');
const TaskModel = require('../src/models/Task');

describe('Express App Initialization', () => {
  beforeEach(() => {
    // Clear tasks before each test
    TaskModel.tasks = [];
  });

  describe('App Setup', () => {
    test('should initialize express app', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    test('should have express middleware enabled', () => {
      expect(app._router).toBeDefined();
    });
  });

  describe('Health Check Endpoint', () => {
    test('GET / should return health status', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Backend server is running'
      });
    });

    test('should return JSON content type', async () => {
      const response = await request(app).get('/');
      
      expect(response.type).toBe('application/json');
    });
  });

  describe('API Routes Registration', () => {
    test('should have tasks route mounted', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should handle POST /api/tasks', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        })
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);
      
      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          description: 'No title provided'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS Configuration', () => {
    test('should accept requests from different origins', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Parsing', () => {
    test('should parse JSON request body', async () => {
      const taskData = {
        title: 'JSON Test Task',
        description: 'Testing JSON parsing',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);
      
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.priority).toBe(taskData.priority);
    });
  });
});
