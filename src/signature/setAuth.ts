import { createSignature } from './createSignature';
import { isEmptyObject } from '../utils';

type AuthOpts = {
  client: string,
  secret: string,
  query?: object,
  body?: object,
  scope?: string
};

export const setAuth = (opts: AuthOpts) => {
  const {
    client, secret, query, body, scope,
  } = opts;
  const credential = `${client}${scope ? `/${scope}` : ''}`;
  const data = !body || isEmptyObject(body) ? { client, query: query || {} } : body;
  return {
    Authorization: `HMAC-SHA256 credential=${credential} ${createSignature(secret, data)}`,
  };
};
