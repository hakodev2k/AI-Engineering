# Runtime Config Drift Hooks

## PreReleaseConfigGate
**Trigger:** before release, deployment approval, or rollout continuation.

**Preconditions:** expected and runtime snapshots exist and contain no raw secrets.

**Action:**
```bash
python scripts/validate-config-snapshot.py --snapshot expected.json --policy config/drift-policy.json
python scripts/validate-config-snapshot.py --snapshot runtime.json --policy config/drift-policy.json
python scripts/compare-config-snapshots.py --expected expected.json --runtime runtime.json --policy config/drift-policy.json --output drift-report.json
python scripts/evaluate-drift-gate.py --report drift-report.json --policy config/drift-policy.json --review review.json --output gate-result.json
```

**Expected result:** final gate is `pass`.

**Failure behavior:** any non-zero exit blocks release/rollout continuation. Do not mutate configuration automatically.

**Blocking:** yes.

## PostConfigChangeVerification
**Trigger:** after an explicitly approved configuration remediation.

**Preconditions:** a fresh runtime snapshot has been collected after the change.

**Action:** rerun the same validation/comparison/gate sequence against the unchanged expected baseline unless the approved change also intentionally changed repository intent.

**Expected result:** no blocking drift remains and gate is `pass`.

**Failure behavior:** preserve the new drift report and stop; do not repeat remediation automatically.

**Blocking:** yes for declaring remediation verified.

## IncidentClosureConfigCheck
**Trigger:** before closing an incident whose evidence included configuration drift.

**Action:** run the final drift gate on current evidence.

**Expected result:** `pass` or an explicitly documented residual risk accepted by the proper human authority outside this package.

**Failure behavior:** incident may be technically mitigated, but config drift must not be labeled verified/resolved.

**Blocking:** yes for `verified configuration resolution`.