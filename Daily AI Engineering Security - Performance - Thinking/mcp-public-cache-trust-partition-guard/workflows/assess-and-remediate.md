# Workflow: Assess and Remediate MCP Cache Trust

## Trigger
Shared-cache rollout, protocol upgrade, cache incident, or third-party MCP onboarding.

## Goal
Measure current cache behavior, identify boundary violations, remediate them, and independently verify isolation.

## Inputs
Cache configuration, authorization/tenancy model, MCP result inventory, test environment.

## Baseline
Record current public/private counts, cache-key fields, instruction-bearing entries, cross-principal fixture result, and checker output.

## Context
Distinguish Observed Evidence, Interpretation, and Proposed Change. Do not infer safety from a cache hit or successful authentication.

## Stages
1. Observe current cache paths and public evidence.
2. Measure baseline admission/key behavior.
3. Diagnose sensitivity/key mismatches.
4. Form a specific root-cause hypothesis.
5. Implement the smallest safe scope/key/trust-boundary fix.
6. Measure again with identical fixtures.
7. If not improved, re-evaluate once; maximum 2 remediation cycles.
8. Independent Security Verifier reproduces isolation tests.

## Responsible agent
Investigator/implementer for stages 1-7; Security Verifier for stage 8.

## Tools
Read-only discovery tools, code/config editor, checker, synthetic integration tests.

## Outputs
Baseline, findings, remediation diff, before/after metrics, reviewer result.

## Checkpoints
Unknown authorization sensitivity blocks public caching. New shared-cache dimensions require security review.

## Metrics
Cross-boundary leak count, blocking findings, partition completeness, poisoned-instruction admission count.

## Retry policy
Maximum 2 remediation attempts. One retry for transient test infrastructure errors.

## Stop conditions
Stop immediately on real sensitive-data leakage. Stop after retry bounds or if remediation requires weaker auth.

## Failure path
Disable/bypass affected shared cache path, preserve evidence, escalate.

## Verification
Checker passes plus two-principal and poisoned-instruction negative tests.

## Definition of Done
Implemented, measured, independently verified, no blocking issue, no secret exposure.