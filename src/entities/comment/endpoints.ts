import express from 'express';
import { is } from '@middlewares';
import * as comment from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, comment.getAll);
endpoints.get('/:id', is.Auth, comment.getOne);
endpoints.post('/', is.Auth, comment.create);
endpoints.patch('/:id', is.Auth, comment.update);
endpoints.delete('/:id', is.Auth, comment.remove);

export default endpoints;
