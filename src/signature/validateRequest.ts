import { validateSignature } from './validateSignature';
import { isEmptyObject } from '../utils';

export const validateRequest = (req: any, secret: string, time: string, signature: string, client?: string): boolean => {
  const { query } = req;
  const data = !req.body || isEmptyObject(req.body) ? { client, query } : req.body;
  return validateSignature(secret, data, time, signature);
};
