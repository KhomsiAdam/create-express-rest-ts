
<p align="center">
  <img src="https://raw.githubusercontent.com/masad-frost/ts-node/HEAD/logo.svg" alt="Typescript Node Express REST API"></img>
</p>
<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT--Clause-brightgreen.svg?style=flat-square" alt="Software License"></img>
  </a>
  <a href="https://github.com/KhomsiAdam/create-express-ts-rest-api/releases">
    <img src="https://img.shields.io/github/release/KhomsiAdam/create-express-ts-rest-api.svg?style=flat-square" alt="Latest Version"></img>
  </a>
</p>
  
# Introduction

Create a maintainable and scalable Node.js REST API with TypeScript, Express and Mongoose.

The project structure is based on MVC and follows it's basic principles but is a little bit different in which instead of having the entities logic spread out into specific folders (models folder containing all models, controllers folder containing all controllers etc...).

Each entity has it's own folder containing all it's core logic in isolation from other entities. Let's take the `User` entity as an example:

```
src
└── entities
    └── user
        ├── constants.ts
        ├── controller.ts
        ├── endpoints.ts
        ├── interface.ts
        ├── model.ts
        └── validation.ts
```

With this structure it is easier to maintain and scale with multiple entities (you will rarely have to switch between folders in order to manage one entity).

The project comes with many built-in features, such as:

- Authentication with [JWT](https://www.npmjs.com/package/jsonwebtoken): providing both an access token and refresh token (sent as a secure http only cookie and saved in the database).
- Unified login system for support of multiple roles of users.
- Validation using [Joi](https://joi.dev/).
- [Jest](https://jestjs.io/) for unit and integration testing. 
- Entity folder/files generation with a custom script.
- [PM2](https://pm2.keymetrics.io/) as a process manager.
- Seeding data examples.
- Logger with [winston](https://www.npmjs.com/package/winston) and [morgan](https://www.npmjs.com/package/morgan).
- Errorhandling and a custom error catching method.
- Filtering, sorting, field limiting, pagination.
- Optional populate, select which fields to populate and which fields to return from GET requests.
- more details below...

# Table of Contents
<!--ts-->
* [Setup](#setup)
  * [Usage](#usage)
  * [Configuration](#configuration)
* [Directory Structure](#directory-structure)
* [Scripts](#scripts)
* [Features](#features)
* [Contributions](#contributions)
<!--te-->

# Setup

## Usage

To create a project, simply run:

```bash
npx @khomsi.adam/create-express-ts-rest-api my-app
```

or for a quick start:

```bash
npx @khomsi.adam/create-express-ts-rest-api my-app
cd my-app
yarn
```

Alternatively, you can clone the repository (or download or use as a template):

```bash
git clone https://github.com/KhomsiAdam/create-express-ts-rest-api.git
```

Then open the project and run the following command in your terminal to install the required dependencies:

```bash
yarn
```

[Back to top](#table-of-contents)

## Configuration

Setup your environment variables. In your root directory, you will find a `.env.example` file. Copy and/or rename to `.env` or:

```
cp .env.example .env
```

Then:

```bash
yarn dev
```

The database should be connected and your server should be running. You can start testing and querying the API.

```bash
yarn test:good
```

[Back to top](#table-of-contents)

# Directory Structure

```
src/
├── __tests__/                  # Groups all your integration tests and the testing server
├── config/                     # Database, routes and server configurations
├── entities/                   # Contains all entities (generated entities end up here with the custom script)
├── helpers/                    # Any utility or helper functions/methods go here
├── middlewares/                # Express middlewares
├── seeders/                    # Data seeders examples
├── services/                   # Contains mostly global and reusable logic (such as auth and crud)
├── tasks/                      # Scripts (contains the script to generate entities based of templates)
│   └── templates/              # Contains entity templates (default and user type)
├── types/                      # Custom/global type definitions
└── index.ts                    # App entry point (initializes database connection and express server)
```

[Back to top](#table-of-contents)

# Scripts

- Run compiled javascript production build (requires build):

```bash
yarn start
```
<hr>

- Run compiled javascript production build with pm2 in cluster mode (requires build):

```bash
yarn start:pm2
```
<hr>

- Compiles typescript into javascript and build your app:

```bash
yarn build
```
<hr>

- Run the typescript development build:

```bash
yarn dev
```
<hr>

- Run the typescript development build with the `--trace-sync-io` tag to detect any synchronous I/O:

```bash
yarn dev:sync
```
<hr>

- Run the typescript development build with PM2:

```bash
yarn dev:pm2
```
<hr>

- Seed an Admin:

```bash
yarn seed:admin
```
<hr>

- Seed fake users based on json data file:

```bash
yarn seed:users
```
<hr>

- Generate an entity based of either the default or user template (prompts for a template selection and entity name, then create it's folder under `src/entitites`)

```bash
yarn entity
```

*Entities created have their constants, controller (with basic crud), basic endpoints all automatically setup from the provided name. The interface, model and validation need to be filled with the needed fields. The endpoints are by default required to be authenticated and need to be imported into `src/config/routes.ts`.

<hr>

- Eslint (lint, lint and fix):

```bash
yarn lint
```

```bash
yarn lint:fix
```
<hr>

- Jest (all, unit, integration, coverage, watch, watchAll):

```bash
yarn test
```
```bash
yarn test:unit
```
```bash
yarn test:int
```
```bash
yarn test:coverage
```
```bash
yarn test:watch
```
```bash
yarn test:watchAll
```
<hr>

- PM2 (kill, monit):

```bash
yarn kill
```
```bash
yarn monit
```
<hr>

[Back to top](#table-of-contents)

# Features

## API Endpoints

List of available routes:

**Auth routes** (public):\
`POST /api/register` - register\
`POST /api/login` - login\
`POST /api/refresh` - refresh auth tokens\
`POST /api/logout` - logout

**User routes** (private):\
`GET /api/users` - get all users\
`GET /api/users/:id` - get user by id\
`PATCH /api/users/:id` - update user\
`DELETE /api/users/:id` - delete user

**Admin routes**:\
`GET /api/admins` - get all admins\
`GET /api/admins/:id` - get admin by id\
`PATCH /api/admins/:id` - update admin\
`DELETE /api/admins/:id` - delete admin

*The GET methods to get all elements of an entity have built in support for advanced queries as parameters:

Filtering: `?field=value, ?field[gte]=value... (gte, gt, lte, lt, ne)`\
Sorting: `sort=field (asc), sort=-field (desc), sort=field1,field2...`\
Field limiting: `?fields=field1,field2,field3`\
Pagination: `?page=2&limit=10 (page 1: 1-10, page 2: 11-20, page 3: 21-30...)`

## Entities

let's imagine we generated a `Post` entity with the `default` template `src/entities/post`:

```
src
└── entities
    └── post
        ├── constants.ts
        ├── controller.ts
        ├── endpoints.ts
        ├── interface.ts
        ├── model.ts
        └── validation.ts
```

It's constants, controller, endpoints are all ready and setup:

`src/entities/post/constants.ts`:

```javascript
export enum SuccessMessages {
  POST_CREATED = 'Post created successfully.',
  POST_UPDATED = 'Post updated successfully.',
  POST_DELETED = 'Post deleted successfully.',
}

export enum ErrorMessages {
  POSTS_NOT_FOUND = 'No posts found.',
  POST_NOT_FOUND = 'Post was not found.',
}
```

`src/entities/post/controller.ts`:

```javascript
import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { PostModel } from './model';
import { createPostSchema, updatePostSchema } from './validation';
import { ErrorMessages, SuccessMessages } from './constants';

export const create = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.create(req, res, next, createPostSchema, PostModel, SuccessMessages.POST_CREATED);
});

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, PostModel, ErrorMessages.POSTS_NOT_FOUND, false);
});

export const getOne = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.getOne(req, res, next, PostModel, ErrorMessages.POST_NOT_FOUND, false);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(
    req,
    res,
    next,
    updatePostSchema,
    PostModel,
    SuccessMessages.POST_UPDATED,
    ErrorMessages.POST_NOT_FOUND,
  );
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, PostModel, SuccessMessages.POST_DELETED, ErrorMessages.POST_NOT_FOUND);
});
```
*The `getAll` and `getOne` methods of the main crud controller have optional options for managing referenced documents. By default `populate` is `false`. If set to true, you can choose which fields you would like to populate, and also return specified fields from the referenced documents, for example we can alter the `getAll` methods for posts:

```javascript
export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, PostModel, ErrorMessages.POSTS_NOT_FOUND, true, 'user', 'firstname lastname');
});
```

*With this, we will get all posts with only the firstname and lastname of the referenced user.

`src/entities/post/endpoints.ts`:

```javascript
import express from 'express';
import { is } from '@middlewares';
import * as post from './controller';

const endpoints = express.Router();

endpoints.get('/', is.Auth, post.getAll);
endpoints.get('/:id', is.Auth, post.getOne);
endpoints.post('/', is.Auth, post.create);
endpoints.patch('/:id', is.Auth, post.update);
endpoints.delete('/:id', is.Auth, post.remove);

export default endpoints;
```

*Endpoints by default have the `is.Auth` middleware that require a user to be authenticated to access them, you can either omit it if you want an endpoint to be public, or speficy which user role is allowed (`is.Admin` or `is.User`), from `src/middlewares/isAuth.ts`:

```javascript
import { NextFunction, Request, Response } from 'express';
import { verifyAuth } from '@services/auth.service';

export const is = {
  Auth: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next);
  },
  User: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next, 'User');
  },
  Admin: async (req: Request, res: Response, next: NextFunction) => {
    verifyAuth(req, res, next, 'Admin');
  },
};
```

*The endpoints of each created entity must be imported into `src/config/routes.ts`:

```javascript
import express from 'express';

import authEndpoints from '@entities/auth/endpoints';
import adminEndpoints from '@entities/admin/endpoints';
import userEndpoints from '@entities/user/endpoints';
import postEndpoints from '@entities/post/endpoints'; // Importing our newly created endpoints for posts

export const router = express.Router();

router.use('/', authEndpoints);
router.use('/admins', adminEndpoints);
router.use('/users', userEndpoints);
router.use('/posts', postEndpoints); // Using the posts endpoints

export default router;
```

The interface, model and validation will have to be filled by the needed fields.

`src/entities/post/interface.ts`:

```javascript
export interface PostInterface {}
```

`src/entities/post/model.ts`:

```javascript
import { Schema, model } from 'mongoose';

import { PostInterface } from './interface';

const PostSchema = new Schema<PostInterface>({}, { timestamps: true });

export const PostModel = model<PostInterface>('Post', PostSchema);
```

`src/entities/post/validation.ts`:

```javascript
import Joi from 'joi';

export const createPostSchema = Joi.object({});

export const updatePostSchema = Joi.object({});
```

*The `user` entity template slightly differs from the default one as it is destined for another type of user (another role for example).

## Error Handling

By wrapping the controller methods with the `catchErrors` wrapper, it catches any errors and forwards them to the error handling middleware.

```javascript
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchErrors =
  (requestHandler: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      return requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
```

For example the `getAll` method for users:
```javascript
import { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { UserModel } from './model';
import { userSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, UserModel, ErrorMessages.USERS_NOT_FOUND);
});
```

There is also a `customErrors` method to send specified status code and message:

```javascript
import { Response, NextFunction } from 'express';

export const customErrors = (res: Response, next: NextFunction, message: any, code: number) => {
  const error = new Error(message);
  res.status(code);
  next(error);
};
```

As is it used for the `notFound` middleware:

```javascript
import { Request, Response, NextFunction } from 'express';
import { customErrors } from '@helpers/customErrors';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  customErrors(res, next, `Not Found - ${req.originalUrl}`, 404);
};
```

*When running in development mode, the error response contains the message but also the error stack.

## Validation

Data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the folder for each entity. Let's take the `User` entity as an example so it would be in: `src/entities/user/validation.ts`:

## Logging

Import the logger from `src/services/logger.service.ts`. It is using the [winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
import { log } from '@services/logger.service';
log.error('error'); // level 0
log.warn('warning'); // level 1
log.info('information'); // level 2
log.http('http'); // level 3
log.debug('debug'); // level 4
```

In development mode, log messages of all severity levels will be printed to the console.

HTTP requests are logged (using [morgan](https://github.com/expressjs/morgan)).

## WIP:

- Reset, forgot password.
- Email service.
- File upload.
- GraphQL version of this boilerplate.

[Back to top](#table-of-contents)

# Contributions

Contributions are welcome. To discuss any bugs, problems, fixes or improvements please refer to the [discussions](https://github.com/KhomsiAdam/create-express-ts-rest-api/discussions) section.

Before creating a pull request, make sure to open an [issue](https://github.com/KhomsiAdam/create-express-ts-rest-api/issues) first.

Committing your changes, fixes or improvements in a new branch with documentation will be appreciated.

## License

[MIT](LICENSE)