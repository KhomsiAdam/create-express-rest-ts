import express from 'express';
import { is } from '@middlewares';
import * as project from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, project.getAll);
endpoints.get('/:id', is.Auth, project.getOne);
endpoints.post('/', is.Admin, project.create);
endpoints.patch('/:id', is.Admin, project.update);
endpoints.delete('/:id', is.Admin, project.remove);

export default endpoints;
