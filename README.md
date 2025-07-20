# 💸 GroupExpense – Collaborative Expense Splitter

**GroupExpense** is a full-stack web app that helps groups of friends or roommates track shared expenses and split costs fairly. Whether it's for a holiday, house share, or weekend getaway, GroupExpense simplifies who owes what and makes settling up painless.

---

## 🛠️ Tech Stack

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

### Authentication (Planned)

- **Supabase** - Authentication, authorization, and user management
- **Row-level Security** - Database-level access control
- **JWT Tokens** - Secure session management

### Development Tools

- **Docker** + **Docker Compose** - Containerized database
- **Prisma Studio** - Visual database browser
- **ESLint** + **TypeScript** - Code quality and type checking

---

## 🏗️ Architecture

### Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── GroupCard.tsx    # Individual group display
│   ├── GroupList.tsx    # Grid layout with empty states
│   ├── CreateGroupModal.tsx # Form modal with validation
│   ├── ErrorAlert.tsx   # Error display with retry
│   └── LoadingSpinner.tsx # Loading states
├── hooks/               # Custom React hooks
│   └── useGroups.ts     # Groups state management
├── services/            # API communication layer
│   └── groupService.ts  # Groups CRUD operations
├── pages/               # Main page components
│   └── GroupsPage.tsx   # Groups dashboard (modular, ~50 lines)
└── App.tsx             # Routing and app structure
```

### Backend Structure

```
src/
├── controllers/         # Request handlers
│   └── group.controller.ts
├── routes/             # API route definitions
│   └── group.routes.ts
├── prisma/             # Database layer
│   └── client.ts
└── server.ts           # Express app setup
```

---

## 🚀 Quick Start

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

## 🎯 Current Features

- ✅ **Group Management** - Create and view expense groups
- ✅ **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Loading States** - Smooth UX with loading spinners and notifications
- ✅ **Error Handling** - Graceful error recovery with retry functionality
- ✅ **Modular Architecture** - Reusable components and custom hooks

## 🔮 Planned Features

- 🔄 **User Authentication** - Secure signup/login with Supabase
- 🔄 **User-Specific Groups** - Personal group management
- 🔄 **Expense Tracking** - Add and categorize shared expenses
- 🔄 **Smart Splitting** - Flexible expense splitting (equal, percentage, custom)
- 🔄 **Debt Calculation** - Automatic "who owes whom" calculations
- 🔄 **Settlement Tracking** - Mark payments as settled
- 🔄 **Real-time Updates** - Live updates when group members add expenses
- 🔄 **Expense Categories** - Organize expenses by type (food, transport, etc.)
- 🔄 **Receipt Upload** - Photo attachments for expense verification
- 🔄 **Export Reports** - PDF/Excel summaries for group expenses

---

## 🧪 Development Notes

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

## 📁 Database Schema

```sql
-- Current Schema
model Group {
  id        Int      @id @default(autoincrement())
  name      String
  createdBy String
  createdAt DateTime @default(now())
}

-- Planned with Authentication
model Group {
  id        Int      @id @default(autoincrement())
  name      String
  userId    String   -- Supabase user ID
  createdAt DateTime @default(now())
  expenses  Expense[]
}

model Expense {
  id          Int      @id @default(autoincrement())
  description String
  amount      Decimal
  groupId     Int
  paidBy      String   -- User ID
  createdAt   DateTime @default(now())
  group       Group    @relation(fields: [groupId], references: [id])
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the modular architecture patterns
4. Add TypeScript types for all new code
5. Test your changes thoroughly
6. Commit with descriptive messages
7. Submit a pull request

---

**Built with ❤️ for seamless expense sharing**
