# Delivery Safety Review

## Scope
- Producer/service:
- Consumer/service:
- Event/message:
- Repository commit:

## Facts
- Business transaction boundary:
- Outbox persistence location:
- Dispatcher location:
- Consumer entry point:
- Inbox/dedupe persistence:
- External side effects:

## Evidence
| Check | Evidence | Status |
|---|---|---|
| Transactional enqueue |  | pending |
| Stable event identity |  | pending |
| Bounded dispatcher retry |  | pending |
| Crash recovery |  | pending |
| Atomic inbox dedupe |  | pending |
| Acknowledge after commit |  | pending |
| Duplicate delivery produces one effect |  | pending |
| External side effects idempotent/reconciled |  | pending |

## Hypotheses
Record unproven explanations separately from facts.

## Decisions
Record chosen implementation decisions and why alternatives were rejected.

## Approval-required actions
List production replay, schema/data mutation, destructive repair, breaking contract, infrastructure/config/security changes, or `none`.

## Verification
- Deterministic gate result:
- Build result:
- Unit/integration result:
- Concurrency/duplicate test result:
- Independent verifier result:

## Remaining risks
Document unresolved risks with owner and evidence needed.

## Final status
`executed` or `verified` or `blocked` or `needs-approval`.
