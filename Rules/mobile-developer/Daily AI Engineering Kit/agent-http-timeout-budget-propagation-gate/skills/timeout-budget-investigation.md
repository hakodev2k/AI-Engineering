# Timeout Budget Investigation Skill

## Purpose
Detect timeout-budget propagation defects across synchronous and asynchronous request paths before they produce hung work, retry storms, premature child timeouts, or SLA overruns.

## When to use
Use when editing API endpoints, HttpClient calls, SDK integrations, database calls, message handlers, background jobs, retry policies, polling loops, or timeout configuration.

## Inputs
- Repository root.
- Target entrypoint or changed files.
- Parent request/job deadline or expected SLA.
- Existing timeout, retry, and cancellation policies.
- Relevant tests and production evidence when available.

## Preconditions
- Repository can be inspected read-only before edits.
- Parent budget is known or explicitly marked unknown.
- No production configuration change is performed without approval.

## Allowed tools
Repository search/read, static scanner, test/build commands, logs/trace inspection, diff inspection, and non-destructive local execution.

## Constraints
- Treat scanner output as evidence candidates, not confirmed defects.
- Never increase a timeout merely to make a failing test pass without proving the budget remains valid.
- Preserve the caller's cancellation/deadline signal where supported.

## Procedure
1. Identify the entrypoint and the external deadline: HTTP request timeout, queue visibility/deadline, job SLA, or explicit operation budget.
2. Trace the call chain to network, database, filesystem, messaging, and long-running operations.
3. Record every explicit timeout and retry layer along the path.
4. Run `python3 scripts/scan-timeout-risk.py <repo-root> --json` and map findings to the traced call chain.
5. Calculate remaining budget at each child boundary. Include retry delay, connection establishment, serialization, cleanup, and a minimum reserve.
6. Verify each child timeout is less than or equal to the remaining parent budget and leaves reserve for cleanup/response handling.
7. Verify retry loops share the parent deadline instead of resetting a fresh full timeout per attempt.
8. Check cancellation propagation independently from timeout configuration. A timeout without cancellation can still leave abandoned work.
9. Identify nested retries across application code, SDKs, HTTP handlers, proxies, database drivers, or service meshes.
10. Form findings only when supported by file/config/test/log evidence.
11. Implement the smallest safe change when authorized. Prefer derived child budgets, bounded retries, and explicit cancellation over larger constants.
12. Add or update tests for deadline exhaustion, cancellation, retry cutoff, and success inside the budget.
13. Inspect the final diff for unrelated timeout/config changes.
14. Produce an assessment matching `schemas/timeout-assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
A validated assessment containing entrypoint, parent budget, concrete findings, evidence, recommended actions, verification status, approvals, and unresolved risks.

## Verification
A result may be `pass` only when budget propagation and retry deadlines were checked, relevant tests passed, and no unresolved risk remains.

## Failure handling
- Unknown parent SLA: stop with `insufficient-evidence` rather than inventing a budget.
- Tool failure: retry at most twice, preserve stderr/output, then escalate.
- Test failure: allow at most two fix-retest cycles; preserve each failing command and result.
- Permission failure: stop; do not increase permissions automatically.

## Stop conditions
Stop on approval-required changes, missing critical deadline information, two unsuccessful fix-retest cycles, or evidence that the requested change would violate the parent SLA.
