export enum SuccessMessages {
  {{uppercaseName}}_UPDATED = '{{capitalizedName}} updated successfully.',
  {{uppercaseName}}_DELETED = '{{capitalizedName}} deleted successfully.',
}

export enum ErrorMessages {
  {{uppercaseName}}S_NOT_FOUND = 'No {{lowercaseName}}s found.',
  {{uppercaseName}}_NOT_FOUND = '{{capitalizedName}} was not found.',
}

export const SALT_ROUNDS = 12;
