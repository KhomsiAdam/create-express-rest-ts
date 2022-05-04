import type { Document } from 'mongoose';

export const handlePopulate = async (
  documentQuery: Document,
  populate: boolean,
  populateFields: string,
  selectedFields: string,
): Promise<Document> => {
  if (populate && populateFields !== '' && selectedFields === '') return documentQuery.populate(populateFields);
  if (populate && populateFields !== '' && selectedFields !== '')
    return documentQuery.populate(populateFields, selectedFields);
  return documentQuery;
};
