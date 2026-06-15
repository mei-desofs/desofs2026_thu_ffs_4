# Authentication API Quick Reference

## New Endpoints (Sprint 2)

### 1. Email Verification

**Endpoint:** `POST /api/users/verify-email`

```bash
curl -X POST http://localhost:3000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "a1b2c3d4e5f6..."}'
```

**Request:**

```json
{
  "token": "string (required)"
}
```

**Response (200 OK):**

```json
{
  "message": "Email verificado com sucesso.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**Errors:**

- `400` - Invalid/expired token
- `400` - Token does not exist

---

### 2. Request Password Reset (Forgot Password)

**Endpoint:** `POST /api/users/forgot-password`

```bash
curl -X POST http://localhost:3000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Request:**

```json
{
  "email": "string (required, valid email format)"
}
```

**Response (200 OK):**

```json
{
  "message": "Se a conta existe, receberá um email com instruções."
}
```

**Notes:**

- Returns same message regardless of whether email exists (prevents user enumeration)
- In production, an email would be sent with reset link containing the token
- Token expires after 60 minutes
- Rate limited: 10 requests per 15 minutes per IP

---

### 3. Reset Password

**Endpoint:** `POST /api/users/reset-password`

```bash
curl -X POST http://localhost:3000/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6...",
    "newPassword": "NewSecure123!@#"
  }'
```

**Request:**

```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200 OK):**

```json
{
  "message": "Password alterada com sucesso.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "status": "enabled"
  }
}
```

**Errors:**

- `400` - Invalid/expired token
- `400` - Password violates policy (too short, common, or contains context words)
- `400` - Token does not exist

**Password Policy:**

- Minimum 8 characters
- Cannot be: 123456, password, qwerty, admin, welcome, monkey, etc. (100+ common passwords)
- Cannot contain app-specific words: cantinasapp, biocantina, desofs2026, role names, etc.
- Maximum 128 characters
- Any character type allowed (no required uppercase, numbers, special chars)

---

### 4. Change Password (Existing - Documented for Reference)

**Endpoint:** `PATCH /api/users/password`

```bash
curl -X PATCH http://localhost:3000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "currentPassword": "OldPass123",
    "newPassword": "NewPass456"
  }'
```

**Request:**

```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)"
}
```

**Response (200 OK):**

```json
{
  "message": "Password atualizada com sucesso.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**Requires:**

- Valid JWT token in Authorization header
- Current password must match user's actual password
- New password must pass policy validation

---

## Existing Endpoints (Reference)

### Register

**Endpoint:** `POST /api/users/register`

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "Student"
  }'
```

---

### Login

**Endpoint:** `POST /api/users/login`

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200 OK):**

```json
{
  "message": "Login bem-sucedido",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "status": "enabled",
    "canteenId": null,
    "refeitorioId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400):**

```json
{
  "message": "Credenciais inválidas."
}
```

---

## Password Policy Details

### Accepted Passwords ✅

- `SecurePass123!@#` - 14 chars, mixed case, numbers, symbols
- `VeryLongPasswordWith123Numbers` - 30 chars, descriptive
- `EightChars1` - exactly 8 chars, minimum required
- `abcDEF123!@#xyzQ` - 16 chars, no special character rules enforced

### Rejected Passwords ❌

- `short` - Too short (< 8 chars)
- `123456` - Common password
- `password123` - Common password
- `CantinasApp-Password` - Contains app-specific word "cantinasapp"
- `JohnDoe123` - May contain user's name (context-specific)
- `Student-2025` - Contains role name "student"

---

## Authentication Flow Examples

### Complete Registration → Login Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "MySecurePass123!",
    "role": "Nutritionist"
  }'
# Returns: { id: 1, name: "Jane Smith", ..., status: "enabled", emailVerified: false }

# 2. Verify email (in real app, click link from email)
curl -X POST http://localhost:3000/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "<token_from_email>"}'
# Returns: { message: "Email verificado com sucesso.", user: {...} }

# 3. Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "MySecurePass123!"
  }'
# Returns: { message: "Login bem-sucedido", user: {...}, token: "jwt..." }

# 4. Use token to access protected endpoints
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <jwt_token>"
```

### Forgot Password → Reset Flow

```bash
# 1. User forgets password, requests reset
curl -X POST http://localhost:3000/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com"}'
# Returns: { message: "Se a conta existe, receberá um email com instruções." }

# 2. User receives email with reset token/link, clicks it
# (In production, frontend extracts token from URL)

# 3. Reset password with token
curl -X POST http://localhost:3000/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<token_from_email>",
    "newPassword": "MyNewPassword456!"
  }'
# Returns: { message: "Password alterada com sucesso.", user: {...} }

# 4. Login with new password
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "MyNewPassword456!"
  }'
```

### Change Password (While Logged In)

```bash
# User is logged in with JWT token
curl -X PATCH http://localhost:3000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "currentPassword": "MySecurePass123!",
    "newPassword": "AnotherNewPass789!"
  }'
# Returns: { message: "Password atualizada com sucesso.", user: {...} }
```

---

## Rate Limiting

All authentication endpoints are rate limited:

- **Limit:** 10 requests per 15 minutes per IP address
- **Response:** `429 Too Many Requests` if exceeded

Apply rate limiting to:

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`
- `POST /api/users/verify-email`
- `PATCH /api/users/password`

---

## Login Audit Trail

All login attempts are logged with:

- User ID (if known)
- Email
- IP Address
- User-Agent
- Status: `success`, `failed`, `blocked`
- Timestamp
- Failure reason (if applicable)

**Examples logged:**

- ✅ `{ email: "user@example.com", status: "success", ipAddress: "192.168.1.1" }`
- ❌ `{ email: "user@example.com", status: "failed", ipAddress: "192.168.1.1", reason: "Invalid password" }`

---

## Security Best Practices

1. **Always use HTTPS** in production (tokens are JWT, sent in plaintext)
2. **Store JWT tokens securely** in browser (httpOnly cookies if possible)
3. **Don't log passwords** - audit only shows hashes
4. **Verify email addresses** before granting full access
5. **Implement email verification** for password resets (confirm user controls email)
6. **Set strong passwords** - use generated ones if available
7. **Implement 2FA** when possible - currently in progress

---

## Testing Credentials

### Demo Users (from seed data)

- **Email:** nutritionist@example.com
- **Password:** V7!qL9@rP4#zN2$k
- **Role:** Nutritionist

- **Email:** supplier@example.com
- **Password:** V7!qL9@rP4#zN2$k
- **Role:** Supplier

All demo users use the same strong password for testing purposes.

---

## Troubleshooting

**Q: Token expired error**

- A: Tokens expire after 60 minutes. Request a new one.

**Q: "Credenciais inválidas." on login**

- A: This message is intentionally generic. Check:
  - Email exists in system
  - Password is correct
  - Account is not disabled

**Q: Rate limit error**

- A: Wait 15 minutes or use different IP address. Contact admin if legitimate legitimate traffic.

**Q: Email not received**

- A: Email service not yet configured. In development, check logs for token.

**Q: Password rejected as "too common"**

- A: Choose a password not in the blocklist (100+ common passwords blocked).

---

## API Response Status Codes

| Code  | Meaning                          |
| ----- | -------------------------------- |
| `200` | Success                          |
| `201` | Created (registration)           |
| `400` | Bad request (validation error)   |
| `401` | Unauthorized (invalid token)     |
| `404` | Not found (user doesn't exist)   |
| `429` | Too many requests (rate limited) |
| `500` | Server error                     |

---

## Frontend Integration Notes

When building the frontend, implement these endpoints in this order:

1. **Login page** → Uses `/login` endpoint
2. **Registration page** → Uses `/register` endpoint
3. **Email verification** → Display verification prompt, call `/verify-email`
4. **Forgot password page** → Call `/forgot-password` → Show "Check email"
5. **Reset password page** → Extract token from URL → Call `/reset-password`
6. **Settings page** → Call `PATCH /password` for password change (when authenticated)
7. **Dashboard** → Store JWT from login, include in Authorization header
