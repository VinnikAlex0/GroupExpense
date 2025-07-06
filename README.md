# 💸 GroupExpense – Collaborative Expense Splitter

**GroupExpense** is a full-stack web app that helps groups of friends or roommates track shared expenses and split costs fairly. Whether it’s for a holiday, house share, or weekend getaway, GroupExpense simplifies who owes what and makes settling up painless.

---

## 🚀 Features

- ✅ Create groups and invite members
- 🧾 Add expenses with descriptions, categories, and who paid
- 💰 Automatically calculates who owes who
- 📊 Group summary view with total spent and balances
- ✉️ Shareable group links (invite via link)
- 🔐 Auth with Google or email/password
- 🧮 Settling up records (mark when debts are paid)

---

## 🛠️ Tech Stack

### Frontend

- React + TypeScript
- TailwindCSS
- Zustand or Redux for global state
- React Query or SWR for data fetching

### Backend

- Node.js + Express (or NestJS)
- PostgreSQL (via Prisma ORM)
- REST API

---

// Startup

# 1. Start database (PostgreSQL + pgAdmin)

docker-compose up -d

# 2. Start backend (Node.js + Prisma)

cd group-expense-backend
npm install
npm run dev

# 3. Start frontend (React + Vite)

cd ../group-expense-frontend
npm install
npm run dev

//Backend/Database Development

# 1. Edit your models in prisma/schema.prisma

# 2. Create migration and update DB

npx prisma migrate dev --name init

# 3. Open visual DB browser (optional)

npx prisma studio
