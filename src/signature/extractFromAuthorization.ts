import { extractTimeSig } from './extractTimeSig';

type Authorization = {
  type: 'hmacSha256' | 'unknown',
  hmacSha256?: HmacSha256,
  scope?: string
};

type HmacSha256 = {
  clientId?: string,
  scope?: string,
  time?: number,
  timeStr?: string,
  signature?: string
};

const extractClientIdAndScope = (data: string): [string?, string?] => {
  const sep = data.indexOf('/');
  if (sep < 0) return [data];
  return [data.substring(0, sep), data.substring(sep)];
};

export const extractFromAuthorization = (data?: string): Authorization => {
  if (!data) {
    return {
      type: 'unknown',
    };
  }
  const [type, creds, sigData] = data.split(' ');
  const [credsField, credential] = creds ? creds.split('=') : [];
  const [clientId, scope] = credsField === 'credential' ? extractClientIdAndScope(credential) : [];

  switch (type) {
    case 'HMAC-SHA256':
      if (sigData) {
        const [time, timeStr, signature] = extractTimeSig(sigData);
        return {
          type: 'hmacSha256',
          hmacSha256: {
            clientId, time, timeStr, signature, scope,
          },
        };
      }
      return {
        type: 'hmacSha256',
        hmacSha256: {
          clientId, scope,
        },
      };
    default: return {
      type: 'unknown',
    };
  }
};
