import express from 'express';
import * as auth from './controller';

const endpoints = express.Router();

endpoints.post('/login', auth.login);
endpoints.post('/register', auth.register);
endpoints.post('/refresh', auth.refresh);
endpoints.post('/logout', auth.logout);

export default endpoints;
