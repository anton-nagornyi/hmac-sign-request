import { extractFromAuthorization } from '../src/signature/extractFromAuthorization';

it('when data is empty string', () => {
  const res = extractFromAuthorization('');
  expect(res).toEqual({
    type: 'unknown',
  });
});

it('when data string is undefined', () => {
  const res = extractFromAuthorization();
  expect(res).toEqual({
    type: 'unknown',
  });
});

it('when data is not hmac sha256', () => {
  const res = extractFromAuthorization('Bearer 1111111111111111111111111');
  expect(res).toEqual({
    type: 'unknown',
  });
});

describe('when data is hmac sha256', () => {
  it('missing creds and signature', () => {
    const res = extractFromAuthorization('HMAC-SHA256 1111111111111111111111111');
    expect(res).toEqual({
      type: 'hmacSha256',
      hmacSha256: {
        clientId: undefined,
      },
    });
  });

  it('missing signature', () => {
    const res = extractFromAuthorization('HMAC-SHA256 credential=19fead3a-7e06-45c0-b36b-d5d9d3e59b67');
    expect(res).toEqual({
      type: 'hmacSha256',
      hmacSha256: {
        clientId: '19fead3a-7e06-45c0-b36b-d5d9d3e59b67',
      },
    });
  });

  it('missing creds', () => {
    const res = extractFromAuthorization('HMAC-SHA256 t=1608218828237,v1=62dc39902da7e06665f2ae06f0cd91ff236b5408ef418f480dd795f9cf9c675a');
    expect(res).toEqual({
      type: 'hmacSha256',
      hmacSha256: {
        clientId: undefined,
      },
    });
  });

  it('has creds and signature', () => {
    const res = extractFromAuthorization('HMAC-SHA256 credential=19fead3a-7e06-45c0-b36b-d5d9d3e59b67 t=1608218828237,v1=62dc39902da7e06665f2ae06f0cd91ff236b5408ef418f480dd795f9cf9c675a');
    expect(res).toEqual({
      type: 'hmacSha256',
      hmacSha256: {
        clientId: '19fead3a-7e06-45c0-b36b-d5d9d3e59b67',
        signature: '62dc39902da7e06665f2ae06f0cd91ff236b5408ef418f480dd795f9cf9c675a',
        time: 1608218828237,
        timeStr: '1608218828237',
      },
    });
  });

  it('has creds and signature and scope', () => {
    const res = extractFromAuthorization('HMAC-SHA256 credential=19fead3a-7e06-45c0-b36b-d5d9d3e59b67/some/scope/to/use t=1608218828237,v1=62dc39902da7e06665f2ae06f0cd91ff236b5408ef418f480dd795f9cf9c675a');
    expect(res).toEqual({
      type: 'hmacSha256',
      hmacSha256: {
        clientId: '19fead3a-7e06-45c0-b36b-d5d9d3e59b67',
        scope: '/some/scope/to/use',
        signature: '62dc39902da7e06665f2ae06f0cd91ff236b5408ef418f480dd795f9cf9c675a',
        time: 1608218828237,
        timeStr: '1608218828237',
      },
    });
  });
});
