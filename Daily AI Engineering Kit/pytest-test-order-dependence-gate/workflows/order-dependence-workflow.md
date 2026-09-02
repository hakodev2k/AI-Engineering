# Workflow: Pytest Order Dependence Investigation and Repair

## Trigger

A pytest test passes alone or intermittently but fails under suite/shard/reordered execution, or a change is suspected of leaking test state.

## Entry conditions

Tests can run in a disposable/non-production environment and the repository is readable.

## Inputs

Failure output, victim node ID if known, repository root, pytest scope, gate config, optional suspect predecessors.

## Stages

1. **Context — Repository Explorer**: inspect pytest config, fixtures, victim, and likely shared-state owners.
2. **Baseline — Investigator**: run victim alone and normal relevant suite.
3. **Permutation search — Investigator**: run `scripts/order_gate.py` using bounded deterministic permutations.
4. **Reproducer minimization — Investigator**: narrow a failing order to the smallest useful predecessor sequence.
5. **Plan — Implementation Agent**: select the state owner and smallest cleanup/isolation boundary.
6. **Execute — Implementation Agent**: implement repair and focused regression coverage.
7. **Fast verification — Implementation Agent**: victim alone + original reproducer.
8. **Independent verification — Verification Agent**: baseline suite + permutation gate + diff review.
9. **Complete — workflow owner**: record verified status and residual risk.

## Produced artifacts

- `.ai-evidence/order-report.json` or configured equivalent.
- Exact failing order/reproducer.
- Repair diff.
- Verification evidence.

## Checkpoints and approval

Human approval is required before destructive database operations, schema changes, dependency upgrades outside normal patch-level project policy, production access/configuration, CI infrastructure changes, arbitrary file deletion, or security-control weakening.

## Retry rules

- Collection/environment validation: maximum 1 retry after deterministic correction.
- Timeout: maximum 1 retry after confirming termination and side-effect safety.
- Search expansion: maximum 1 scope expansion within configured `max_tests` and permutation bounds.
- Repair/test cycle: maximum 2 cycles.
- Verification failure caused by the same unresolved hypothesis: stop after second cycle and escalate with preserved evidence.

## Failure paths

Baseline failure without isolated pass is classified separately. Permission or production-only requirements stop automation. Ambiguous external side effects block retries until reconciled.

## Definition of Done

- Victim and relevant context identified.
- Reproduction status explicitly recorded.
- If repaired, original evidence-producing sequence passes.
- Baseline relevant suite passes.
- Deterministic permutations pass.
- Diff has no order-forcing or retry workaround.
- Required approvals exist for any high-risk boundary crossed.
- Remaining uncertainty is documented and no blocking failure remains.