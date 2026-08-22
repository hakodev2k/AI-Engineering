# Hook: Pre-Completion Evidence Gate

## Trigger
Immediately before a task is marked DONE, ready-to-merge, or equivalent.

## Preconditions
A verification report exists for the current candidate source state.

## Action
Resolve current commit/tree identity and run `scripts/verify_evidence.py report.json --expected-source <current-source-state>`.

## Expected result
Exit 0, report status PASS, all required criteria have evidence, integrity status PASS, and all required tests were run against the same source state.

## Failure behavior
Exit 2 indicates invalid report/input and blocks completion. Exit 3 indicates stale/incomplete/failed evidence and blocks completion. A failed gate may return to `workflows/implement-reconstruct-verify.md`, but total revision cycles remain bounded to two.

## Blocking
Yes. Completion is not permitted on stale, missing, or contradictory evidence.

## Safety
The hook is read-only and must not alter the candidate patch or weaken acceptance criteria.