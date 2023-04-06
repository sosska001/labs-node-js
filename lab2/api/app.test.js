const app = require('./app');
const supertest = require('supertest');
const request = supertest(app);

it("Сервіс по адресі '/' повертає Hello world", async () => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
});