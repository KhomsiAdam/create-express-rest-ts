import express from 'express';
import { is } from '@middlewares';
import * as user from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, user.getAll);
endpoints.get('/:id', is.Auth, user.getOne);
endpoints.patch('/:id', is.Auth, user.update);
endpoints.delete('/:id', is.Admin, user.remove);

export default endpoints;
