# Workflow: Registration and Diagnosis

## Trigger
Tool/plugin registration, update, or approval-policy change.

## Goal
Prevent approval/sandbox contract mismatches before a tool becomes callable.

## Inputs
Effective manifest and central policy.

## Baseline
Capture tool count, high-risk count, approval labels, sandbox coverage, and current registration outcome.

## Stages
1. **Observe:** enumerate the effective registry.
2. **Measure:** classify consequences and approval/sandbox coverage.
3. **Diagnose:** run the conformance gate and identify the authoritative source of each conflict.
4. **Hypothesize:** state the minimal precedence/classification correction.
5. **Implement:** change the authoritative registry/policy mapping, not the test.
6. **Measure again:** re-run the gate and attack fixtures.
7. **Verify:** independent reviewer checks effective runtime state.

## Responsible agent
Implementation agent performs diagnosis/fix; Security Reviewer verifies.

## Tools
`tool_approval_gate.py`, manifest exporter, unit tests.

## Outputs
Before/after registry metrics, violation report, reviewer decision.

## Checkpoints
Before enabling a high-risk tool and before release.

## Metrics
High-risk approval coverage, sandbox coverage, policy drift, block count.

## Retry policy
Maximum 2 correction attempts.

## Stop conditions
Unresolved high-risk classification, missing sandbox, exhausted retries, or any approval bypass.

## Failure path
Keep the affected tool disabled and escalate; never weaken the policy.

## Verification
Security Reviewer must independently inspect the effective registry.

## Definition of Done
No blocking conflict, fixtures pass, metrics captured, and reviewer passes.
