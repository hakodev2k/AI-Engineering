# Finalization Test Cases

## Case 1 — All verified
All required rows are `verified` with evidence. Expected: exit 0, `can_finalize=true`.

## Case 2 — Open criterion
One required row remains `open`. Expected: exit 3; terminal success blocked.

## Case 3 — Verified without evidence
Required row marked `verified` but evidence missing. Expected: exit 3.

## Case 4 — Correction invalidation
A correction changes a fact used by prior evidence. Expected: dependent rows return to non-verified state before gate; stale evidence cannot finalize.

## Case 5 — Proxy deliverable
Tests/report exist but requested product artifact does not. Expected: workflow blocks finalization even if supporting rows pass.

## Case 6 — Deleted criterion attempt
A previously issued required criterion disappears without a valid supersede event. Expected: reconciliation fails and completion is blocked.

## Case 7 — Independent verification
High-risk row is self-marked verified by implementer only. Expected: verifier requirement remains unmet and completion is blocked.

## Pass criteria
No false-success case passes; valid fully evidenced task passes; unresolved criterion preservation rate is 100%.