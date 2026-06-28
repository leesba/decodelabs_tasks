# DecodeLabs — Project 3: The Memory Vault

**Database Integration** · Batch 2026 · Powered by DecodeLabs
> *Project 1 was the face. Project 2 was the brain. Project 3 is the memory.*

---

## Overview

Project 3 moves from the browser into the database layer — designing a real schema, performing full CRUD operations through a PHP backend, and protecting data with parameterized queries.

Built with **PHP + MySQL via XAMPP**. No ORM. Raw PDO for maximum transparency.

---

## Live Sections

| Section | Description |
|---|---|
| **Schema Blueprint** | Visual `interns` table — PK, UNIQUE, NOT NULL, ENUM, TIMESTAMP |
| **CRUD Manager** | Live Add · Edit · Delete · Read — all hitting MySQL |
| **CRUD Map** | CREATE→POST→INSERT · READ→GET→SELECT · UPDATE→PUT→UPDATE · DELETE→DELETE→DELETE |
| **SQL vs NoSQL** | Side-by-side comparison with use cases |
| **Relationships** | 1:1 · 1:Many · Many:Many with examples |
| **Security** | SQL Injection demo vs Parameterized Query defense |

---

## Key Concepts Covered

- **Schema Design** — Typed columns, constraints, auto-increment primary key
- **CRUD Operations** — Full Create, Read, Update, Delete via PHP PDO
- **Constraints** — `PRIMARY KEY` · `UNIQUE` · `NOT NULL` · `ENUM` · `DEFAULT`
- **SQL vs NoSQL** — When to use relational vs document databases
- **Relationships** — One-to-One · One-to-Many · Many-to-Many
- **SQL Injection** — How it works and why it's dangerous
- **Parameterized Queries** — PDO `prepare()` + `execute()` for injection prevention

---

## Tech Stack

```
PHP 8.x    — Backend API endpoints (PDO)
MySQL      — Relational database (via XAMPP)
HTML5      — Semantic frontend structure
CSS3       — Emerald/Navy design system, responsive layout
JavaScript — Vanilla fetch() for CRUD operations
```

---

## Project Structure

```
Project-3/
├── index.html       ← Frontend — schema, CRUD manager, concepts, security
├── style.css        ← Emerald/Navy theme, responsive layout
├── script.js        ← fetch() CRUD operations, modal logic
├── setup.sql        ← Database schema + sample data
├── api/
│   ├── db.php       ← PDO connection
│   ├── read.php     ← GET  → SELECT all interns
│   ├── create.php   ← POST → INSERT new intern
│   ├── update.php   ← PUT  → UPDATE existing intern
│   └── delete.php   ← DELETE → DELETE intern by id
└── README.md
```

---

## Database Schema

```sql
CREATE TABLE interns (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  batch      VARCHAR(10)  NOT NULL DEFAULT '2026',
  domain     VARCHAR(100) NOT NULL,
  status     ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

---

## Setup (Local)

1. Start **XAMPP** — Apache + MySQL
2. Copy project to `xampp/htdocs/decodelabs-project3/`
3. Open `phpMyAdmin` → SQL tab → run `setup.sql`
4. Visit `http://localhost/decodelabs-project3/`

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Forest | `#0A1F14` | Hero background |
| Emerald | `#059669` | Primary accent, CTA |
| Emerald Light | `#10B981` | Highlights, terminal |
| Navy | `#0D1B2A` | Header, footer |
| Cream | `#F0FDF4` | Section backgrounds |

---

**DecodeLabs** · Batch 2026 · Full Stack Development · Greater Lucknow, India
📧 decodelabs.tech@gmail.com · 📞 +91 89330 06408
