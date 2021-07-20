import { createSignature } from '../src/signature/createSignature';
import { extractTimeSig } from '../src/signature/extractTimeSig';
import { validateSignature } from '../src/signature/validateSignature';
import { setAuth } from '../src/signature/setAuth';

const RealDate = Date;
// eslint-disable-next-line no-new-wrappers
const NOW = {
  value: 1608218828237,
};
// @ts-ignore
global.Date = class extends RealDate {
  constructor() {
    super();
    return new RealDate(NOW.value);
  }
};
afterAll(() => {
  global.Date = RealDate;
});

const secret = 'secret';
const data = {
  id: '63efb783-dcf9-44f0-a7ab-8a6010aa6fe6',
  created: 1608218828237,
  data: {
    id: '00000000-0000-0000-0000-000000000000',
  },
  type: 'type',
};

it('signature create', () => {
  const sig = createSignature(secret, data);
  expect(sig).toBe('t=1608218828237,v1=f19a4d83f4052d17426a9c5c23f2c1fd97768db0b0191384ab360f1a2e7b4fff');
});

it('signature validate', () => {
  const sig = 't=1608218828237,v1=f19a4d83f4052d17426a9c5c23f2c1fd97768db0b0191384ab360f1a2e7b4fff';
  const [, time, checkSig] = extractTimeSig(sig);

  expect(validateSignature(secret, data, time, checkSig)).toBeTruthy();
});

it('setAuth', () => {
  const params = {
    a: 1,
    b: '1'
  };

  const headers = setAuth({
    client: 'client',
    secret: 'secret',
    query: params,
  });

  const sig = headers.Authorization.split(' ')[2];
  const [, time, checkSig] = extractTimeSig(sig);
  console.log(validateSignature('secret', params, time, checkSig));
  console.log(headers);
});
