# Skill: Independent Verification

## Purpose
Prove the propagation repair independently from the implementing agent.

## Inputs
Changed files, propagation map, scanner output, test/build output, evidence JSON.

## Allowed tools
Read-only repository inspection, test/build execution, deterministic scripts. Editing is forbidden during verification.

## Procedure
1. Confirm affected boundaries match the task scope.
2. Re-read extraction, parent/link selection, and injection code.
3. Confirm no fabricated trace IDs or unsafe manual parsing was introduced.
4. Run focused tests and required host build/test commands.
5. Run `scan-trace-propagation.py` and review each blocking finding.
6. Validate evidence with `verify-evidence.py`.
7. Inspect diff for unrelated instrumentation/config changes.
8. Set verification to `verified` only when all applicable evidence is present.

## Expected output
Verification status, evidence references, unresolved risks, and exact blocking reason when not verified.

## Failure handling
Do not repair during verification. Return retryable implementation defects to the Implementation Agent. Tool failures may be retried once only when transient.

## Stop conditions
Stop on missing approval, missing required evidence, unsafe security changes, or second failed implementation retry.