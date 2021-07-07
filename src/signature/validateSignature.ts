import crypto from 'crypto';

export const validateSignature = (secret: string, data: object, time: string, signature: string): boolean => {
  const dataToSign = time ? `${time}.${JSON.stringify(data)}` : JSON.stringify(data);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(dataToSign, 'utf8');
  return signature === hmac.digest('hex');
};
