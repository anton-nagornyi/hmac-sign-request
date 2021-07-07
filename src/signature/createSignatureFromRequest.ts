import { createSignature } from './createSignature';
import { isEmptyObject } from '../utils';

export const createSignatureFromRequest = (req: any, client: string, secret: string): string => {
  const { query } = req;
  const data = !req.body || isEmptyObject(req.body) ? { client, query } : req.body;
  return createSignature(secret, data);
};
