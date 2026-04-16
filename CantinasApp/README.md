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
Password: `123456`

### Nutritionist

Email: `nutri@email.com`
Password: `123456`

### NetworkManager

Email: `net@email.com`
Password: `123456`

### Student

Email: `stu@email.com`
Password: `123456`

After login, you will be redirected to the dashboard according to your role.

### Visitor

Email: `visitor@email.com`
Password: `123456`

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
