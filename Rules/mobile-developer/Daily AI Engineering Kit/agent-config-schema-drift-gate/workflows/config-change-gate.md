# Config Change Gate Workflow

## Trigger
A task changes JSON/YAML configuration, agent/tool policy, or code that changes a configuration contract.

## Entry conditions
Repository is available; policy exists; baseline exists for established config or initialization is explicitly requested.

## Inputs
Task/acceptance criteria, repository root, changed files, policy, existing baseline.

## Flow
`Trigger -> Explore -> Gate -> Plan -> Approval if breaking -> Implement -> Gate -> Consumer tests -> Independent verify -> Complete`

## Stages
1. **Explore — Config Explorer:** identify files, consumers, loaders, overrides, tests. Artifact: evidence handoff.
2. **Pre-change gate — Explorer:** run `python scripts/config_drift_gate.py --root <repo> --policy <kit>/config/policy.json`. Checkpoint: existing unexplained drift blocks work.
3. **Plan — Config Change Planner:** classify compatibility and define tests/rollback.
4. **Approval checkpoint:** removed keys, type changes, secret/production changes, or breaking consumer contracts stop until explicit human approval.
5. **Implement — host implementation agent:** make only planned repository changes. It cannot approve its own breaking change.
6. **Post-change gate:** re-run gate. If intentional approved contract drift remains, update baseline with `--write-baseline`, inspect that diff, then re-run gate.
7. **Consumer verification:** run planned build/tests.
8. **Independent verification — Config Verifier:** inspect diff, gate evidence, approval, and tests.

## Retry rules
Transient command/tool failure: maximum 2 retries, preserving stdout/stderr from each attempt. Build/test failure caused by implementation: maximum 2 fix-test cycles. Parse, permission, missing-baseline, or approval failures are not retryable without changed evidence.

## Failure paths
Environment/tool failure -> capture evidence -> retry twice -> stop inconclusive. Validation failure -> return to planner/implementation within retry budget. Permission failure -> stop; do not elevate. Missing approval -> stop blocked. Business-rule incompatibility -> escalate with affected consumers and alternatives.

## Stop conditions
Retry budget exhausted, required context unavailable, unauthorized breaking drift, required tests cannot run, or verifier returns blocked/inconclusive.

## Produced artifacts
`.ai-config-drift-report.json`, explorer/planner/verifier handoffs in the host agent context, baseline snapshots when explicitly initialized/approved, test/build output.

## Definition of Done
All in-scope config parses; gate passes; no unexplained removed/type-changed keys remain; required approval exists; affected consumer tests/build pass; final diff is scoped; independent verifier returns `verified`; remaining non-blocking risks are recorded.
