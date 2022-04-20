import { customErrors } from '@helpers/customErrors';
import { NextFunction, Request, Response } from 'express';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
  entitySchema: any,
  Model: any,
  successMessage: string,
) => {
  const { error } = entitySchema.validate(req.body);
  if (error) {
    if (error.details[0].type === 'any.required') {
      customErrors(res, next, 'Required fields missing.', 400);
    } else {
      customErrors(res, next, error, 422);
    }
  }
  const document = new Model(req.body);
  await document.save();
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
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = Model.find(JSON.parse(queryString));

  // Sorting: sort=field (asc), sort=-field (desc), sort=field1,field2...
  if (req?.query?.sort) {
    const sortBy = (req?.query?.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field Limiting: ?fields=field1,field2,field3
  if (req?.query?.fields) {
    const fields = (req?.query?.fields as string).split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination: ?page=2&limit=10 (page 1: 1-10, page 2: 11-20, page 3: 21-30...)
  const page = (req?.query?.page as any) * 1 || 1;
  const limit = (req?.query?.limit as any) * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  let response;
  // Optionally populate and choose selected fields
  if (populate && populateFields !== '' && selectedFields === '') {
    response = await query.populate(populateFields);
  } else if (populate && populateFields !== '' && selectedFields !== '') {
    response = await query.populate(populateFields, selectedFields);
  } else {
    response = await query;
  }

  if (response) {
    res.json(response);
  } else {
    next({ message: errorMessage });
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  Model: any,
  errorMessage: string,
  populate = false,
  populateFields = '',
  selectedFields = '',
) => {
  const { id } = req.params;
  const query = { _id: id };

  let response;
  // Optionally populate and choose selected fields
  if (populate && populateFields !== '' && selectedFields === '') {
    response = await Model.findOne(query).populate(populateFields);
  } else if (populate && populateFields !== '' && selectedFields !== '') {
    response = await Model.findOne(query).populate(populateFields, selectedFields);
  } else {
    response = await Model.findOne(query);
  }

  if (response) {
    res.json(response);
  } else {
    res.json({ message: errorMessage });
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
  entitySchema: any,
  Model: any,
  successMessage: string,
  errorMessage: string,
) => {
  const { error } = entitySchema.validate(req.body);
  if (error) {
    customErrors(res, next, error, 422);
  }
  const { id } = req.params;
  const query = { _id: id };
  const response = await Model.findOneAndUpdate(
    query,
    {
      $set: req.body,
    },
    { new: true },
  );
  if (response) {
    res.json({ response, message: successMessage });
  } else {
    next({ message: errorMessage });
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
  Model: any,
  successMessage: string,
  errorMessage: string,
) => {
  const { id } = req.params;
  const query = { _id: id };
  const response = await Model.findOneAndDelete(query);
  if (response) {
    res.json({ response, message: successMessage });
  } else {
    next({ message: errorMessage });
  }
};
