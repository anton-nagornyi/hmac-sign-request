import { createSignatureFromRequest } from './createSignatureFromRequest';

export const signRequest = (request: any, client: string, secret: string, scope?: string) => {
  const req = request as Request;
  const credential = `${client}${scope ? `/${scope}` : ''}`;
  req.headers.set('authorization', `HMAC-SHA256 credential=${credential} ${createSignatureFromRequest(req, client, secret)}`);
};
