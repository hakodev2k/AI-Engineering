# Skill: Repair Verification

## Purpose
Prove that a candidate CI repair addresses the diagnosed failure without introducing unrelated regression.

## When to use
After a repair or permitted controlled rerun produces new evidence.

## Inputs
Failure manifest, original normalized log, code/config diff, commands and results from verification.

## Preconditions
The manifest is valid and the selected action is explicit.

## Process
1. Restate the original failure mechanism from evidence.
2. Inspect the diff and reject unrelated or unexplained edits.
3. Confirm the repair changes the causal surface, not only the symptom.
4. Run the smallest deterministic reproduction/check first.
5. Run affected unit/integration/static checks.
6. Run the repository's required broader build/test gate when feasible.
7. Compare new failures with the original signature.
8. Check that assertions, security controls, warnings-as-errors, or quality gates were not weakened to obtain green status.
9. Record commands, exit codes, and evidence in the manifest.
10. Mark `implemented=true` only when a candidate repair exists; mark `verified=true` only when all required checks pass.

## Tools
Git diff, repository read/search, local build/test/lint commands, manifest validator.

## Constraints
Do not modify production code or tests while acting as independent verifier. Do not treat a green rerun alone as proof for a suspected flaky failure unless the configured flake evidence threshold is met.

## Expected output
Verification verdict: `verified`, `rejected`, or `inconclusive`, with evidence and remaining risks.

## Verification
The verdict must trace to the original failure signature and required verification checks.

## Failure handling
A transient verification command may be retried twice. A repeated deterministic failure returns `rejected` or `inconclusive`; it is not retried indefinitely.

## Stop conditions
Stop after the repair-attempt budget is exhausted, required approval is missing, or verification cannot be performed with available environment/evidence.
