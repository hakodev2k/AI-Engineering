# License Compliance Gate Workflow

```text
Trigger
  ↓
Dependency/SBOM context
  ↓
Inventory
  ↓
Deterministic license gate
  ├─ blocked → stop / replace / escalate
  ├─ approval_required → exception review → human approval → re-gate
  └─ passed → independent verification
  ↓
Complete
```

## Trigger
An AI agent adds, upgrades, replaces, or prepares to release dependencies.

## Entry conditions
Candidate dependency state is identifiable; SBOM generation is available; distribution/deployment context is known enough to review policy.

## Inputs
Repository, candidate dependency graph, CycloneDX JSON SBOM, `config/license-policy.yaml`, and any existing exception approvals.

## Stages
1. **Context — Dependency Inventory Agent:** locate manifests/lockfiles, identify changed dependencies and target distribution model.
2. **Inventory — Dependency Inventory Agent:** generate/obtain the exact CycloneDX JSON; confirm package versions and stable identities.
3. **Gate — deterministic script:** run `python scripts/license_gate.py --sbom <sbom.json> --policy config/license-policy.yaml --output license-gate-result.json`.
4. **Checkpoint:** exit `2` = blocked; exit `4` = approval required; exit `0` = policy pass; exit `3` or other unexpected failure = tool/config failure and blocks completion.
5. **Blocked path:** preserve evidence; do not merge/release the dependency; propose a policy-compliant alternative or escalate.
6. **Approval path:** execute `skills/license-exception-review.md`, obtain explicit human approval, add only a narrow package exception, regenerate/reconfirm SBOM, and re-run the gate.
7. **Verification — License Verifier:** reproduce gate result and validate package/version/license evidence and exception scope.
8. **Complete:** record verification status and residual uncertainty.

## Produced artifacts
SBOM JSON, `license-gate-result.json`, exception request when needed, approval reference, verifier result.

## Checkpoints
- SBOM must match the candidate dependency state.
- Missing required metadata blocks or routes to approval according to policy.
- Any dependency or policy edit invalidates the prior gate result and returns to Stage 3.
- Any package/version change invalidates prior package-specific approval.

## Retry rules
- SBOM generation transient failure: retry once with unchanged repository state.
- Gate execution/config load transient failure: retry once with unchanged inputs.
- Metadata disagreement is not retryable; escalate with both evidence sources.
- Permission failure is not retryable through privilege expansion.

## Approval points
Human approval is mandatory for configured approval-required licenses and package exceptions. Broad allowlist changes, release of blocked licenses, or changes to organizational compliance policy require explicit policy-owner approval outside this workflow.

## Failure paths
Stale SBOM → regenerate. Missing/ambiguous license → follow policy; never guess. Blocked license → stop. Approval missing or mismatched → stop. Verification mismatch → stop and escalate.

## Definition of Done
The exact candidate dependency graph was inventoried; deterministic gate completed; no blocked package remains; every approval-required item has exact human approval or a valid narrow policy exception; independent verification reproduced the result; remaining uncertainty is documented.
