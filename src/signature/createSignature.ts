import crypto from 'crypto';

export const createSignature = (secret: string, data: object): string => {
  const time = new Date().getTime();
  const dataToSign = `${time}.${JSON.stringify(data)}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign, 'utf8');
  return `t=${time},v1=${hmac.digest('hex')}`;
};
