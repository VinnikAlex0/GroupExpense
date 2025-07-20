# GroupExpense – Expense Splitter

Full-stack web app that simplifies who owes what and makes settling up easy.

---

## Tech Stack

### Frontend

- **React 18** + **TypeScript** - Component-based UI with type safety
- **Tailwind CSS v3** - Utility-first CSS framework for rapid styling
- **Mantine UI v7** - Rich component library with forms, notifications, and modals
- **React Router DOM v7** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Custom Hooks** - Modular state management (useGroups, etc.)

### Backend

- **Node.js** + **Express** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Database modeling and migrations
- **PostgreSQL** - Relational database for data persistence

### Authentication

- **Supabase** - Authentication, authorization, and user management
- **JWT Middleware** - Backend route protection and user verification
- **Auth Context** - Frontend authentication state management
- **Protected Routes** - Route-level access control

### Development Tools

- **Docker** + **Docker Compose** - Containerized database
- **Prisma Studio** - Visual database browser
- **ESLint** + **TypeScript** - Code quality and type checking

---

## Architecture

### Frontend Structure

```
src/
├── components/          # Reusable UI components (GroupCard, CreateGroupModal, etc.)
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom React hooks (useGroups)
├── services/            # API communication layer
├── pages/               # Main page components (GroupsPage, AuthPage)
└── App.tsx             # Routing with protected routes
```

### Backend Structure

```
src/
├── controllers/         # Request handlers (group.controller.ts)
├── middleware/          # Auth middleware for protected routes
├── routes/             # API route definitions with auth protection
├── prisma/             # Database layer
└── server.ts           # Express app setup
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd group-expense-backend
npm install
npx prisma migrate dev --name init
npm run dev  # Starts on http://localhost:4000
```

### 3. Setup Frontend

```bash
cd ../group-expense-frontend
npm install --legacy-peer-deps  # Handle Mantine version conflicts
npm start  # Starts on http://localhost:3000
```

### 4. Optional: Database Browser

```bash
npx prisma studio  # Visual database interface
```

---

## Current Features

- ✅ **User Authentication** - Secure signup/login with Supabase
- ✅ **User-Specific Groups** - Personal group management with auth protection
- ✅ **Group Management** - Create and view expense groups
- ✅ **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Loading States** - Smooth UX with loading spinners and notifications
- ✅ **Error Handling** - Graceful error recovery with retry functionality
- ✅ **Modular Architecture** - Reusable components and custom hooks

## Planned Features

- 🔄 **Expense Tracking** - Add and categorize shared expenses
- 🔄 **Smart Splitting** - Flexible expense splitting (equal, percentage, custom)
- 🔄 **Debt Calculation** - Automatic "who owes whom" calculations
- 🔄 **Settlement Tracking** - Mark payments as settled
- 🔄 **Real-time Updates** - Live updates when group members add expenses
- 🔄 **Expense Categories** - Organize expenses by type (food, transport, etc.)
- 🔄 **Receipt Upload** - Photo attachments for expense verification
- 🔄 **Export Reports** - PDF/Excel summaries for group expenses

---

## Development Notes

### Code Style

- **TypeScript** - Strict typing throughout
- **Component Composition** - Small, focused, reusable components
- **Custom Hooks** - Business logic separated from UI components
- **Service Layer** - API calls isolated in service files
- **Error Boundaries** - Graceful error handling at component level

### State Management

- **Local State** - useState for component-specific state
- **Custom Hooks** - useGroups for feature-specific state
- **Future**: Redux/Zustand when cross-component state complexity grows

### Styling Approach

- **Tailwind CSS** - Utility classes for rapid development
- **Mantine Components** - Pre-built components for forms, modals, alerts
- **Responsive Design** - Mobile-first approach

---
