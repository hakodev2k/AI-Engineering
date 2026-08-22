# Data Integrity and Consistency

## Purpose
Protect authoritative data from invalid, contradictory, orphaned, or silently divergent states.

## When to use
Use when designing constraints, investigating data anomalies, integrating multiple writers, or repairing weak legacy schemas.

## Inputs
Business invariants, schema, constraints, writer workflows, historical anomalies, reconciliation rules, and ownership boundaries.

## Context to inspect
Inspect nullability, checks, unique constraints, foreign keys, triggers, application validation, imports, direct database writes, and asynchronous integrations.

## Core knowledge
Critical invariants should be enforced as close to authoritative state as practical. Application validation improves UX but may not protect against concurrency, alternate writers, or operational scripts.

## Procedure
1. Express each business invariant precisely.
2. Identify all paths that can mutate affected data.
3. Map invariants to database constraints where representable.
4. Use transactions for multi-row or multi-table atomic invariants.
5. Define ownership for invariants spanning systems.
6. Detect existing violations before enabling stricter constraints.
7. Repair or quarantine invalid historical data deliberately.
8. Add reconciliation for eventually consistent copies.
9. Monitor integrity violations and failed writes.
10. Test concurrent and bulk-import paths.

## Decision points
Use declarative constraints for local invariants; use application/domain coordination when rules require external context. Avoid triggers unless their hidden execution model is justified and operationally understood.

## Common failure patterns
Application-only uniqueness, disabled foreign keys, silent import coercion, broad nullable columns, and reconciliation without a source of truth.

## Verification
Run invariant-focused tests, integrity queries, concurrency tests, and reconciliation checks.

## Expected output
Explicit integrity rules, enforcement mechanisms, repair plan, and evidence that invalid states are prevented or detected.

## Stop conditions
Escalate when no authoritative source exists or proposed repairs could discard legitimate business data.