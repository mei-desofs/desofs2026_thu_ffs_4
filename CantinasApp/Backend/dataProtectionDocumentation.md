## Sensitive Data

### All Sensitive Data Created and Processed by the Application

#### Level 4 (Highly Sensitive - Critical)
- User passwords (hashed with bcrypt)
- Access tokens (JWT tokens)
- Refresh tokens
- Session identifiers
- Database credentials and connection strings

#### Level 3 (Sensitive - Confidential)
- User personal information (name, email, phone number)
- User roles and permissions
- Authentication audit logs (successful and failed attempts)

#### Level 2 (Internal - Restricted)
- Menu and dish information
- Ingredient lists and recipes
- Canteen data
- Meal planning data
- Stock information
- Producer and farmer product data
- Application error logs and stack traces


#### Level 4 (Highly Sensitive) Protection Requirements
- **Encryption**
- **Logging**: Tokens must be hashed in logs. Credencials must not be shown in plaintext.
- **Access Controls**: Role-based access control 
- **Token expiration**

#### Level 3 (Sensitive) Protection Requirements
- **Access Controls**: Role-based access control; restricted access to view personal information

#### Level 2 (Internal) Protection Requirements
- **Access Controls**: Access restricted to authenticated users with appropriate roles

