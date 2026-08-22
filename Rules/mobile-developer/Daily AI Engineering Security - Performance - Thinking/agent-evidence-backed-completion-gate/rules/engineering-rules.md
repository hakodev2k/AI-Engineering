# Engineering Rules

## MUST
- MUST create stable IDs for all material mandatory requirements before final verification.
- MUST distinguish `implemented` from `verified`.
- MUST attach observable evidence to every `verified` requirement.
- MUST record validation commands as actually executed, including exit code when available.
- MUST record skipped, failed, cancelled, unavailable, or partial checks.
- MUST distinguish focused/targeted tests from full/regression/e2e validation.
- MUST invalidate verification evidence when relevant covered paths change after the evidence was collected.
- MUST treat a nonterminal agent loop (`tool_use`, pending tool result continuation, active child work, equivalent state) as incomplete even if the process exits successfully.
- MUST use bounded remediation retries; default maximum is 2.
- MUST preserve blocking reasons after retry exhaustion.
- MUST fail closed on malformed evidence ledgers, duplicate requirement IDs, or inconsistent status/evidence combinations.
- MUST keep the final completion record externally inspectable: requirements, files/artifacts, commands, results, uncertainty, and verification status only.
- MUST ensure an implementation agent is not the sole verifier for high-risk or production-impacting changes.

## MUST NOT
- MUST NOT claim “all tests pass” when only a subset was run.
- MUST NOT mark code as verified merely because it compiles, was edited, or looks correct unless that observation is the explicit acceptance condition.
- MUST NOT accept model prose, self-confidence, or a `claim` evidence item as sufficient proof of verification.
- MUST NOT equate process exit code 0 with semantic task completion.
- MUST NOT silently discard failing or stale evidence when newer unrelated checks pass.
- MUST NOT keep evidence fresh after overlapping files or known dependencies changed.
- MUST NOT use hidden chain-of-thought as evidence.
- MUST NOT retry indefinitely or weaken verification criteria to make a task pass.
- MUST NOT require destructive or irreversible actions merely to obtain verification evidence without explicit approval.

## SHOULD
- SHOULD capture evidence at the moment the tool/test/inspection result is observed rather than reconstructing it at the end.
- SHOULD use deterministic scripts for schema checks, freshness rules, status transitions, and final gating.
- SHOULD keep evidence concise while retaining command, exit status, scope, timestamp, paths, and result semantics.
- SHOULD maintain a requirement-to-evidence matrix that survives context compaction, resume, fork, or agent handoff.
- SHOULD explicitly record uncertainty when verification scope is incomplete.
- SHOULD measure false blocking on known-good fixtures before enforcing the gate in production.
- SHOULD use independent verification for deployment, security, data migration, destructive actions, and repository write protection changes.
- SHOULD emit machine-readable JSON alongside any human-readable completion summary.

## Testable invariants
1. A mandatory `verified` item with zero fresh allowed evidence causes failure.
2. A command evidence item with non-accepted exit code cannot prove `verified`.
3. `process_exit_code=0` plus `agent_loop_terminal=false` cannot yield `complete`.
4. A covered path changed after evidence makes that evidence stale.
5. A ledger with one mandatory `implemented` item cannot yield `complete`.
6. Optional incomplete items do not block when policy allows them.
7. Retry count greater than policy maximum yields stop/escalation, not another implementation loop.
