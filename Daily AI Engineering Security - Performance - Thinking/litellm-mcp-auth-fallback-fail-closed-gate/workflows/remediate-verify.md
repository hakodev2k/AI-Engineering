# Workflow: Remediate and Verify

## Trigger
Validated auth-boundary finding.

## Goal
Block the bypass while preserving legitimate authenticated and explicitly configured OAuth2 flows.

## Inputs
Diagnosis, baseline tests, target build/config.

## Baseline
Pre-change checker and negative-test results.

## Stages
1. Upgrade to 1.84.0+ or disable/block affected MCP routes.
2. Narrow public-route matching and OAuth2 target configuration if custom code is involved.
3. Enforce least-privilege MCP server/tool authorization.
4. Run checker and unit tests.
5. Replay invalid/malformed/no-token cases.
6. Replay legitimate key and legitimate OAuth2 cases.
7. Compare before/after matrix.
8. Independent Security Verifier reviews.

## Responsible agent
Implementer for 1-7; Security Verifier for 8.

## Outputs
Change evidence, test matrix, metrics, review decision.

## Checkpoints
Legitimate authentication must still work; bypass tests must fail closed.

## Metrics
Bypass acceptance 0; legitimate-flow success maintained; sensitive anonymous tools 0.

## Retry policy
Maximum 2 remediation cycles.

## Stop conditions
After 2 failed cycles or immediately if proposed fix weakens security.

## Failure path
Revert unsafe changes, block route/release, escalate.

## Verification
Independent reproduction of gate and negative tests.

## Definition of Done
Implemented, measured, independently verified, with no blocking finding.