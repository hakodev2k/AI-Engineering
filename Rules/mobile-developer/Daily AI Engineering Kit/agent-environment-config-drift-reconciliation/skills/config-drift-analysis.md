# Config Drift Analysis Skill

## Purpose
Detect, classify, and explain configuration drift between a declared baseline environment and one or more target environments without exposing secret values or changing any environment automatically.

## When to use
Use before releases, after incidents, after infrastructure/configuration changes, when behavior differs by environment, or when scheduled drift checks report inconsistencies.

## Inputs
- `examples/inventory.json`-compatible inventory describing environment config sources.
- `config/drift-policy.json`.
- Repository context for components affected by drift.
- Optional deployment/change records used as evidence.

## Preconditions
- Config snapshots are read-only local files or safely exported snapshots.
- At least two environments are present.
- The configured baseline environment exists.
- Secret values must not be copied into prompts, reports, commits, or logs.

## Allowed tools
- Read-only repository/file inspection.
- `scripts/scan-config-drift.py`.
- Build/test commands needed to verify a proposed non-production change.
- Read-only deployment, audit, or configuration history queries when available.

## Constraints
- Never infer that a difference is wrong merely because it differs from production.
- Never reveal raw values for secret-like keys.
- Never mutate production configuration as part of analysis.
- Treat intentional environment-specific values as expected only when supported by policy or evidence.

## Procedure
1. Validate the inventory and policy files.
2. Run the deterministic scanner and preserve the generated report.
3. Separate findings into missing, extra, and different keys.
4. Prioritize high-risk and approval-required findings.
5. For each material finding, trace the key to repository code, deployment manifests, or documented ownership.
6. Record fact, evidence, impact, and confidence separately.
7. Determine whether the drift is intentional, stale, unsafe, or unresolved.
8. Propose the smallest reconciliation action. Prefer changing lower environments or source-of-truth configuration over patching production directly.
9. Identify tests or runtime checks that prove the chosen state is correct.
10. Stop before any approval-required action.
11. After approved execution by an authorized operator, rerun the scanner and required tests.
12. Report residual drift and unresolved risk.

## Expected output
- Scanner report conforming to `schemas/drift-report.schema.json`.
- A reconciliation decision for every material finding: `accept`, `reconcile`, or `investigate`.
- Evidence references for each decision.
- Required approvals and verification commands.

## Verification
- Scanner completes successfully.
- No raw secret values appear in output.
- Every high-risk finding has evidence and an explicit disposition.
- Post-change rescan shows the intended result.
- Relevant tests/build/runtime probes pass.

## Failure handling
- Invalid inventory/policy: stop and fix inputs; do not guess.
- Missing config snapshot: mark blocked and request/export the missing read-only source.
- Tool/transient failure: retry at most twice, preserving stderr and prior report.
- Permission failure: stop; do not expand permissions automatically.
- Repeated verification failure: stop and escalate with evidence.

## Stop conditions
Stop when the result is verified, when human approval is required, when required evidence is unavailable, or after two failed reconciliation/verification attempts.
