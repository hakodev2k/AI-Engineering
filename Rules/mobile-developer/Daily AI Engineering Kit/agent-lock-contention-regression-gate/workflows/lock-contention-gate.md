# Lock Contention Regression Gate Workflow

## Trigger
Run when a change adds/modifies synchronization, shared mutable state, async coordination, transaction-held work, worker serialization, or a performance incident suggests lock contention.

## Entry conditions
- Repository and change scope are known.
- Intended correctness invariants are stated or inferable from nearby code/tests.
- Local/non-destructive verification is possible.

## Inputs
Changed files, task requirements, baseline revision, tests, telemetry/profiler/benchmark evidence when available.

## Stages
1. **Context** — Contention Investigator traces entry points, shared state, lock order, async/transaction boundaries, and relevant tests.
2. **Static risk scan** — Run `python scripts/scan-lock-risk.py <paths> --json`; preserve output.
3. **Baseline** — Collect a deterministic concurrency test, benchmark, wait-time trace, throughput/latency signal, or mark blocked if no credible equivalent exists.
4. **Plan** — Rank findings. Prefer critical-section reduction, moving I/O out of synchronization, consistent lock ordering, async-compatible coordination, or state partitioning.
5. **Approval checkpoint** — Stop before production config, schema/destructive DB changes, weakening concurrency safety, or unsafe lock-free redesign.
6. **Execute** — Implement the smallest approved correctness-preserving change.
7. **Test** — Build, run unit/integration/concurrency tests, rerun scanner, and capture candidate evidence under comparable conditions.
8. **Review** — Inspect diff for races, deadlocks, starvation, ordering changes, public contract changes, and transaction/retry effects.
9. **Assessment** — Produce JSON matching `schemas/assessment.schema.json`; validate with `python scripts/validate-assessment.py <assessment>`.
10. **Independent verification** — Contention Verifier reruns checks and decides pass/fail/blocked/needs-approval.

## Produced artifacts
Scanner output, before/after evidence, test output, validated assessment, verifier decision.

## Checkpoints
- No implementation before shared-state ownership and correctness invariant are understood.
- No `pass` without before/after evidence and independent verification.
- Any high/critical unresolved finding blocks `pass`.

## Retry rules
Maximum two fix–retest attempts. Retry only for implementation/test/validation failures with a specific actionable cause. Preserve previous scanner, test, and evidence output. After two failed attempts, stop and escalate with status `blocked` or `fail`.

## Failure paths
- Transient tool failure: retry once, then record evidence and stop if still unavailable.
- Environment cannot reproduce contention: use an equivalent deterministic signal if credible; otherwise `blocked`.
- Build/test regression: return to Execute within the two-attempt budget.
- Permission/production-only evidence required: stop; never escalate privileges silently.
- Approval-required remediation: status `needs-approval`.

## Definition of Done
Assessment validates; build/relevant tests pass; contention signal is non-regressed or improved; correctness invariants remain intact; diff review passes; independent verifier approves; no unresolved high/critical finding or blocking failure remains.
