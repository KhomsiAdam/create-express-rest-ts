<p align="center">
  <img src="https://raw.githubusercontent.com/masad-frost/ts-node/HEAD/logo.svg" alt="Typescript Node Express REST API"></img>
</p>
<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT--Clause-brightgreen.svg?style=flat-square" alt="Software License"></img>
  </a>
  <a href="https://github.com/KhomsiAdam/create-express-rest-ts/releases">
    <img src="https://img.shields.io/github/release/KhomsiAdam/create-express-rest-ts.svg?style=flat-square" alt="Latest Version"></img>
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"></img>
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
- Error handling and a custom error catching method.
- Filtering, sorting, field limiting, pagination.
- Optional populate, select which fields to populate and which fields to return from GET requests.
- more details below...

# Table of Contents

<!--ts-->

- [Setup](#setup)
  - [Usage](#usage)
  - [Configuration](#configuration)
- [Directory Structure](#directory-structure)
- [Scripts](#scripts)
- [Features](#features)
- [Contributions](#contributions)
<!--te-->

# Setup

## Usage

To create a project, simply run:

```bash
npx create-express-rest-ts my-app
```

or for a quick start if you are using vscode:

```bash
npx create-express-rest-ts my-app
cd my-app
code .
```

*By default, it uses `yarn` to install dependencies.

- If you prefer another package manager you can pass it as an argument:

for `npm`:

```bash
npx create-express-rest-ts my-app --npm
```
for `pnpm`:

```bash
npx create-express-rest-ts my-app --pnpm
```

*You can pass package manager specific arguments as flags as well after the package manager argument. As an example with `npm` you might need to pass in the `--force` flag to force installation even with conflicting peer dependencies:

```bash
npx create-express-rest-ts my-app --npm --force
```

Alternatively, you can clone the repository (or download or use as a template):

```bash
git clone https://github.com/KhomsiAdam/create-express-rest-ts.git
```

Then open the project folder and install the required dependencies:

```bash
yarn
```

*If you want to use another package manager after using this method instead of `npx`, before installing dependencies you should modify the `pre-commit` script in `.husky` to match your package manager of choice (then deleting the `yarn.lock` file if it would cause any conflicts).

*In the `.github/yml` folder, there is a workflow file for each package manager. You can copy the file that matches your package manager into `.github/workflows` and delete `.github/workflows/yarn.yml`.

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

- Generate an entity based of either the default or user template (prompts for a template selection and entity name, then create it's folder under `src/entities`)

```bash
yarn entity
```

\*Entities created have their constants, controller (with basic crud), basic endpoints all automatically setup from the provided name. The interface, model and validation need to be filled with the needed fields. The endpoints are by default required to be authenticated and need to be imported into `src/config/routes.ts`.

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

- Commitizen:

```bash
yarn cz
```

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

\*The GET methods to get all elements of an entity have built in support for advanced queries as query parameters:

- Filtering: `?field=value, ?field[gte]=value... (gte, gt, lte, lt, ne)`
- Sorting: `sort=field (asc), sort=-field (desc), sort=field1,field2...`
- Field limiting: `?fields=field1,field2,field3`
- Pagination: `?page=2&limit=10 (page 1: 1-10, page 2: 11-20, page 3: 21-30...)`

## Entities

let's imagine we generated using:

```bash
yarn entity
```

a `Post` entity with the `default` template `src/entities/post`:

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

```typescript
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

```typescript
import type { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { PostModel } from './model';
import { createPostSchema, updatePostSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const create = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.create(req, res, next, createPostSchema, PostModel, SuccessMessages.POST_CREATED);
});

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, PostModel, ErrorMessages.POSTS_NOT_FOUND);
});

export const getById = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.getByField(req, res, next, PostModel, ErrorMessages.POST_NOT_FOUND);
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

The `getAll` and `getByField` methods of the main crud controller have optional options for managing referenced documents. By default `populate` is `false`. If set to true, you can choose which fields you would like to populate, and also return specified fields from the referenced documents, for example we can alter the `getAll` methods for posts:

```typescript
export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, PostModel, ErrorMessages.POSTS_NOT_FOUND, true, 'user', 'firstname lastname');
});
```

\*With this, we will get all posts with only the firstname and lastname of the referenced user.

The `getByField` by default gets an element by id provided in as a path parameter `/api/user/:id`.

If we want let's say, get the user by his email, we would need to create another method named `getByEmail` using the same method `getByField` only specifying `email` as the specified field:

```typescript
export const getByEmail = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getByField(_req, res, next, UserModel, ErrorMessages.USER_NOT_FOUND, 'email');
});
```

Then we want to add it's endpoint under `src/entities/user/endpoints.ts`:

```typescript
endpoints.get('/email/:email', is.Auth, user.getByEmail);
```

`src/entities/post/endpoints.ts`:

```typescript
import { Router } from 'express';
import { is } from '@middlewares/permissions';
import * as post from './controller';

const endpoints = Router();

endpoints.post('/', is.Auth, post.create);
endpoints.get('/', is.Auth, post.getAll);
endpoints.get('/:id', is.Auth, post.getById);
endpoints.patch('/:id', is.Auth, post.update);
endpoints.delete('/:id', is.Auth, post.remove);

export default endpoints;
```

\*Endpoints by default have the `is.Auth` permission that require a user to be authenticated to access them, you can either omit it if you want an endpoint to be public, or specify which permission is needed from `src/middlewares/permissions.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';
import { verifyAuth } from '@services/auth.service';
import { Roles, Permissions } from '@entities/auth/constants';

export const is = {
  Auth: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next);
  },
  Self: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.SELF);
  },
  Own: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.OWN);
  },
  Admin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.ADMIN);
  },
  User: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.USER);
  },
};
```

- `is.Self`: Used to only allow user to perform an operation (usually `update` or `delete`) on itself.

- `is.Own`: Checks for the requested resource if it contains a reference of the user's ID to verify ownership. Used to restrict operations such as `update` or `delete` for the user who owns the resource only.

*The resource needs to have a reference to a user.

- `is.Admin`, `is.User`: Checks for the authorized role.

\*The endpoints of each created entity must be imported into `src/config/routes.ts`:

```typescript
import { Router } from 'express';

import authEndpoints from '@entities/auth/endpoints';
import adminEndpoints from '@entities/admin/endpoints';
import userEndpoints from '@entities/user/endpoints';
import postEndpoints from '@entities/post/endpoints';

const router = Router();

router.use('/', authEndpoints);
router.use('/admins', adminEndpoints);
router.use('/users', userEndpoints);
router.use('/posts', postEndpoints);

export default router;
```

The interface, model and validation will have to be filled by the needed fields.

`src/entities/post/interface.ts`:

```typescript
export interface PostEntity {}
```

`src/entities/post/model.ts`:

```typescript
import { Schema, model } from 'mongoose';

import { PostEntity } from './interface';

const PostSchema = new Schema<PostEntity>({}, { timestamps: true });

export const PostModel = model<PostEntity>('Post', PostSchema);
```

`src/entities/post/validation.ts`:

```typescript
import Joi from 'joi';

export const createPostSchema = Joi.object({});

export const updatePostSchema = Joi.object({});
```

The `user` entity template slightly differs from the default one as it is destined for another type of user (another role for example).

Using:

```bash
yarn entity
```

Let's create a `Manager` entity with the `user` template `src/entities/manager`.

`src/entities/manager/constants.ts`:

```typescript
export enum SuccessMessages {
  MANAGER_UPDATED = 'Manager updated successfully.',
  MANAGER_DELETED = 'Manager deleted successfully.',
}

export enum ErrorMessages {
  MANAGERS_NOT_FOUND = 'No managers found.',
  MANAGER_NOT_FOUND = 'Manager was not found.',
}

export const SALT_ROUNDS = 12;
```

`src/entities/manager/controller.ts`:

```typescript
import type { Request, Response, NextFunction } from 'express';
import * as controller from '@services/crud.service';

import { catchErrors } from '@helpers/catchErrors';
import { ManagerModel } from './model';
import { managerSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';

export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, ManagerModel, ErrorMessages.MANAGERS_NOT_FOUND);
});

export const getById = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getByField(_req, res, next, ManagerModel, ErrorMessages.MANAGER_NOT_FOUND);
});

export const update = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.update(
    req,
    res,
    next,
    managerSchema,
    ManagerModel,
    SuccessMessages.MANAGER_UPDATED,
    ErrorMessages.MANAGER_NOT_FOUND,
  );
});

export const remove = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  controller.remove(req, res, next, ManagerModel, SuccessMessages.MANAGER_DELETED, ErrorMessages.MANAGER_NOT_FOUND);
});
```

`src/entities/manager/endpoints.ts`:

```typescript
import { Router } from 'express';
import { is } from '@middlewares/permissions';
import * as manager from './controller';

const endpoints = Router();

endpoints.get('/', is.Auth, manager.getAll);
endpoints.get('/:id', is.Auth, manager.getById);
endpoints.patch('/:id', is.Own, manager.update);
endpoints.delete('/:id', is.Own, manager.remove);

export default endpoints;
```

`src/entities/manager/interface.ts`:

```typescript
import { Types } from 'mongoose';

export interface ManagerEntity {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Types.ObjectId;
}
```

`src/entities/manager/model.ts`:

```typescript
import { Schema, model } from 'mongoose';
import { hash as bcryptHash, genSalt as bcryptGenSalt } from 'bcryptjs';

import { AuthModel } from '@entities/auth/model';
import type { ManagerEntity } from './interface';
import { SALT_ROUNDS } from './constants';

const ManagerSchema = new Schema<ManagerEntity>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
    },
  },
  { timestamps: true },
);

// Before creating a manager
ManagerSchema.pre('save', async function save(next) {
  // Only hash password if it has been modified or new
  if (!this.isModified('password')) return next();
  // Generate salt and hash password
  const salt = await bcryptGenSalt(SALT_ROUNDS);
  this.password = await bcryptHash(this.password, salt);
  next();
});
// After creating a manager
ManagerSchema.post('save', async (doc) => {
  // Create manager in auth collection
  await AuthModel.create({ email: doc.email, role: 'Manager' });
});
ManagerSchema.post('findOneAndDelete', async (doc) => {
  // Delete manager from auth collection
  await AuthModel.deleteOne({ email: doc.email });
});

export const ManagerModel = model<ManagerEntity>('Manager', ManagerSchema);
```

`src/entities/post/validation.ts`:

```typescript
import Joi from 'joi';

export const managerSchema = Joi.object({
  firstname: Joi.string().trim(),
  lastname: Joi.string().trim(),
});
```

After importing the endpoints to the router `src/config/routes.ts` to register the schema, the `Manager` role should be added to the `Roles` constant `src/entities/auth/constants.ts`:

```typescript
export enum Roles {
  ADMIN = 'Admin',
  USER = 'User',
  MANAGER = 'Manager',
}
```

*It automatically get added into the `src/entities/auth/interface.ts` and `src/entities/auth/model.ts`.

Then optionally add another permission `is.Manager` to check if user has a `Manager` role at `src/middlewares/permissions.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';
import { verifyAuth } from '@services/auth.service';
import { Roles, Permissions } from '@entities/auth/constants';

export const is = {
  Auth: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next);
  },
  Self: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.SELF);
  },
  Own: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, undefined, Permissions.OWN);
  },
  Admin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.ADMIN);
  },
  User: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.USER);
  },
  Manager: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    verifyAuth(req, res, next, Roles.MANAGER);
  },
};
```

Now to create a user with a specified role, just send the role needed as part of the request body, it will automatically check if that role exists, if not the register will fail.

*By default, registering creates user with a `User` role, and you cannot create a user with an `Admin` role with regular registering.

## Error Handling

By wrapping the controller methods with the `catchErrors` wrapper, it catches any errors and forwards them to the error handling middleware.

```typescript
import type { Request, Response, NextFunction, RequestHandler } from 'express';

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

As seen in the `getAll` method for users as an example:

```typescript
export const getAll = catchErrors(async (_req: Request, res: Response, next: NextFunction) => {
  controller.getAll(_req, res, next, UserModel, ErrorMessages.USERS_NOT_FOUND);
});
```

There is also a `customErrors` method to send specified status code and message:

```typescript
import type { Response, NextFunction } from 'express';

export const customError = (res: Response, next: NextFunction, message: any, code: number): void => {
  const error = new Error(message);
  res.status(code);
  next(error);
};
```

As is it used for the `notFound` middleware:

```typescript
import { Request, Response, NextFunction } from 'express';
import { customError } from '@helpers/customError';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  customError(res, next, `Not Found - ${req.originalUrl}`, 404);
};
```

\*When running in development mode, the error response contains the message but also the error stack split into an array for readability.

## Validation

Data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the folder for each entity. Let's take the `User` entity as an example so it would be in: `src/entities/user/validation.ts`:

## Logging

Import the logger from `src/services/logger.service.ts`. It is using the [winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```typescript
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

[Back to top](#table-of-contents)

# Contributions

Contributions are welcome. To discuss any bugs, problems, fixes or improvements please refer to the [discussions](https://github.com/KhomsiAdam/create-express-rest-ts/discussions) section.

Before creating a pull request, make sure to open an [issue](https://github.com/KhomsiAdam/create-express-rest-ts/issues) first.

Committing your changes, fixes or improvements in a new branch with documentation will be appreciated.

## License

[MIT](LICENSE)
