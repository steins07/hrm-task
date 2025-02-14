# Matrix HRM
A Human Resource Management (HRM) system built with Next.js, MongoDB, and NextAuth.
A project created for task assignment of Maya Matrix.

## Live Demo
Check out the live application here: [Matrix HRM](https://hrm-task.vercel.app/)
## Features

*   **React.js:** For dynamic ui.
*   **Next.js:** Modern JS framework.
*   **Next-auth:** For authentication and route protection.
*   **Tailwind CSS:** Modern utility-first CSS framework for responsive styling.
*   **Hosting:** Hosted on Vercel for lightning-fast performance.

## API Routes
The following API routes are available:

### Authentication
- **POST** `/api/sign-up`: Create a new user account
- **POST** `/api/auth/sign-in`: Login to an existing user account

### Employees
- **GET** `/api/get-all-user`: Get a list of all employees
- **GET** `/api/get-single-employee`: Get a single employee by ID
- **POST** `/api/create-new-employee`: Create a new employee
- **POST** `/api/employees`: Update an existing employee
- **DELETE** `/api/delete-employee/:id`: Delete an employee

### Attendance
- **GET** `/api/get-attendance/:id`: Get a single attendance record by ID
- **POST** `/api/add-attendance`: Create a new attendance record

### Leave Request
- **POST** `/api/update-request`: Update leave request status
- **GET** `/api/get-leave-request`: Get a list of all leave request

## NextAuth Configuration
NextAuth is configured to use the `CredentialsProvider` with the following settings:

```javascript
id: "credentials",
name: "credentials",
credentials: {
  email: { label: "Email", type: "text" },
  password: { label: "Password", type: "password" }
}
```

## Environment Variables
The following environment variables are required:

- `MONGODB_URI`: The connection string for the MongoDB database
- `NEXTAUTH_SECRET`: A secret key for NextAuth
- `NEXTAUTH_URL`: The URL of the Next.js application (optional)

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/matrix-hrm.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. If dependencies issue occur use :
   ```sh
   npm install --legacy-peer-deps
   ```
   
4. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the application in your web browser: [http://localhost:3000](http://localhost:3000)
