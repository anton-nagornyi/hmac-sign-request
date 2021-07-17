# HMAC Request Sign

This is used to sign request with hmac256 using clientId and secret. This package also 
contains express middleware to validate such signed requests. 

## Usage

### Add request headers
```typescript
import {setAuth} from 'hmac-sign-request';
import axios from "axios";
(async () => {
  const res = await axios.get('https://somewhere.com',  {
    headers: setAuth({
      client: 'client',
      secret: 'secret',
    })
  });
  console.log(res);
})();
```

### Sign request

```typescript
import {signRequest} from 'hmac-sign-request';

let req: Request; // initialize it

signRequest(req, 'client', 'secret');
console.log(req.header('authorization'));
//HMAC-SHA256 credential=client t=1608218828237,v1=644a323b5586d369220fc5efbcaf8c4bae7d74782c44b7ff49945231f8cc9e84
```

### Create signature from object

```typescript
import {createSignature} from 'hmac-sign-request';

console.log(createSignature('secret', {some: 'object'}));
// t=1608218828237,v1=644a323b5586d369220fc5efbcaf8c4bae7d74782c44b7ff49945231f8cc9e84
```

### Create signature from Request
```typescript
import {createSignatureFromRequest} from 'hmac-sign-request';

console.log(createSignatureFromRequest(req, 'client', 'secret'));
// t=1608218828237,v1=644a323b5586d369220fc5efbcaf8c4bae7d74782c44b7ff49945231f8cc9e84
```

### Using express middleware

To configure middleware behaviour use environment variables:
```dotenv
# [Optional] 
# Period in minutes when reloading of hmacAuthMiddleware known clients is called.
# Default is 10 minutes
AUTH_CLIENT_REFRESH=10
# [Optional]
# The period of time in minutes while request is considered valid. Based on t= part of the authorization header.
# Default is 5 minutes
AUTH_REQUEST_TTL=5

```
For hmacAuthMiddleware provide a function that will update known clients Map.
```typescript
import express from 'express';
import {hmacAuthMiddleware} from 'hmac-sign-request';

const app = express();

app.use(hmacAuthMiddleware((clients) => {
  clients.set('client', 'secret');
}));
