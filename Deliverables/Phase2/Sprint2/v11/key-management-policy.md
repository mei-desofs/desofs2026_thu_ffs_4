### 1. Keys used in system

* JWT/session secret (env var)
* bcrypt salt (library-managed)
* DB credentials (env)

### 2. Storage

* `.env` (local/dev)
* Render/hosting secrets manager (prod)

### 3. Lifecycle

* generation: deployment-time
* rotation: manual via redeploy
* revocation: invalidate sessions (SessionService)

### 4. Access control

* backend-only access
* no frontend exposure
