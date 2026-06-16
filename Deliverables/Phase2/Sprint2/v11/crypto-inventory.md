| Component             | Algorithm            | Purpose             | Location               |
| --------------------- | -------------------- | ------------------- | ---------------------- |
| Password Hashing      | bcrypt (10 rounds)   | user authentication | UserService.ts         |
| Session tokens        | UUID/JWT (if used)   | session management  | SessionService.ts      |
| HTTPS                 | TLS 1.2+ / 1.3       | transport security  | reverse proxy (Render) |
| Password reset tokens | crypto-secure random | reset flow          | UserService.ts         |



- no custom crypto implemented
- no MD5/SHA1 usage
