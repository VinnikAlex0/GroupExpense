# GroupExpense Backend

Node.js + Express API server with TypeScript, Prisma ORM, and Supabase integration.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Supabase project

### 1. Install Dependencies
`ash
npm install
`

### 2. Environment Setup
`ash
# Copy example environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# Get your service role key from Supabase Dashboard → Settings → API
`

### 3. Database Setup
`ash
# Start PostgreSQL database
docker-compose up -d

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
`

### 4. Start Development Server
`ash
npm run dev
# Server runs on http://localhost:4000
`

## 🔧 Environment Variables

Create a .env file in the backend directory:

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

## 📊 Database Schema

### Models
- **Group** - Expense groups with metadata
- **GroupMember** - Many-to-many relationship with roles (OWNER, ADMIN, MEMBER)
- **Expense** - Individual expenses with categories
- **Category** - Expense categorization system
- **Notification** - User notification system with types and metadata

### Migrations
All migrations are in prisma/migrations/:
- Initial schema setup
- Multi-user architecture
- Notification system

## 🔌 API Endpoints

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

## 🔐 Authentication

All endpoints require authentication via JWT tokens from Supabase.

### Middleware
- uthenticateUser - Verifies JWT tokens and adds user to request

### User Lookup
- Supabase integration for user lookup during member invitations
- Pending memberships for users who haven't signed up yet

## 🛠 Development

### Scripts
`ash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database browser
npx prisma migrate dev --name <name>  # Create new migration
`

### Database Management
`ash
# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate
`

## 📁 Project Structure

`
src/
├── controllers/         # Request handlers
│   ├── group.controller.ts      # Group management
│   ├── expense.controller.ts    # Expense management
│   ├── notification.controller.ts # Notification system
│   └── user.controller.ts       # User management
├── middleware/          # Auth middleware
├── routes/             # API route definitions
├── lib/                # External service integrations
│   └── supabase.ts     # Supabase client configuration
├── prisma/             # Database layer
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── server.ts           # Express app setup
`

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure Docker is running: docker-compose up -d
   - Check DATABASE_URL in .env

2. **Supabase Authentication Error**
   - Verify SUPABASE_SERVICE_ROLE_KEY in .env
   - Check Supabase project settings

3. **Prisma Client Error**
   - Run 
px prisma generate after schema changes
   - Restart development server

### Logs
- Server logs appear in console during development
- Database queries logged when DEBUG=true

## 📚 Dependencies

### Core
- **express** - Web framework
- **@prisma/client** - Database ORM
- **@supabase/supabase-js** - Supabase integration

### Development
- **typescript** - Type safety
- **@types/node** - Node.js types
- **nodemon** - Development server with auto-restart
