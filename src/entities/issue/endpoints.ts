import express from 'express';
import { is } from '@middlewares';
import * as issue from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, issue.getAll);
endpoints.get('/:id', is.Auth, issue.getOne);
endpoints.post('/', is.Auth, issue.create);
endpoints.patch('/:id', is.Auth, issue.update);
endpoints.delete('/:id', is.Auth, issue.remove);
endpoints.patch('/:id/user', is.Auth, issue.affectUser);

export default endpoints;
