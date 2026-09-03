# Mini ERP + CRM Operations Portal

A full-stack ERP + CRM Operations Portal built as a Full Stack Developer case study for a wholesale/distribution business.

The application provides role-based authentication, customer CRM, product and inventory management, stock movement tracking, sales challan management, and an operational dashboard.

---

# Features

## Authentication & Role-Based Access

- JWT-based authentication
- Secure password hashing with bcrypt
- Four application roles:
  - ADMIN
  - SALES
  - WAREHOUSE
  - ACCOUNTS
- Role-based frontend navigation
- Role-based frontend route protection
- Backend authorization middleware
- Protected REST APIs

## Customer CRM

- Add customers
- Edit customers
- Search customers
- Pagination support
- Customer detail view
- Customer follow-up date
- Follow-up notes
- Customer status management
- Customer types:
  - Retail
  - Wholesale
  - Distributor

## Product & Inventory

- Add products
- Edit products
- Search products
- Current stock tracking
- Minimum stock threshold
- Low-stock status
- Warehouse location
- Stock adjustment
- IN / OUT stock movements
- Stock movement history
- Movement reason
- Movement creator
- Movement timestamp

## Sales Challans

- Create sales challans
- Select customer
- Add multiple products
- Specify quantity for each product
- Automatic challan number generation
- Draft status
- Confirmed status
- Cancelled status
- Challan detail view
- Product snapshot data
- Stock deduction on confirmation
- Insufficient-stock validation
- No-negative-stock protection
- Cancellation without stock deduction

## Dashboard

The dashboard displays live information based on the logged-in user's role.

Examples include:

- Total customers
- Total products
- Low-stock products
- Total challans
- Confirmed challans
- Draft challans
- Cancelled challans

---

# Technology Stack

## Backend

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- JWT
- bcryptjs
- Zod
- REST API

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- HTML
- CSS

## Database

- PostgreSQL

---

# Project Architecture

The application follows a separated frontend-backend architecture.

```text
                         MINI ERP + CRM
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
       React Frontend                     Express Backend
       TypeScript + Vite                  TypeScript
             |                                 |
             | REST API / JSON                 |
             +--------------->-----------------+
                              |
                              v
                         PostgreSQL
                              |
                              v
                       Persistent Data

backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── server.ts

React Frontend
      |
      v
 REST API
      |
      v
Express Routes
      |
      v
Authentication Middleware
      |
      v
Role Authorization
      |
      v
Controllers
      |
      v
Validation & Business Logic
      |
      v
PostgreSQL

frontend/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx


User
  |
  v
React UI
  |
  v
Page / Component
  |
  v
Axios API Client
  |
  v
Express REST API
  |
  v
JSON Response
  |
  v
React State / Context
  |
  v
Updated UI

users
  |
  +---- customer_followups

customers
  |
  +---- challans
          |
          +---- challan_items
                    |
                    v
                 products
                    |
                    v
             stock_movements


# Deployment

The application is deployed on Render and is available through the following production URLs.

## Live Frontend

**URL:**  
https://mini-erp-crm-frontend-2l49.onrender.com

The live React frontend provides the complete user interface for the Mini ERP + CRM Operations Portal, including authentication, dashboard, customer CRM, product and inventory management, stock movement tracking, and sales challan workflows.

## Live Backend API

**URL:**  
https://mini-erp-crm-1sbb.onrender.com

The live Express.js backend provides the production REST API used by the frontend for authentication, customer management, product and inventory operations, stock movements, and sales challan processing.

## Backend Health Check

**URL:**  
https://mini-erp-crm-1sbb.onrender.com/health

This endpoint is provided to verify that the deployed backend server is running and responding correctly.

Expected response:

```json
{
  "status": "ok",
  "service": "mini-erp-crm-api"
}

## GitHub Repository
**URL:**  
https://github.com/dipika-panda22/mini-erp-crm

The GitHub repository contains the complete source code for the frontend, backend, database schema, documentation, and Postman API collection.

## Postman API Documentation

**Repository Path:**  
`docs/Mini ERP CRM API.postman_collection.json`

The Postman collection contains the core REST API requests used to test authentication, customer CRM, products and inventory, stock movements, and sales challan workflows.

## Demo Credentials

The following role-based accounts are provided for evaluation of the deployed application.

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@example.com | Admin@123 |
| SALES | sales@example.com | Sales@123 |
| WAREHOUSE | warehouse@example.com | Warehouse@123 |
| ACCOUNTS | accounts@example.com | Accounts@123 |

These accounts allow the evaluator to verify authentication and role-based access control.

## Documentation

The `README.md` file provides:

- Project overview
- Technology stack
- Backend architecture
- Frontend architecture
- Database architecture
- API documentation
- Local setup instructions
- Environment variable configuration
- Deployment instructions
- Testing information
- Security considerations
- Assumptions
- Known limitations

## Postman API Collection

**Collection:**  
`docs/Mini ERP CRM API.postman_collection.json`

The Postman collection contains the core REST API requests used to test authentication, customer CRM, product and inventory management, stock movements, and sales challan workflows.

The collection covers the main API operations, including:

- Authentication
- Customer management
- Customer follow-ups
- Product management
- Stock movement history
- Sales challan creation
- Challan confirmation
- Challan cancellation


# Local Setup

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

## Clone Repository

```bash
git clone https://github.com/dipika-panda22/mini-erp-crm.git
cd mini-erp-crm


Backend Setup
cd backend
npm install

PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
npm run dev
http://localhost:5000

Frontend Setup
cd frontend
npm install
VITE_API_URL=http://localhost:5000/api
npm run dev
http://localhost:5173

# Database Setup

The application uses PostgreSQL as the relational database.

## Create Database

Create a PostgreSQL database for the project.

Example:

```sql
CREATE DATABASE mini_erp_crm;

# Deployment

The application is deployed as separate frontend and backend services with PostgreSQL as the production database.

## Frontend Deployment

The React + TypeScript frontend is deployed as a Render Static Site.

**Live Frontend:**

https://mini-erp-crm-frontend-2l49.onrender.com

The frontend communicates with the production backend through the `VITE_API_URL` environment variable.

Production configuration:

```env
VITE_API_URL=https://mini-erp-crm-1sbb.onrender.com/api


User
  |
  v
React Frontend
(Render Static Site)
  |
  | REST API / HTTPS
  v
Express Backend
(Render Web Service)
  |
  | PostgreSQL connection
  v
PostgreSQL Database
(Render)


# API Documentation

The backend exposes RESTful APIs under the `/api` base path.

All protected endpoints require a valid JWT access token.

## Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Authenticate user and return JWT | Public |

## Customer APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/customers` | List/search customers | Authenticated |
| POST | `/api/customers` | Create customer | ADMIN, SALES |
| GET | `/api/customers/:id` | Get customer details | Authenticated |
| PUT | `/api/customers/:id` | Update customer | ADMIN, SALES |
| POST | `/api/customers/:id/followups` | Add follow-up note | ADMIN, SALES |

## Product & Inventory APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | List/search products | Authenticated |
| POST | `/api/products` | Create product | ADMIN, WAREHOUSE |
| PUT | `/api/products/:id` | Update product | ADMIN, WAREHOUSE |
| GET | `/api/products/:id/stock-movements` | View stock movement history | Authenticated |

## Sales Challan APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/challans` | List challans | Authenticated |
| GET | `/api/challans/:id` | Get challan details | Authenticated |
| POST | `/api/challans` | Create sales challan | ADMIN, SALES |
| POST | `/api/challans/:id/confirm` | Confirm challan and deduct stock | ADMIN, SALES, WAREHOUSE |
| POST | `/api/challans/:id/cancel` | Cancel challan | ADMIN, SALES |

# API Testing

API testing was performed using Postman against the deployed production backend.

The Postman collection is available in the repository:

```text
docs/Mini ERP CRM API.postman_collection.json

# Security Considerations

The application implements the following security measures:

- JWT-based authentication for protected API access
- Password hashing using bcrypt
- Role-based authorization on backend routes
- Frontend route protection based on authenticated user role
- CORS configuration restricted to the deployed frontend
- Helmet middleware for HTTP security headers
- Zod-based request validation
- Environment variables for database credentials and JWT secrets
- Production secrets are excluded from Git using `.gitignore`
- Database credentials and passwords are not committed to the repository
- Stock deduction is performed only during challan confirmation
- Negative inventory is prevented through stock validation

# Assumptions

The project was implemented with the following assumptions:

- The application is intended for a wholesale/distribution business workflow.
- Users are assigned one of four predefined roles: ADMIN, SALES, WAREHOUSE, or ACCOUNTS.
- Product stock is maintained at the product level.
- A confirmed sales challan reduces the available product stock.
- A cancelled challan does not deduct stock.
- A challan cannot be confirmed when available stock is insufficient.
- PostgreSQL is used as the primary relational database.
- JWT is used for stateless API authentication.
- The frontend and backend are deployed as separate services.
- Production environment variables are configured on the deployment platform.

# Known Limitations

The current implementation focuses on the core requirements of the case study. The following enhancements could be added in a future version:

- Advanced reporting and analytics
- Export of customers, products, stock movements, and challans
- PDF generation for sales challans
- Email or notification-based follow-up reminders
- More advanced inventory reporting
- More granular permission management
- Automated test suite expansion
- Advanced dashboard charts
- Audit logging for all administrative actions
- Improved concurrent challan-number generation for high-volume production usage
