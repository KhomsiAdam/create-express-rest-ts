import { Schema, model } from 'mongoose';

import { {{capitalizedName}}Interface } from './interface';

const {{capitalizedName}}Schema = new Schema<{{capitalizedName}}Interface>({}, { timestamps: true });

export const {{capitalizedName}}Model = model<{{capitalizedName}}Interface>('{{capitalizedName}}', {{capitalizedName}}Schema);
