import mongoose from 'mongoose';
import request from 'supertest';
import server from '@config/server';

const { DB_URI_TEST } = process.env;

const user = {
  email: 'johndoe@email.com',
  password: 'johndoe123**',
  firstname: 'John',
  lastname: 'Doe',
};

describe('Register', () => {
  beforeAll(async () => {
    mongoose.set('strictQuery', true);
    const { connection } = await mongoose.connect(DB_URI_TEST);
    const collections = await connection.db.collections();
    collections.forEach(async (collection) => {
      await collection.drop();
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  it('Check for missing fields', async () => {
    const response = await request(server).post('/api/register').send({
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toBe(400);
  });
  it('Check for email validity', async () => {
    const response = await request(server).post('/api/register').send({
      email: 'invalid.email.com',
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    });
    expect(response.statusCode).toBe(400);
  });
  it('Create user', async () => {
    const response = await request(server).post('/api/register').send(user);
    expect(response.statusCode).toBe(201);
  });
  it('Do not create user with same email', async () => {
    const response = await request(server).post('/api/register').send(user);
    expect(response.statusCode).toBe(409);
  });
});

describe('Login', () => {
  let refreshToken: string;
  beforeAll(async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB_URI_TEST);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  it('Check for missing fields', async () => {
    const response = await request(server).post('/api/login').send({
      email: user.email,
    });
    expect(response.statusCode).toBe(400);
  });
  it('Check for email validity', async () => {
    const response = await request(server).post('/api/login').send({
      email: 'invalid.email.com',
      password: user.password,
    });
    expect(response.statusCode).toBe(400);
  });
  it('Try login with unregistered user', async () => {
    const response = await request(server).post('/api/login').send({
      email: 'unregistered@email.com',
      password: 'unregistered123**',
    });
    expect(response.statusCode).toBe(422);
  });
  it('Login with correct credentials', async () => {
    const response = await request(server).post('/api/login').send({ email: user.email, password: user.password });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.role).toBeDefined();
    refreshToken = JSON.stringify(response.headers['set-cookie'][0]).split(';')[0].replace('"', '');
  });
  it('Refresh access token', async () => {
    const response = await request(server).post('/api/refresh').set('Cookie', refreshToken).expect(200);
    expect(response.body.token).toBeDefined();
  });
});
