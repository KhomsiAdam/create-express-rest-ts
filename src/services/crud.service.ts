import type { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import type { ObjectSchema } from 'joi';

import { customError, handlePopulate } from '@helpers';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
  entitySchema: ObjectSchema,
  Model: any,
  successMessage: string,
) => {
  const { error } = entitySchema.validate(req.body);
  if (error) return customError(res, next, error, 400);
  const newEntity = new Model(req.body);
  await newEntity.save();
  res.statusCode = 201;
  res.json({ message: successMessage });
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
  Model: any,
  errorMessage: string,
  populate = false,
  populateFields = '',
  selectedFields = '',
) => {
  // Extract special query params
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  // Filtering: ?field=value, ?field[gte]=value... (gte, gt, lte, lt, ne)
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
  let documentQuery = Model.find(JSON.parse(queryString));
  // Sorting: sort=field (asc), sort=-field (desc), sort=field1,field2...
  if (req?.query?.sort) {
    const sortBy = (req?.query?.sort as string).split(',').join(' ');
    documentQuery = documentQuery.sort(sortBy);
  } else {
    documentQuery = documentQuery.sort('-createdAt');
  }
  // Field Limiting: ?fields=field1,field2,field3
  if (req?.query?.fields) {
    const fields = (req?.query?.fields as string).split(',').join(' ');
    documentQuery = documentQuery.select(fields);
  } else {
    documentQuery = documentQuery.select('-__v');
  }
  // Pagination: ?page=2&limit=10 (page 1: 1-10, page 2: 11-20, page 3: 21-30...)
  type PaginationLimit = number | bigint | any;
  const page = (req?.query?.page as PaginationLimit) * 1 || 1;
  const limit = (req?.query?.limit as PaginationLimit) * 1 || 100;
  const skip = (page - 1) * limit;
  // Setup the query
  documentQuery = documentQuery.skip(skip).limit(limit);
  // Optionally populate and choose selected fields
  const foundEntities = await handlePopulate(documentQuery, populate, populateFields, selectedFields);
  if (!foundEntities) return customError(res, next, errorMessage, 404);
  res.json(foundEntities);
};

export const getByField = async (
  req: Request,
  res: Response,
  next: NextFunction,
  Model: any,
  errorMessage: string,
  field = '_id',
  populate = false,
  populateFields = '',
  selectedFields = '',
) => {
  // Get the path parameter depending on the field specified (defaults to _id)
  const param = req.params[field === '_id' ? 'id' : field];
  // Check if the parameter is a valid ObjectId if left as default
  if (field === '_id' && !isValidObjectId(param)) return customError(res, next, 'Invalid path parameter', 400);
  // Setup the query
  const documentQuery = Model.findOne({ [field]: param });
  // Optionally populate and choose selected fields
  const foundEntity = await handlePopulate(documentQuery, populate, populateFields, selectedFields);
  if (!foundEntity) return customError(res, next, errorMessage, 404);
  res.json(foundEntity);
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
  entitySchema: ObjectSchema,
  Model: any,
  successMessage: string,
  errorMessage: string,
) => {
  const { error } = entitySchema.validate(req.body);
  if (error) return customError(res, next, error, 422);
  const updatedEntity = await Model.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
  if (!updatedEntity) return customError(res, next, errorMessage, 404);
  res.json({ updatedEntity, message: successMessage });
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
  Model: any,
  successMessage: string,
  errorMessage: string,
) => {
  const deletedEntity = await Model.findOneAndDelete({ _id: req.params.id });
  if (!deletedEntity) return customError(res, next, errorMessage, 404);
  res.json({ deletedEntity, message: successMessage });
};
