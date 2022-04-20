import express from 'express';
import { is } from '@middlewares';
import * as {{lowercaseName}} from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, {{lowercaseName}}.getAll);
endpoints.get('/:id', is.Auth, {{lowercaseName}}.getOne);
endpoints.patch('/:id', is.Auth, {{lowercaseName}}.update);
endpoints.delete('/:id', is.Admin, {{lowercaseName}}.remove);

export default endpoints;
