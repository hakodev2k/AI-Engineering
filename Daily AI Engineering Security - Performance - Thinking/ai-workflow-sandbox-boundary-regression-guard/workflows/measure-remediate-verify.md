# Workflow: Measure → Remediate → Verify

## Trigger
Security advisory, platform/dependency upgrade, custom-code feature enablement, allowlist change, worker-image change, or sandbox-boundary incident.

## Goal
Prove the deployed custom-code boundary satisfies version, isolation, and forbidden-capability invariants without relying on exploit execution.

## Inputs
Inventory JSON, sandbox policy, release/deployment diff, worker/runtime configuration.

## Baseline
Record component versions, custom-code feature state, worker identity/isolation, module allowlist, network-egress policy, filesystem-write policy, and tenant sharing model.

## Stages
1. **Observe** — collect the current inventory and advisory context.
2. **Measure baseline** — run `scripts/sandbox_boundary_guard.py` before changes.
3. **Diagnose** — map each violation to version, missing control, or forbidden capability.
4. **Form hypothesis** — select one root-cause hypothesis per violation.
5. **Implement improvement** — patch/upgrade, remove capability exposure, or strengthen worker isolation.
6. **Measure again** — rerun the guard and unit tests.
7. **Improved?** If no, revise once. If yes, continue.
8. **Verify** — Sandbox Security Reviewer independently confirms invariants and safe sentinel evidence.

## Responsible agent
Platform/security implementer for stages 1–7; independent Sandbox Security Reviewer for stage 8.

## Tools
Package/version inventory, deployment config inspection, guard script, unit tests, safe non-destructive sentinel checks.

## Outputs
Before/after inventory, guard results, remediation record, independent verification decision.

## Checkpoints
Before any platform change; after remediation; before release/deployment.

## Metrics
Known-vulnerable component count, missing-control count, forbidden-capability count, unreviewed allowlist additions, regression-test pass rate.

## Retry policy
Maximum one remediation revision per detected invariant failure before escalation.

## Stop conditions
All invariants pass and independent verification completes, or a blocking boundary violation remains.

## Failure path
Block release/deployment, disable affected custom-code path when feasible, preserve evidence, and escalate to the platform/security owner. Do not weaken isolation or run destructive exploit payloads as a workaround.

## Verification
Independent review is mandatory for any boundary-affecting remediation.

## Definition of Done
Implemented: required patch/control is present. Measured: before/after guard results exist. Verified: unit tests and independent boundary review pass with no blocking violation and no secrets exposed.
