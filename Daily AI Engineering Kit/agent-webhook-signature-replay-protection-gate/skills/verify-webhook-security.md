# Skill: Verify Webhook Security

## Purpose
Independently prove that the webhook boundary satisfies authenticity, freshness, and replay requirements.

## Inputs
Changed diff, boundary map, provider contract evidence, scan JSON, host test output, evidence JSON.

## Process
1. Validate evidence with `scripts/validate-evidence.py`.
2. Independently inspect raw-body acquisition and middleware ordering.
3. Reconstruct the provider signing payload from documented semantics and compare it with implementation behavior.
4. Confirm signature checking occurs before side effects.
5. Confirm freshness validation and exact tolerance behavior.
6. Confirm replay state uses atomic first-use semantics and is correctly scoped.
7. Review duplicate-delivery behavior for provider retries.
8. Confirm secrets are absent from logs, errors, test snapshots, and evidence.
9. Review tests for valid, invalid, stale, malformed, sequential duplicate, and concurrent duplicate cases where applicable.
10. Run the relevant host tests/build and deterministic gate independently.
11. Record `verified`, `blocked`, or `unverified`; never infer success from code generation alone.

## Completion criteria
All applicable checks pass, no high-risk unresolved finding remains, and no approval-required action is pending.

## Failure handling
Return concrete failed checks and preserved evidence to the implementation agent. Maximum two implementation retries total.
