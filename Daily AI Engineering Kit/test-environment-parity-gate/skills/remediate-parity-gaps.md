# Skill: Remediate Test Environment Parity Gaps

## Purpose
Resolve or compensate for environment mismatches without weakening production behavior or manufacturing false confidence.

## Inputs
Parity evaluation, test results, environment contract, snapshot, repository configuration and relevant test harness.

## Process
1. Sort gaps by severity and behavior impact.
2. For each gap classify remediation as: align-test-environment, add-provider-specific-test, add-contract-test, add-staging-verification, accept-with-reviewed-risk, or block.
3. Never change the target contract merely to make the score pass unless authoritative target evidence changed.
4. Prefer making test infrastructure more production-like when practical.
5. If emulation differs semantically, add a real-provider verification stage instead of claiming equivalence.
6. Re-run only affected tests first, then the normal required suite.
7. Re-capture the environment after infrastructure/harness changes.
8. Re-run parity evaluation and bind any reviewer decision to the new fingerprints.

## Verification
A gap is resolved only when deterministic evaluation no longer reports it or an independent reviewer explicitly accepts a non-critical residual risk with evidence.

## Failure and retry
Transient environment startup/tool failures may be retried once. Semantic mismatch, permission failure, invalid configuration or missing provider capability are not automatically retried.

## Stop conditions
Critical unresolved parity gap, stale snapshot, failed required tests, or dangerous environment mutation without human approval.
