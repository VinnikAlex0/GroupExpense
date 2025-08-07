# GroupExpense – Expense Splitter

Full-stack web app that simplifies who owes what and makes settling up easy. Features automatic group invitations, real-time notifications, and comprehensive expense tracking.

---

## Tech Stack

### Frontend

- **React 18** + **TypeScript** - Component-based UI with type safety
- **Tailwind CSS v3** - Utility-first CSS framework for rapid styling
- **Mantine UI v7** - Rich component library with forms, notifications, and modals
- **React Router DOM v7** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Custom Hooks** - Modular state management (useGroups, useExpenses, useNotifications)

### Backend

- **Node.js** + **Express** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Database modeling and migrations
- **PostgreSQL** - Relational database for data persistence
- **Supabase Integration** - User lookup and authentication

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

`
src/
├── components/          # Reusable UI components
│   ├── GroupCard.tsx   # Group display component
│   ├── CreateGroupModal.tsx # Group creation modal
│   ├── AddExpenseModal.tsx # Expense creation modal
│   ├── InviteMembersModal.tsx # Member invitation modal
│   ├── NotificationsDropdown.tsx # Notification dropdown
│   └── TopNavigation.tsx # Navigation with notifications
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom React hooks
│   ├── useGroups.ts    # Group management
│   ├── useExpenses.ts  # Expense management
│   └── useNotifications.ts # Notification management
├── services/            # API communication layer
├── pages/               # Main page components
└── App.tsx             # Routing with protected routes
`

### Backend Structure

`
src/
├── controllers/         # Request handlers
│   ├── group.controller.ts # Group management
│   ├── expense.controller.ts # Expense management
│   ├── notification.controller.ts # Notification system
│   └── user.controller.ts # User management
├── middleware/          # Auth middleware for protected routes
├── routes/             # API route definitions with auth protection
├── prisma/             # Database layer with migrations
└── server.ts           # Express app setup
`

---

## Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**

### 1. Start Database

`ash
docker-compose up -d
`

### 2. Setup Backend

`ash
cd group-expense-backend
npm install

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your actual Supabase service role key

npx prisma migrate deploy
npm run dev  # Starts on http://localhost:4000
`

### 3. Setup Frontend

`ash
cd ../group-expense-frontend
npm install --legacy-peer-deps  # Handle Mantine version conflicts
npm start  # Starts on http://localhost:3000
`

### 4. Optional: Database Browser

`ash
npx prisma studio  # Visual database interface
`

---

## Configuration

### Environment Variables

**Backend (.env):**
`nv
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/groupexpense

# Server
PORT=4000
`

**Frontend (.env):**
`nv
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_SESSION_TIMEOUT_MINUTES=30
REACT_APP_SESSION_WARNING_MINUTES=5
`

### Session Timeout Settings

You can customize session timeout behavior by adding these environment variables to your frontend .env file:

`ash
# Session timeout in minutes (default: 120 minutes = 2 hours)
REACT_APP_SESSION_TIMEOUT_MINUTES=120

# Warning time before session expires in minutes (default: 5 minutes)
REACT_APP_SESSION_WARNING_MINUTES=5
`

**Session Management Features:**

- ✅ **Automatic logout** after configured timeout period
- ✅ **Warning notifications** 5 minutes before expiry (configurable)
- ✅ **Session extension** on user activity (clicks, typing, scrolling)
- ✅ **Manual session refresh** via the session status indicator
- ✅ **Visual session timer** appears when session expires within 30 minutes

---

## Current Features

### 🔐 Authentication & Security
- ✅ **User Authentication** - Secure signup/login with Supabase
- ✅ **Session Management** - Automatic session timeout with configurable duration and user warnings
- ✅ **Protected Routes** - Route-level access control
- ✅ **JWT Middleware** - Backend route protection

### 👥 Group Management
- ✅ **Create Groups** - Create expense groups with descriptions
- ✅ **View Groups** - See all groups you're a member of
- ✅ **Group Details** - View group information and members
- ✅ **Member Roles** - OWNER, ADMIN, MEMBER role system
- ✅ **Group Invitations** - Invite members by email (BeemIt-style automatic addition)

### 👤 Member Management
- ✅ **Invite Members** - Add members to groups via email
- ✅ **Automatic Addition** - Members are added immediately (no acceptance flow)
- ✅ **Supabase Integration** - Real user lookup in Supabase
- ✅ **Pending Memberships** - Handle users who haven't signed up yet
- ✅ **Role Management** - Assign different roles to members

### 🔔 Notification System
- ✅ **Real-time Notifications** - Dropdown notification system
- ✅ **Hover-to-Read** - Notifications marked as read on hover
- ✅ **Unread Count** - Badge showing unread notification count
- ✅ **Notification Types** - Group invitations, expense updates, role changes
- ✅ **Beautiful UI** - Tasteful color coding for unread notifications

### 💰 Expense Tracking
- ✅ **Add Expenses** - Create expenses with amounts, descriptions, and categories
- ✅ **Expense Categories** - Organize expenses by type (food, transport, etc.)
- ✅ **Group Expenses** - All expenses tied to specific groups
- ✅ **Expense Summary** - Total amounts, expense counts, and top categories
- ✅ **Your Share Calculation** - Automatic equal split calculations

### 🎨 User Experience
- ✅ **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Loading States** - Smooth UX with loading spinners and notifications
- ✅ **Error Handling** - Graceful error recovery with retry functionality
- ✅ **Modular Architecture** - Reusable components and custom hooks

### 📊 Data Management
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **Real-time Updates** - Groups list refreshes when members are added
- ✅ **Data Persistence** - All data stored in PostgreSQL

---

## API Endpoints

### Groups
- POST /api/groups - Create a new group
- GET /api/groups - Get all user's groups
- GET /api/groups/:id - Get specific group details
- DELETE /api/groups/:id - Delete a group

### Group Members
- POST /api/groups/:id/members - Add member to group
- PUT /api/groups/:id/members/:memberId - Update member role
- DELETE /api/groups/:id/members/:memberId - Remove member

### Expenses
- POST /api/expenses - Create new expense
- GET /api/groups/:groupId/expenses - Get group expenses
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense
- GET /api/groups/:groupId/summary - Get group expense summary

### Categories
- GET /api/categories - Get all expense categories

### Notifications
- GET /api/notifications - Get user notifications
- GET /api/notifications/unread-count - Get unread count
- PUT /api/notifications/:id/read - Mark notification as read
- PUT /api/notifications/mark-all-read - Mark all as read

### Users
- POST /api/user/migrate-pending - Migrate pending memberships
- GET /api/user/profile - Get user profile

---

## Planned Features

- 🔄 **Smart Splitting** - Flexible expense splitting (equal, percentage, custom)
- 🔄 **Debt Calculation** - Automatic "who owes whom" calculations
- 🔄 **Settlement Tracking** - Mark payments as settled
- 🔄 **Receipt Upload** - Photo attachments for expense verification
- 🔄 **Export Reports** - PDF/Excel summaries for group expenses
- 🔄 **Email Notifications** - Email alerts for group invitations and expense updates
- 🔄 **Real-time Collaboration** - WebSocket updates for live expense tracking

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
- **Custom Hooks** - useGroups, useExpenses, useNotifications for feature-specific state
- **Future**: Redux/Zustand when cross-component state complexity grows

### Styling Approach

- **Tailwind CSS** - Utility classes for rapid development
- **Mantine Components** - Pre-built components for forms, modals, alerts
- **Responsive Design** - Mobile-first approach

### Database Schema

- **Groups** - Group information and metadata
- **GroupMembers** - Many-to-many relationship with roles
- **Expenses** - Individual expenses with categories
- **Categories** - Expense categorization system
- **Notifications** - User notification system with types and metadata

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details
