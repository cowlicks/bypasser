## Minimal implementation of Cloudflare's captcha challenge bypass specification for Tor

Cloudflare's spec is [here](https://github.com/cloudflare/challenge-bypass-specification/).

A video demo of this extension working is [here](https://youtu.be/cO4SsoHN7Yw).

Where we're at:
- [x] Implement RSA blinding/unblinding/signing etc.
- [x] Get a test server responding with proper meta tags.
- [x] Client/extension detects meta tag.
- [x] Client submit tokens for signing.
- [x] Server sign and respond.
- [x] Client recieve tokens.
- [x] Client redeem tokens.
- [x] Server verify tokens.
- [ ] Transport encryption/jwt.
 
Also todo:
- [ ] Handle multiple signing keys better
- [ ] Use a full domain hash for blinding the message
- [ ] Make signature verification constant time
- [ ] Compare formats for sending tokens: stringifyed nums? bytes?
- [ ] Fill unsigned token pool asynchronously
- [ ] Move blind, keys, tokens to a node package
- [ ] Refresh page on redemption
- [ ] Enforce number of signatures allowed per captcha on server
