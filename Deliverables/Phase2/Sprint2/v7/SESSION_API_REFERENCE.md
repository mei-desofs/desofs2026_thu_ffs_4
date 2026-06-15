# Session API Reference

## Authenticated session flow

- Login issues a fresh session token and stores a server-side session record.
- All authenticated requests must send `Authorization: Bearer <token>`.
- The backend validates the JWT signature and then checks the persistent session record.
- A session is rejected when it is revoked, expired by inactivity, or past the absolute lifetime limit.

## Timeouts and limits

- Inactivity timeout: 30 minutes.
- Absolute maximum lifetime: 24 hours.
- Maximum concurrent active sessions per user: 3.
- When the concurrent session limit is exceeded, the oldest active session is revoked.

## Endpoints

### Public authentication

- `POST /users/login`
- `POST /users/logout` requires authentication.
- `POST /users/verify-email`
- `POST /users/forgot-password`
- `POST /users/reset-password`

### Per-user session management

- `GET /users/sessions` lists the active sessions for the authenticated user.
- `DELETE /users/sessions/:sessionId` terminates a specific session belonging to the authenticated user.
- `DELETE /users/sessions` terminates all sessions for the authenticated user.
- `DELETE /users/sessions/others` terminates every other active session except the current one.

### Password lifecycle controls

- `PATCH /users/password` accepts `terminateOtherSessions=true` to revoke all other sessions after a successful password change.
- `POST /users/forgot-password` and `POST /users/reset-password` revoke the active sessions when the password is changed through recovery.
- `POST /users/admin/:id/password-reset` creates a reset token without letting an administrator choose the password.

### Administrative controls

- `DELETE /users/admin/:id/sessions` terminates all active sessions for one user.
- `DELETE /users/admin/sessions` terminates all active sessions for all users.

## Notes

- This application does not currently use an external IdP or federated SSO.
- MFA and step-up authentication are not implemented yet, so the associated V7 requirements remain out of scope for this iteration.
