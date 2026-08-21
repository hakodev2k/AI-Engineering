# Async Cancellation Propagation Gate Workflow

## Trigger
A change touches async request handling, background work, retries, polling, database/HTTP I/O, message processing, or code that accepts/creates cancellation tokens.

## Entry conditions
- Repository root and target scope are known.
- Relevant code can be read and tested without production mutation.

## Inputs
Changed files, entry point, acceptance criteria, test commands, repository conventions.

## Context
Call graph, cancellation source, downstream async operations, retry/backoff policies, transaction boundaries, relevant tests, and scanner output.

## Stages
1. **Scope** — workflow owner identifies entry points and changed files.
2. **Investigate** — Cancellation Investigator traces cancellation flow and records facts/findings.
3. **Scan** — run `python scripts/scan-cancellation-risk.py <repo-root> --json`; classify each relevant hit as confirmed or heuristic.
4. **Plan** — define the smallest safe propagation changes and targeted tests.
5. **Approval checkpoint** — stop with `needs-approval` before any action listed in `config/cancellation-gate.yaml`.
6. **Implement** — implementation owner changes only the approved scope.
7. **Targeted test** — exercise cancellation before start, during awaited I/O, or during retry/backoff as applicable.
8. **Fix/retest loop** — for retryable code/test failures, preserve evidence and retry at most 2 cycles.
9. **Verify** — Cancellation Verifier independently re-traces the path, re-runs checks, and inspects diff.
10. **Contract validation** — save assessment JSON and run `python scripts/validate-assessment.py <assessment.json>`.
11. **Complete** — status may be `pass` only when all required verification checks are true.

## Produced artifacts
- Scanner output.
- Investigation findings.
- Targeted test evidence.
- Assessment JSON matching `schemas/assessment.schema.json`.

## Checkpoints
- Scope checkpoint before editing.
- Approval checkpoint before dangerous changes.
- Test checkpoint after implementation.
- Independent verification checkpoint before completion.

## Retry rules
Maximum 2 fix/retest retries. Retry only code/test failures with a plausible local correction. Preserve failing command, output, changed diff, and hypothesis for each retry. Permission, approval, environment, or unclear-semantics failures are not silently retried.

## Failure paths
- Transient tool failure: retry the tool at most 2 times, then `blocked`.
- Build/test failure: enter bounded fix/retest loop; after 2 failed cycles, `fail`.
- Permission/environment failure: `blocked`; report missing capability.
- Approval-required action: `needs-approval`; stop before action.
- Business/semantic ambiguity: `blocked` until expected cancellation behavior is defined.

## Stop conditions
Pass, fail after retry budget exhausted, blocked by evidence/environment, or needs-approval.

## Definition of Done
- Cancellation source and in-scope downstream path were traced.
- Relevant scanner findings were reviewed.
- Confirmed defects were fixed or explicitly blocked.
- Targeted cancellation tests passed.
- Relevant build/test suite passed or remaining non-blocking gaps are documented.
- Final diff contains no unintended changes.
- Independent verifier completed review.
- Assessment validates and all pass verification flags are true.
