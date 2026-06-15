# ENGREQ_51

# How to start

Install [Node.js](https://nodejs.org/en/download/).

Create a .env file in the Backend folder with the following content:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
```

Open 2 terminal windows.

In the first terminal, run the command:

```
cd Backend

npm install

npm run dev
```

In the second terminal, run the command:

```
cd Frontend

npm install

npm run dev
```

# Login

Go to `http://localhost:5173/login`

Use the following credentials:

### Supplier

Email: `supp@email.com`
Password: `V7!qL9@rP4#zN2$k`

### Nutritionist

Email: `nutri@email.com`
Password: `V7!qL9@rP4#zN2$k`

### NetworkManager

Email: `net@email.com`
Password: `V7!qL9@rP4#zN2$k`

### Student

Email: `stu@email.com`
Password: `V7!qL9@rP4#zN2$k`

After login, you will be redirected to the dashboard according to your role.

### Visitor

Email: `visitor@email.com`
Password: `V7!qL9@rP4#zN2$k`

## Authentication Controls

- The backend exposes a single local authentication path: email/password login that returns a JWT.
- Login and password-change requests are rate limited to 10 requests per 15 minutes to slow brute-force and credential-stuffing attempts.
- Passwords must be at least 8 characters long, may contain any character set, and are rejected if they contain context-specific application words or obvious common passwords.
- Password changes require the current password plus the new password.
- Authentication failures return a generic invalid-credentials response so valid accounts cannot be inferred from error messages.
- Seed accounts are for development only; replace them with project-specific credentials in any shared or deployed environment.

# Available Routes

### Supplier

http://localhost:5173/supplier-dashboard

### Network Manager

http://localhost:5173/network-dashboard
http://localhost:5173/suppliers-list
http://localhost:5173/application-evaluation

### Nutritionist

http://localhost:5173/nutritionist-dashboard
http://localhost:5173/menu-dashboard

### Student

http://localhost:5173/student-dashboard

### Farmer

http://localhost:5173/application

### Notes

- After changing any code in the backend, you need to restart the backend server.

- After changing any code in the frontend, the frontend server will automatically reload after saving the file.

- Currently, there is no protection for routes, so you can access any route directly by typing the URL in the browser, no need to login.
