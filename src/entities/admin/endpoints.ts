import express from 'express';
import { is } from '@middlewares';
import * as admin from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Admin, admin.getAll);
endpoints.get('/:id', is.Admin, admin.getOne);
endpoints.patch('/:id', is.Admin, admin.update);
endpoints.delete('/:id', is.Admin, admin.remove);

export default endpoints;
