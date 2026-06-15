# Token API Reference

## Token policy

- Session tokens are self-contained JWTs signed with `HS256`.
- The backend rejects `none` and any algorithm outside the allowlist.
- Tokens must be issued by the configured backend issuer and targeted to the configured backend audience.
- The backend rejects JWT headers that try to point to external key material through `jku`, `x5u`, or `jwk`.
- Session tokens carry a `tokenType=access` claim so they are only used for authentication and authorization decisions.

## Verified claims

- `exp` and `nbf` are enforced by `jsonwebtoken.verify`.
- `iss` is checked against the configured backend issuer.
- `aud` is checked against the configured backend audience.
- `tokenType` is checked to ensure the token is being used as an access/session token.

## Issuance and verification

- New session tokens are issued on login through `POST /users/login`.
- Tokens are validated by the backend before any request is treated as authenticated.
- The server also checks the session record associated with the token to detect revocation, expiry, and suspicious contextual changes.

## Notes

- The application does not currently use ID tokens or federated token flows.
- There is no support for untrusted JWK or JWK-set URLs.
