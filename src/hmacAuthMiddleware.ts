import { extractFromAuthorization } from './signature/extractFromAuthorization';
import { validateRequest } from './signature/validateRequest';
import { NextFunction, Request, Response } from './types';

let initialized = false;
const clients = new Map<string, string>();

const Min2Mills = 60 * 1000;

const CONFIG = {
  refreshPeriod: (process.env.AUTH_CLIENT_REFRESH ? parseInt(process.env.AUTH_CLIENT_REFRESH, 10) : 10) * Min2Mills,
  requestTTL: (process.env.AUTH_REQUEST_TTL ? parseInt(process.env.AUTH_REQUEST_TTL, 10) : 5) * Min2Mills,
};

export const hmacAuthMiddleware = (reloadClients: (clients: Map<string, string>) => Promise<void>) => async (request: any, response: any, nextFunc: Function): Promise<any> => {
  const req = request as Request;
  const res = response as Response;
  const next = nextFunc as NextFunction;

  if (!initialized) {
    await reloadClients(clients);
    setInterval(reloadClients, CONFIG.refreshPeriod);
    initialized = true;
  }

  const auth = extractFromAuthorization(req.header('authorization'));

  if (auth.type !== 'hmacSha256') {
    return res.status(401).json({
      error: true,
      code: 'HMAC_UNSUPPORTED_AUTH',
      message: `Unsupported auth type '${auth.type}'`,
    });
  }

  if (!auth.hmacSha256) {
    return res.status(400).json({
      error: true,
      code: 'HMAC_AUTH_MALFORMED',
      message: 'Missing auth type',
    });
  }

  const { clientId } = auth.hmacSha256;
  if (!clientId) {
    return res.status(403).json({
      error: true,
      code: 'HMAC_AUTH_CLIENT',
      message: 'Missing client',
    });
  }

  const { signature } = auth.hmacSha256;
  if (!signature) {
    return res.status(401).json({
      error: true,
      code: 'HMAC_AUTH_SIGNATURE',
      message: 'Missing signature',
    });
  }

  const secret = clients.get(clientId);

  if (!secret) {
    return res.status(421).json({
      error: true,
      code: 'HMAC_AUTH_CLIENT',
      message: 'Unknown client',
    });
  }

  if (!auth.hmacSha256.timeStr || !auth.hmacSha256.time || !auth.hmacSha256.signature) {
    return res.status(400).json();
  }

  if (!validateRequest(req, secret, auth.hmacSha256.timeStr, auth.hmacSha256.signature, clientId)) {
    return res.status(406).json({
      error: true,
      code: 'HMAC_AUTH_SIGNATURE',
      message: 'Wrong signature',
    });
  }

  const now = new Date().getTime();
  if (now > auth.hmacSha256.time + CONFIG.requestTTL) {
    return res.status(400).json({
      error: true,
      code: 'HMAC_AUTH_TTL',
      message: 'Request is too old',
    });
  }

  const { scope } = auth;
  (req as any).hmacContext = {
    clientId,
    scope,
  };
  return next();
};
