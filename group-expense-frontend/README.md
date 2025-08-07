# GroupExpense Frontend

React + TypeScript frontend with Mantine UI, Tailwind CSS, and Supabase authentication.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+
- Backend server running on http://localhost:4000

### 1. Install Dependencies

`ash
npm install --legacy-peer-deps
`

### 2. Environment Setup

Create a .env file in the frontend directory:

`nv
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_SESSION_TIMEOUT_MINUTES=30
REACT_APP_SESSION_WARNING_MINUTES=5
`

### 3. Start Development Server

`ash
npm start

# App runs on http://localhost:3000

`

## 🎨 UI Components

### Core Components

- **TopNavigation** - Navigation bar with notifications and user menu
- **GroupCard** - Display group information and stats
- **GroupList** - List of user's groups
- **CreateGroupModal** - Modal for creating new groups
- **AddExpenseModal** - Modal for adding expenses
- **InviteMembersModal** - Modal for inviting members to groups
- **NotificationsDropdown** - Dropdown notification system

### Pages

- **AuthPage** - Sign up/sign in with Supabase
- **GroupsPage** - Main groups listing page
- **GroupDetailsPage** - Detailed group view with expenses

## 🔧 Custom Hooks

### useGroups

`	ypescript
const { groups, loading, error, createGroup, refreshGroups } = useGroups();
`

- Fetch user's groups
- Create new groups
- Refresh groups list

### useExpenses

`	ypescript
const { expenses, categories, summary, createExpense } = useExpenses(groupId);
`

- Fetch group expenses
- Get expense categories
- Create new expenses
- Get expense summary

### useNotifications

`	ypescript
const { notifications, unreadCount, markAsRead } = useNotifications();
`

- Fetch user notifications
- Mark notifications as read
- Get unread count

## 🎯 Key Features

### Authentication

- Supabase authentication integration
- Protected routes
- Session management with timeout
- Automatic logout on inactivity

### Group Management

- Create and view expense groups
- Invite members by email
- Role-based permissions (OWNER, ADMIN, MEMBER)
- Real-time group updates

### Expense Tracking

- Add expenses with categories
- View expense summaries
- Calculate equal splits
- Expense categorization

### Notifications

- Real-time notification dropdown
- Hover-to-read functionality
- Unread count badge
- Beautiful UI with color coding

## �� Development

### Scripts

`ash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
`

### Available Scripts

- npm start - Runs the app in development mode
- npm test - Launches the test runner
- npm run build - Builds the app for production
- npm run eject - Ejects from Create React App

## 📁 Project Structure

`src/
├── components/          # Reusable UI components
│   ├── GroupCard.tsx           # Group display component
│   ├── CreateGroupModal.tsx    # Group creation modal
│   ├── AddExpenseModal.tsx     # Expense creation modal
│   ├── InviteMembersModal.tsx  # Member invitation modal
│   ├── NotificationsDropdown.tsx # Notification dropdown
│   ├── TopNavigation.tsx       # Navigation with notifications
│   ├── LoadingSpinner.tsx      # Loading component
│   ├── ErrorAlert.tsx          # Error display component
│   └── index.ts                # Component exports
├── contexts/            # React contexts
│   └── AuthContext.tsx         # Authentication context
├── hooks/               # Custom React hooks
│   ├── useGroups.ts            # Group management
│   ├── useExpenses.ts          # Expense management
│   └── useNotifications.ts     # Notification management
├── pages/               # Main page components
│   ├── AuthPage.tsx            # Authentication page
│   ├── GroupsPage.tsx          # Groups listing page
│   └── GroupDetailsPage.tsx    # Group details page
├── services/            # API communication layer
│   ├── groupService.ts         # Group API calls
│   ├── expenseService.ts       # Expense API calls
│   └── notificationService.ts  # Notification API calls
├── lib/                 # External integrations
│   └── supabase.ts             # Supabase client
└── App.tsx             # Main app component with routing`

## 🎨 Styling

### Tailwind CSS

- Utility-first CSS framework
- Responsive design
- Custom component styling

### Mantine UI

- Pre-built components for forms, modals, alerts
- Consistent design system
- Accessibility features

### Custom Styling

- Component-specific styles
- Responsive layouts
- Dark/light theme support

## 🔐 Authentication Flow

1. **Sign Up/In** - Users authenticate via Supabase
2. **Session Management** - Automatic timeout with warnings
3. **Protected Routes** - Route-level access control
4. **Token Management** - JWT tokens for API calls

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Adaptive layouts

## 🔍 Troubleshooting

### Common Issues

1. **Backend Connection Error**

   - Ensure backend is running on http://localhost:4000
   - Check network connectivity

2. **Supabase Authentication Error**

   - Verify REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
   - Check Supabase project settings

3. **Build Errors**
   - Clear node_modules and reinstall:
     m -rf node_modules && npm install
   - Check for TypeScript errors

### Development Tips

- Use React Developer Tools for debugging
- Check browser console for errors
- Use Network tab to debug API calls
- Enable TypeScript strict mode for better type safety

## 📚 Dependencies

### Core

- **react** - UI library
- **react-dom** - DOM rendering
- **react-router-dom** - Client-side routing
- **typescript** - Type safety

### UI Libraries

- **@mantine/core** - Component library
- **@mantine/hooks** - Custom hooks
- **@mantine/notifications** - Toast notifications
- **@tabler/icons-react** - Icon library
- **tailwindcss** - Utility CSS framework

### Authentication

- **@supabase/supabase-js** - Supabase client
- **@supabase/auth-ui-react** - Auth UI components

### Development

- **@types/react** - React TypeScript types
- **@types/react-dom** - React DOM types
- **eslint** - Code linting
