# Decision: ORM: SQLAlchemy (async) with Alembic for migrations

- **Kind:** decision
- **Recorded:** 2026-09-02T18:36:25

## Decision
ORM: SQLAlchemy (async) with Alembic for migrations

## Reason
SQLAlchemy is the de‑facto ORM for Python, supports async operation required by FastAPI, and Alembic provides reliable schema migrations.
