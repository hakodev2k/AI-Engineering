# Pagination Remediation Skill

## Purpose
Repair an API pagination implementation after evidence shows skipped, duplicated, looping, or prematurely terminated retrieval.

## Inputs
Investigation result, affected client code, tests, API pagination contract, and acceptance criteria.

## Preconditions
The failure mode must be evidenced. The change must stay within the integration boundary unless broader modification is explicitly required.

## Procedure
1. Reproduce the failing behavior with a fixture or safe endpoint.
2. Identify the smallest faulty condition: next-link parsing, cursor propagation, offset arithmetic, page-size termination, retry handling, ordering, or deduplication.
3. Add or update a regression test before changing behavior when practical.
4. Implement the smallest compatible correction.
5. Preserve public API contracts and authentication behavior.
6. Run unit/integration tests.
7. Run the pagination gate against representative data.
8. Inspect the diff for unrelated changes.
9. Hand off to an independent verifier.

## Expected output
A minimal code/test change plus a verified pagination result and documented remaining risk.

## Verification
The original failure must reproduce before the fix and cease after the fix. The verifier must observe a legitimate terminal condition and no unexplained duplicates, loops, or lost pages.

## Failure handling
If the API contract is ambiguous, stop implementation and request authoritative contract evidence. If fixing pagination requires a breaking API change or production configuration change, stop for human approval.

## Stop conditions
Stop when tests and gate pass, when the root cause is disproven, after two failed remediation attempts, or when an approval boundary is reached.
