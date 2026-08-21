# Skill: Plan Schema Evolution

## Purpose
Turn contract evidence into a safe producer-consumer rollout plan with explicit compatibility and replay criteria.

## Inputs
The investigation handoff, old/new contracts, consumer capabilities, retention/replay facts, acceptance criteria.

## Preconditions
All known consumers are listed. Unknown consumers or uninspected strict readers are treated as blocking risks.

## Process
1. Choose compatibility objective: backward compatibility by default; document why another mode is required.
2. Prefer additive evolution: optional/defaulted fields and tolerant readers.
3. For rename/removal/type/semantic changes, design an expand-migrate-contract sequence: introduce new representation; deploy readers that support both; deploy writers; observe; migrate/replay if approved; retire legacy representation only after the compatibility window.
4. Define consumer-first or producer-first rollout order from actual deserializer behavior, not convention.
5. Define replay tests using historical fixtures or a non-production copy. Production replay requires approval.
6. Define observability: deserialization failures, unknown enum/value counts where feasible, DLQ growth, consumer lag, schema/version distribution, processing failures.
7. Define rollback that preserves readability of messages already emitted by the new producer.
8. Define gates: deterministic schema check, representative consumer tests, cross-version fixtures, build/tests, diff review, and independent verifier approval.
9. Limit retries to 2 for transient tooling/test infrastructure failures. Deterministic incompatibilities are not retryable.
10. Stop at approval points rather than executing dangerous migration/cutover actions.

## Output
A bounded plan containing change classification, rollout order, verification commands, rollback, compatibility window, replay assessment, approval points, and unresolved risks.

## Verification
The plan is valid only if old consumer/new producer and new consumer/old producer combinations required by the rollout have explicit evidence or tests.

## Failure handling
If compatibility cannot be proven, recommend versioning the message/topic/envelope rather than weakening checks.
