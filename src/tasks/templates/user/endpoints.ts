import { Router } from 'express';
import { is } from '@middlewares/isAuth';
import * as {{lowercaseName}} from './controller';

const endpoints = Router();

endpoints.get('/', is.Auth, {{lowercaseName}}.getAll);
endpoints.get('/:id', is.Auth, {{lowercaseName}}.getById);
endpoints.patch('/:id', is.Admin, {{lowercaseName}}.update);
endpoints.delete('/:id', is.Admin, {{lowercaseName}}.remove);

export default endpoints;
