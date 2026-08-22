# Drift Remediation

## Purpose
Resolve incompatible structured-output changes with the smallest safe change and evidence-based verification.

## Trigger
A schema comparison, sample validation, parser test, or production trace detects output drift.

## Inputs
Baseline schema, candidate schema, drift result, affected consumers, representative samples, and acceptance criteria.

## Procedure
1. Classify each finding as compatible, ambiguous, or breaking.
2. Map every breaking finding to affected consumers.
3. Prefer restoring compatibility in the producer when the change was accidental.
4. If the contract must intentionally break, prepare `templates/change-approval.md` and stop for human approval before changing consumers or public contracts.
5. Implement the smallest approved change.
6. Re-run schema comparison.
7. Validate representative samples against the candidate schema.
8. Run parser, contract, integration, and relevant end-to-end tests.
9. Inspect the diff for unrelated changes.
10. Record unresolved risks and verification evidence.

## Verification
A remediation is verified only when the gate no longer blocks, affected consumer tests pass, and any intentional breaking change has recorded approval.

## Retry policy
At most two remediation attempts. Preserve each gate result and test output. After two failed attempts, stop and escalate with evidence.

## Failure handling
Tool/environment failures may be retried once when clearly transient. Permission or approval failures are not retryable.

## Stop conditions
Stop before destructive migrations, production deployment, contract-breaking consumer changes, or weakened validation without explicit approval.
