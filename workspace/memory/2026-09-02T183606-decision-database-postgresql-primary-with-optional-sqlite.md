# Decision: Database: PostgreSQL (primary) with optional SQLite for lightweight dev

- **Kind:** decision
- **Recorded:** 2026-09-02T18:36:06

## Decision
Database: PostgreSQL (primary) with optional SQLite for lightweight dev

## Reason
Requirement specifies PostgreSQL for persisting metadata, audit logs; PostgreSQL offers scalability and reliability for production, while SQLite can be used for local development convenience.
