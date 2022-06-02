import { Router } from 'express';
import { is } from '@middlewares/permissions';
import * as {{lowercaseName}} from './controller';

const endpoints = Router();

endpoints.post('/', is.Auth, {{lowercaseName}}.create);
endpoints.get('/', is.Auth, {{lowercaseName}}.getAll);
endpoints.get('/:id', is.Auth, {{lowercaseName}}.getById);
endpoints.patch('/:id', is.Auth, {{lowercaseName}}.update);
endpoints.delete('/:id', is.Auth, {{lowercaseName}}.remove);

export default endpoints;
