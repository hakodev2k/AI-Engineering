# Data Safety Rules

## Purpose
Prevent production operations from causing unintended data loss, corruption, leakage, or irreversible state changes.

## Scope
Applies to production databases, queues, object stores, caches, migrations, repairs, backfills, and administrative scripts.

## MUST
- Destructive or bulk data operations MUST define affected scope, validation queries, recovery strategy, and explicit human approval before execution.
- Data migrations and repairs MUST preserve integrity constraints and be tested against representative data.
- Backups or recovery mechanisms MUST be verified before relying on them for high-risk operations.
- Production data handling MUST follow applicable classification, retention, and access requirements.

## MUST NOT
- MUST NOT execute unbounded destructive queries against production data.
- MUST NOT assume a backup is usable without restore or recovery evidence appropriate to the system.
- MUST NOT copy sensitive production data into uncontrolled debugging environments.

## SHOULD
- Prefer idempotent, resumable, rate-limited data operations.
- Use dry-run or preview modes where practical.

## Exceptions
Exceptions require documented urgency, scope, evidence, compensating controls, and authorized approval.

## Verification
Inspect scripts, query plans, approvals, backup tests, integrity checks, audit logs, and post-operation reconciliation evidence.
