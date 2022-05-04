import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';
import request from 'supertest';
import app from './test.server';

const { DB_URI_TEST } = process.env;

const user = {
  email: 'johndoe@censync.net',
  password: 'johndoe123**',
  firstname: 'John',
  lastname: 'Doe',
};

describe('Register', () => {
  beforeAll(async () => {
    const { connection } = await mongooseConnect(DB_URI_TEST);
    const collections = await connection.db.collections();
    collections.forEach(async (collection) => {
      await collection.drop();
    });
  });
  it('Check for missing fields.', async () => {
    const response = await request(app).post('/api/register').send({
      email: user.email,
      password: user.password,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('ValidationError: "firstname" is required');
  });
  it('Check for email validity.', async () => {
    const response = await request(app).post('/api/register').send({
      email: 'invalid.email.com',
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('ValidationError: "email" must be a valid email');
  });
  it('Create user.', async () => {
    const response = await request(app).post('/api/register').send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Account created successfully.');
  });
  it('Do not create user with same email.', async () => {
    const response = await request(app).post('/api/register').send(user);
    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('User already exists with this email.');
  });
});

describe('Login', () => {
  let refreshToken: string;
  afterAll(async () => {
    await mongooseDisconnect();
  });
  it('Check for missing fields.', async () => {
    const response = await request(app).post('/api/login').send({
      email: user.email,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('ValidationError: "password" is required');
  });
  it('Check for email validity.', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'invalid.email.com',
      password: user.password,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('ValidationError: "email" must be a valid email');
  });
  it('Try login with unregistered user.', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'unregistered@email.com',
      password: 'unregistered123**',
    });
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('Unable to login.');
  });
  it('Login with correct credentials.', async () => {
    const response = await request(app).post('/api/login').send({ email: user.email, password: user.password });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.role).toBeDefined();
    expect(response.body.message).toBe('Logged in successfully.');
    refreshToken = JSON.stringify(response.headers['set-cookie'][0]).split(';')[0].replace('"', '');
  });
  it('Refresh access token.', async () => {
    const response = await request(app).post('/api/refresh').set('Cookie', refreshToken).expect(200);
    expect(response.body.token).toBeDefined();
  });
});
