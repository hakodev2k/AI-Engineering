# Skill: Outbox Repair

## Purpose
Implement the smallest safe correction to an evidenced outbox defect.

## Inputs
Investigation map, confirmed defect, acceptance criteria, repository conventions.

## Preconditions
Defect is supported by evidence. Approval exists for any schema/contract change.

## Allowed tools
Code edit, formatter, local build/test, local fixtures, deterministic scanner.

## Constraints
Maximum two implementation retries. Do not broaden scope to unrelated messaging refactors.

## Process
1. State the confirmed defect and failure mode in one sentence.
2. Select the smallest boundary that can correct it.
3. Preserve stable message identity and existing public contracts unless explicitly approved.
4. If atomicity is broken, move outbox persistence into the proven business transaction using repository conventions.
5. If claiming is unsafe, implement bounded ownership using the database/runtime mechanism already supported by the project.
6. Ensure network failure does not mark delivery successful.
7. Ensure failed delivery remains retryable or explicitly terminal according to policy.
8. Add/adjust focused tests before broad integration tests.
9. Add failure-injection coverage for the repaired boundary.
10. Run formatting, build, tests, and `scripts/scan-outbox.py`.
11. Inspect the diff for unrelated changes and approval-boundary violations.
12. Produce evidence for handoff.

## Expected output
Minimal code/test delta plus evidence JSON.

## Verification
Implementation Agent cannot self-certify completion; hand off to Verification Agent.

## Failure handling
After two failed repair attempts, stop and preserve both failure outputs and hypotheses.

## Stop conditions
Stop immediately if the repair requires an unapproved schema, event-contract, production, or destructive change.
