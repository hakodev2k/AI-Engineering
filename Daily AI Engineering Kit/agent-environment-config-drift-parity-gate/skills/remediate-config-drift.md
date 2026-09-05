# Skill: Remediate Configuration Drift

## Purpose
Fix confirmed parity failures with the smallest safe change.

## Inputs
Parity report, key inventory, repository constraints, acceptance criteria.

## Process
1. For each finding, identify the source of truth.
2. Prefer updating templates/declarations rather than embedding environment-specific logic in application code.
3. Preserve backward compatibility for renamed keys when required.
4. Never copy a real secret into repository files.
5. Add validation tests for new required keys.
6. Keep intentionally environment-specific values outside `must_match_values` policy.
7. Require approval before production configuration, secret, infrastructure, security, schema, or deployment changes.
8. Re-normalize manifests after edits.
9. Re-run deterministic parity gate and host tests.
10. Inspect the diff for unrelated configuration changes.
11. Allow at most two remediation cycles before escalation.

## Expected output
Minimal diff, updated manifests/templates, tests, parity report, documented exceptions.

## Verification
Gate passes or every remaining exception has explicit policy and approval evidence.

## Failure handling
Validation failures are fixed directly, not blindly retried. Tool failures retry at most twice if transient.

## Stop conditions
Approval-required action, ambiguous source of truth, exceeded retry limit, or security weakening.
