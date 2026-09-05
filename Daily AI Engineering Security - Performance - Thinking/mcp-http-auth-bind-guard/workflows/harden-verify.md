# Workflow: Harden and Verify

## Trigger
A validated finding from `research-diagnose.md`.

## Goal
Close the attack path without weakening required security boundaries.

## Inputs
Baseline, finding, remediation plan, deployment model.

## Baseline
Use the pre-change checker output and negative-auth behavior.

## Stages
1. Implement smallest safe fix: loopback/trusted bind, mandatory auth, least privilege, approval gate, or bypass removal.
2. Run checker.
3. Run regression tests.
4. Run safe negative-auth probes.
5. Compare before/after findings.
6. Security Reviewer independently validates.

## Responsible agent
Implementation Agent for steps 1-5; Security Reviewer for step 6.

## Tools
Repository editor, tests, checker, safe transport probes.

## Outputs
Remediation diff, test evidence, before/after metrics, reviewer decision.

## Checkpoints
Any new external exposure, auth bypass, or secret leak blocks completion.

## Metrics
Blocking findings 0; dangerous unauthenticated capabilities 0; negative-auth bypasses 0.

## Retry policy
Maximum 2 remediation cycles.

## Stop conditions
Stop after 2 failed cycles or immediately if remediation requires disabling security controls.

## Failure path
Revert unsafe change if needed, keep deployment blocked, escalate.

## Verification
Independent reviewer reproduces checker and at least one negative-auth test per sensitive endpoint.

## Definition of Done
Implemented, measured, and independently verified with no blocking issue.