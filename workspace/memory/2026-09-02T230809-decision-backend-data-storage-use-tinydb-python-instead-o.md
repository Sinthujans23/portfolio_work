# Decision: Backend data storage: Use TinyDB (Python) instead of lowdb to match Python FastA

- **Kind:** decision
- **Recorded:** 2026-09-02T23:08:09

## Decision
Backend data storage: Use TinyDB (Python) instead of lowdb to match Python FastAPI backend.

## Reason
Memory decision favored lowdb for JSON storage, but backend is Python FastAPI per earlier decision. TinyDB provides equivalent file‑based JSON storage in Python, preserving the simple JSON persistence intent.
