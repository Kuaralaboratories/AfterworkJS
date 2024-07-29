# Afterwork.js

**Afterwork.js**: Backend framework that isn't loved properly by even his mother. 🚬🥃

## Overview

Welcome to Afterwork.js – a backend framework that's as lightweight, fast, and atomic as they come. Designed with simplicity in mind, Afterwork.js provides the essentials you need to build efficient and effective server-side applications without the bloat.

![Afterworkjs Logo](images/Afterworkjs.svg)

## Features

- **Lightweight**: Minimal overhead ensures your applications run fast and efficiently.
- **Fast**: Optimized for speed, Afterwork.js delivers high performance with minimal resources.
- **Atomic**: Focuses on core functionalities to keep things simple and manageable.

## Getting Started

To get started with Afterwork.js, follow these simple steps:

1. **Install Afterwork.js**

   ```bash
   npm install afterworkjs
   ```

2. **Create Your Server**

   Create a file named `server.js`:

   ```typescript
   import { AfterworkJS } from 'afterworkjs';

   const config = {
     secret: 'your-secret-key',
     dbType: 'mongo', // or 'postgres', 'mysql'
     dbConfig: {
       // Your database config
     }
   };

   const app = new AfterworkJS(config);

   app.addRoute('get', '/hello', (req, res, next) => {
     res.json({ message: 'Hello, world!' });
   });

   app.start(3000);
   ```

3. **Run Your Server**

   ```bash
   npm start
   ```

   Your server will be running on port 3000.

## Features

- **Simple Routing**: Define routes with ease using `addRoute`.
- **Middleware Support**: Easily add middleware for request processing.
- **Database Integration**: Supports MongoDB, PostgreSQL, and MySQL out of the box.
- **JWT Authentication**: Secure your routes with JSON Web Tokens.

## Example Usage

Here's a simple example of how to use Afterwork.js for routing and middleware:

```typescript
import { AfterworkJS } from 'afterworkjs';

const app = new AfterworkJS({
  secret: 'your-secret-key',
  dbType: 'mongo',
  dbConfig: {
    dbUrl: 'mongodb://localhost:27017',
    dbName: 'mydatabase'
  }
});

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route to handle GET requests
app.addRoute('get', '/users', async (req, res) => {
  const users = await req.db.find('users', {});
  res.json(users);
});

// Start the server
app.start(3000);
```

## Documentation

For detailed documentation on Afterwork.js, visit the [official documentation](#).

## Contributing

Contributions are welcome! Please submit issues, feature requests, and pull requests to the [GitHub repository](#).

## License

Afterwork.js is licensed under the MIT License.

## Disclaimer

Afterwork.js: It might not be loved by everyone, but it gets the job done 🚬

---

feel free to contact us with contact@kuaralabs.org or with please "afterworkjs" title at project@kuaralabs.org 
