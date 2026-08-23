# Lost-update gate workflow

## Trigger
A feature or bug touches shared mutable state, or evidence suggests concurrent writes overwrite each other.

## Entry conditions
Repository available, task scope known, non-production reproduction possible.

## Stages
1. **Preflight** — run `python scripts/concurrency_gate.py preflight --repo .`; owner: Explorer.
2. **Explore** — map writers and persistence semantics using `skills/investigate-concurrency.md`.
3. **Reproduce** — create an overlapping two-writer test. Checkpoint: evidence must distinguish confirmed from hypothesized risk.
4. **Plan** — choose native optimistic concurrency where possible. Schema/API/security changes stop for approval.
5. **Implement** — owner: Implementation Agent; maximum two fix/test iterations.
6. **Verify** — owner: Verification Agent; run `python scripts/concurrency_gate.py verify --repo . --report <report.json>` plus project tests.
7. **Complete** — only after independent verification.

## Retry rules
Transient local tool startup may retry twice. Build/test failures may return to implementation twice total. Concurrency conflicts themselves are expected domain outcomes and are never infrastructure retries.

## Failure paths
Permission/environment failures preserve evidence and stop. Inconclusive reproduction stops rather than claiming safety. Approval-required changes stop before execution.

## Definition of Done
All writers mapped; lost-update behavior reproduced or ruled out with evidence; correction exists when needed; overlapping-writer test passes; build/tests pass; final report validates; no unapproved dangerous action occurred.