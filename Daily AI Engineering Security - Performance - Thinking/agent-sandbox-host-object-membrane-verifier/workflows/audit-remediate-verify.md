# Workflow — Audit, Remediate, Verify

## Trigger
A sandbox/code-execution integration or relevant dependency changes; a security advisory exposes a new sandbox-escape class; or a boundary audit finds an unsafe value.

## Goal
Eliminate observable live host capabilities from the untrusted code boundary and independently verify the corrected boundary.

## Inputs
Boundary inventory, policy, observations, dependency/runtime versions, security requirements, existing tests.

## Baseline
Record exposed value classes, number of forbidden findings, error-path coverage, sandbox process privileges, secret/network/filesystem reachability, and current regression test status.

## Context
Treat model-generated code as untrusted. Data needed for correct tool use must remain available, but capability-bearing host objects are not required context and must not cross.

## Stages
1. **Observe** — Security investigator inventories crossings and current advisories.
2. **Measure baseline** — Run normalized observations through `scripts/boundary_verifier.py`; record findings.
3. **Diagnose** — Identify the exact object/bridge/error path that carries host authority.
4. **Form hypothesis** — Choose one minimal correction: serialize, project fields, inert error record, disable bridge, or isolate process.
5. **Implement** — Runtime implementer changes only the selected boundary.
6. **Measure again** — Replay identical fixtures plus the known failure path.
7. **Improved?** — If findings remain, allow at most two remediation revisions total; each revision must alter the hypothesis based on new evidence.
8. **Independent verification** — `subagents/independent-boundary-verifier.md` reviews tests, residual risk and isolation.
9. **Complete or block** — Release only when completion criteria pass.

## Responsible agent
Security investigator for stages 1–4; runtime implementer for stage 5; independent verifier for stages 6–9.

## Tools
Repository inspection, advisory lookup, verifier script, unit tests, authorized sandbox fixtures.

## Outputs
Before/after report, remediation record, test output, residual risks, verification status.

## Checkpoints
- inventory complete
- baseline reproducible
- failure path identified
- remediation does not widen permissions
- error path tested
- independent verifier signs off

## Metrics
Forbidden crossings before/after, regression test pass rate, error-path coverage, sandbox-visible secrets/capabilities, isolation level.

## Retry policy
Maximum two implementation/remediation revisions after the baseline. A repeated identical failure without new evidence stops the workflow.

## Stop conditions
Stop immediately on real-secret exposure, unauthorized host command execution, inability to keep probes non-destructive, unknown boundary type after investigation, or failed independent verification.

## Failure path
Preserve evidence, disable or isolate the unsafe code-execution path, escalate to the security/runtime owner, and do not claim verification.

## Verification
`python -m unittest tests/test_boundary_verifier.py` plus environment-specific integration probes. Static package tests demonstrate the guard contract; production verification additionally requires measuring the actual host-to-sandbox adapter.

## Definition of Done
Evidence documented; baseline captured; current approach and limitations identified; improvement implemented; deterministic tests pass; before/after findings compared; process isolation decision recorded; no secrets exposed; independent verifier returns Verified; no blocking issue remains.
