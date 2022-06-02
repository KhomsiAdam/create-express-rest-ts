import { Router } from 'express';
import { is } from '@middlewares/permissions';
import * as admin from './controller';

const endpoints = Router();

endpoints.get('/', is.Admin, admin.getAll);
endpoints.get('/:id', is.Admin, admin.getById);
endpoints.patch('/:id', is.Admin, admin.update);
endpoints.delete('/:id', is.Admin, admin.remove);

export default endpoints;
