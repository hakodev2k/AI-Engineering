# Hooks

## Pre-task cache risk scan
- **Trigger:** Before planning a change that touches cached reads, mutations, cache keys, TTL, or invalidation.
- **Preconditions:** Repository root exists and Python 3 is available.
- **Action:** Run `python3 scripts/scan-cache-risk.py <repo-root> --json` and preserve output.
- **Expected result:** Scanner completes; medium/high findings are reviewed in scope.
- **Failure behavior:** Retry once only for a transient tool failure. Otherwise preserve stderr and continue manually if possible; block if evidence cannot be obtained safely.
- **Blocking:** High-risk broad flush findings block completion until resolved or appropriately approved; production execution remains forbidden.

## Post-edit targeted verification
- **Trigger:** After implementation edits.
- **Preconditions:** Relevant build/test commands are known.
- **Action:** Run repository formatting/static checks if configured, then relevant tests covering post-mutation cached reads and failure/race behavior.
- **Expected result:** All relevant checks pass.
- **Failure behavior:** Enter workflow fix/retest loop, maximum two attempts.
- **Blocking:** Yes.

## Final assessment validation
- **Trigger:** Before declaring task complete.
- **Preconditions:** Assessment JSON exists.
- **Action:** Run `python3 scripts/validate-assessment.py <assessment.json>`.
- **Expected result:** Exit code 0 and verifier result `pass`.
- **Failure behavior:** Correct contract errors within remaining retry budget; never edit evidence merely to force a pass.
- **Blocking:** Yes.

## Approval boundary hook
- **Trigger:** Any planned operation matches `approval_required_for` in `config/cache-gate.yaml`.
- **Preconditions:** Operation and rationale are identified.
- **Action:** Stop before execution and request explicit human approval.
- **Expected result:** Approval is recorded before the dangerous action proceeds outside this automated gate.
- **Failure behavior:** Set status `needs-approval`; do not escalate privileges or bypass the boundary.
- **Blocking:** Yes.
