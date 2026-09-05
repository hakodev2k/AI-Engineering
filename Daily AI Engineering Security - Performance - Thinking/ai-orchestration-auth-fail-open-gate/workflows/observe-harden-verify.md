# Workflow: Observe -> Harden -> Verify

## Trigger
Pre-release review, new endpoint, auth/proxy change, or relevant vulnerability/incident.

## Goal
Close fail-open or bypassable authentication paths without weakening security boundaries.

## Inputs
Deployed topology, route table, auth middleware configuration, capability inventory.

## Baseline
Record number of reachable surfaces, critical surfaces, anonymous/optional auth paths, upstream-only paths, prefix exemptions, and negative-test failures.

## Context
Use observable route/network facts. Do not rely on hidden model reasoning.

## Stages
1. **Observe:** inventory effective surfaces and routes.
2. **Measure baseline:** run gate and safe anonymous probes.
3. **Diagnose:** map each finding to missing middleware, fail-open behavior, route exemption, or proxy bypass.
4. **Form hypothesis:** state one concrete remediation and expected metric change.
5. **Implement:** make the smallest secure change.
6. **Measure again:** rerun gate and negative tests.
7. **Improved?** If no, re-evaluate once; maximum 2 remediation cycles total.
8. **Verify:** independent Security Verifier reproduces the result.

## Responsible agent
Security/implementation engineer for stages 1-7; independent Security Verifier for stage 8.

## Tools
Route/config inspection, safe HTTP client, `scripts/auth_surface_gate.py`, unit tests.

## Outputs
Baseline, findings, remediation evidence, before/after metrics, reviewer decision.

## Checkpoints
Unknown effective auth state blocks implementation approval. Any anonymously successful critical request blocks completion.

## Metrics
Blocking findings; anonymous critical paths; direct proxy bypasses; negative-test pass rate.

## Retry policy
Maximum 2 remediation cycles. Evidence discovery may be retried once for transient tool failure.

## Stop conditions
Stop after two failed cycles or immediately if the only proposed fix weakens authentication, authorization, or network isolation.

## Failure path
Keep deployment blocked, retain evidence, revert unsafe changes if necessary, escalate to security owner.

## Verification
Gate exit 0, unit tests pass, negative-auth probes deny, independent reviewer PASS.

## Definition of Done
Implemented, measured, and independently verified; no blocking auth finding remains.