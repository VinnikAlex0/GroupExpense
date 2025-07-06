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
- REST or GraphQL API
- Auth: Firebase Auth or Passport.js with JWT

---

## 🐳 Docker-Based Database Setup

This project uses **Docker Compose** to run PostgreSQL and pgAdmin for local development.

### ▶️ To Start the DB (PostgreSQL + pgAdmin)

1. Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running
2. From the project root, run:

```bash
docker-compose up
v
```
