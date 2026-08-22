# Feature Flag Lifecycle Hooks

## PreTask
**Trigger:** workflow start.

**Preconditions:** repository root and lifecycle record path are known.

**Action:** validate lifecycle records.

**Command:**
```bash
python scripts/validate-feature-flags.py --records .feature-flags/flags.json --policy config/feature-flag-policy.json
```

**Expected result:** exit 0.

**Failure behavior:** block workflow on validation failure. Operational failure may be retried once only if transient.

**Blocking:** yes.

## PostPlan
**Trigger:** after lifecycle or retirement plan is produced.

**Preconditions:** plan identifies flag key and intended state transition.

**Action:** run repository reference scan and preserve output.

**Command:**
```bash
python scripts/scan-flag-references.py --root . --records .feature-flags/flags.json --policy config/feature-flag-policy.json --output .feature-flags/reference-report.json
```

**Expected result:** scanner completes and produces JSON report.

**Failure behavior:** retry once for transient operational failure; otherwise stop.

**Blocking:** yes.

## PreProtectedRetirement
**Trigger:** before deleting a kill switch/protected flag or high-risk branch.

**Preconditions:** retirement plan and evidence exist.

**Action:** verify explicit human approval is recorded by the host workflow.

**Command:** host-specific approval check; no production mutation is performed by this package.

**Expected result:** approval present.

**Failure behavior:** stop before modification.

**Blocking:** yes.

## PostEdit
**Trigger:** after flag-related source/config edits.

**Preconditions:** changes are saved.

**Action:** rerun validator and scanner; then run the repository's affected formatter/tests/build as configured by the host project.

**Commands:**
```bash
python scripts/validate-feature-flags.py --records .feature-flags/flags.json --policy config/feature-flag-policy.json
python scripts/scan-flag-references.py --root . --records .feature-flags/flags.json --policy config/feature-flag-policy.json --output .feature-flags/reference-report.json
```

**Expected result:** both deterministic checks succeed.

**Failure behavior:** block completion and preserve evidence.

**Blocking:** yes.

## PreComplete
**Trigger:** before lifecycle state is reported as verified.

**Preconditions:** deterministic checks and project tests/build have run.

**Action:** confirm validation success, scanner report, no unexplained stale references, required independent review, and required approvals.

**Command:** rerun the two deterministic commands above against final repository state.

**Expected result:** exit 0 for both and workflow verification criteria satisfied.

**Failure behavior:** do not mark task verified.

**Blocking:** yes.