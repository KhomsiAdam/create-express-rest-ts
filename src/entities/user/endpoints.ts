import { Router } from 'express';
import { is } from '@middlewares/isAuth';
import * as user from './controller';

const endpoints = Router();

endpoints.get('/', is.Auth, user.getAll);
endpoints.get('/:id', is.Auth, user.getById);
endpoints.patch('/:id', is.Admin, user.update);
endpoints.delete('/:id', is.Admin, user.remove);

export default endpoints;
