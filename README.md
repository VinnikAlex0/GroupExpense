# 💸 GroupExpense – Collaborative Expense Splitter

**GroupExpense** is a full-stack web app that helps groups of friends or roommates track shared expenses and split costs fairly. Whether it’s for a holiday, house share, or weekend getaway, GroupExpense simplifies who owes what and makes settling up painless.

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

# 4. Edit your models in prisma/schema.prisma

# 5. Create migration and update DB

npx prisma migrate dev --name init

# 6. Open visual DB browser (optional)

npx prisma studio
