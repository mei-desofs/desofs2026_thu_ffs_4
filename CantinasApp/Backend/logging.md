Logging documentation

- Files written:
  - `logs/app.log`: application informational and debug logs.
  - `logs/error.log` error logs.
- Console: human-readable lines (for local debugging). File transports are canonical JSON for processors.
- Metadata included in each log entry:
  - `timestamp` (ISO 8601 UTC), `level`, `service`, `host`
  - `event`: semantic event name (e.g. `http_request`, `auth_success`, `authz_decision`, `internal_error`)
  - `requestId`: UUID correlation id for requests when applicable
  - `method`, `path`, `ip`, `userAgent`
  - `userId` / `role` when available

- Sensitive-data handling:
  - Sensitive fields (password, token, card numbers, cvv, ssn, secret) are masked when present in logged objects.
  - Tokens and credentials are never logged in cleartext.

- Log format and processing:
  - Files are written as structured JSON so log processors can parse and correlate.
  - Timestamps are in UTC.


