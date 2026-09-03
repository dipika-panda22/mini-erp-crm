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

Backend Architecture and Frontend Architecture.
Frontend
React + TypeScript + Vite
        ↓
Axios REST API
        ↓
Backend
Express + TypeScript
        ↓
JWT + RBAC + Validation
        ↓
PostgreSQL