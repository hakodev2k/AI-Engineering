# Configuration Drift Gate Workflow

```text
Trigger
  ↓
Collect masked baseline/current snapshots
  ↓
Deterministic drift gate
  ├─ blocked → preserve evidence → stop/escalate
  ├─ approval_required → investigate → human approval → external change → fresh snapshot
  └─ passed → independent verification
  ↓
Verified completion
```

## Trigger
Before deployment or release, during production incident investigation, after infrastructure/configuration changes, or when environments behave inconsistently.

## Entry conditions
Environment and application scope are known; approved baseline exists or is being created through the baseline skill; secrets can remain masked.

## Inputs
- Baseline snapshot
- Current masked snapshot
- Environment name
- `config/policy.yaml`
- Repository/deployment/change evidence

## Stages
1. **Context — Config Inventory Agent:** identify configuration sources and precedence; collect masked snapshot and provenance.
2. **Gate — deterministic script:** run `python scripts/config_drift_gate.py --baseline <baseline> --current <current> --policy config/policy.yaml --environment <env> --output drift-result.json`.
3. **Checkpoint:** exit `2` blocks; exit `4` enters investigation/approval; exit `0` continues to independent verification.
4. **Investigation:** use `skills/config-drift-investigation.md` for each protected, blocked, or approval-required difference.
5. **Approval:** intentional production or protected configuration change requires a completed `templates/config-change-approval.md` reviewed by a human.
6. **Execution boundary:** this package never applies production configuration. An external authorized operator or deployment mechanism performs the exact approved change.
7. **Fresh evidence:** after execution, recapture the masked current snapshot rather than reusing the pre-change snapshot.
8. **Verification — Drift Verifier:** rerun the gate and verify intended state against evidence.
9. **Complete:** return only when no blocking drift remains and required approvals are valid.

## Produced artifacts
Baseline/current snapshots, `drift-result.json`, investigation notes, approval reference, post-change snapshot, verifier result.

## Checkpoints
- Snapshot scope/provenance valid.
- No secret plaintext captured.
- Gate executed successfully.
- Approval covers exact keys/environment.
- Fresh post-change snapshot obtained.
- Independent verification completed.

## Retry rules
- Transient gate/tool failure: retry once with unchanged inputs.
- Transient masked-export failure: retry once.
- Investigation may revise intended-state hypothesis at most twice; preserve previous evidence.
- Permission, validation, security, and unknown-source failures are not retryable by increasing privileges.

## Stop conditions
Unknown environment, incomplete configuration inventory, missing/invalid baseline provenance, exposed secret, blocked security weakening, protected production drift, absent required approval, or verification mismatch.

## Approval points
Production configuration mutations, protected-key changes, baseline replacement after an intentional production change, security-control changes, endpoint/data-plane changes, and other policy-defined approval keys.

## Failure paths
- `blocked`: preserve result and stop.
- `approval_required` without evidence: investigate; do not approve automatically.
- Approval references stale keys/snapshot: invalidate approval and restart Gate.
- Post-change gate still differs unexpectedly: stop as `inconclusive`/`blocked`; do not auto-reconcile production.

## Definition of Done
The correct environment and configuration sources were identified; snapshots contain no secret plaintext; gate result is reproducible; intended changes have explicit approval; any production mutation was performed outside this package by an authorized mechanism; a fresh post-change snapshot was collected; independent verification passed; remaining risk is documented; no blocking drift remains.
