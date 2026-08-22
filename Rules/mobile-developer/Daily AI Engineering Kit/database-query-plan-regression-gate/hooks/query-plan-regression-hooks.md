# Hooks: Query Plan Regression Lifecycle

## Pre-task: evidence boundary check

**Trigger:** before a task that may alter SQL/ORM execution behavior.  
**Preconditions:** query identity and candidate source revision are known.  
**Action:** identify baseline evidence/original plan and representative dataset profile.  
**Expected result:** comparable baseline is available or workflow is explicitly blocked for recapture.  
**Failure behavior:** missing/incomparable baseline blocks performance verification.  
**Blocking:** yes.

## Post-capture: evidence validation

**Trigger:** after each normalized plan capture.  
**Command:**

```bash
python scripts/validate-query-plan-evidence.py <evidence.json>
```

**Expected result:** exit `0` and `VALID`.  
**Failure behavior:** do not compare invalid evidence; recapture/fix source.  
**Blocking:** yes.

## Post-edit: regression comparison

**Trigger:** after candidate query-affecting edits and plan capture.  
**Command:**

```bash
python scripts/compare-query-plans.py baseline.json candidate.json --policy config/query-plan-policy.json --output comparison.json
```

**Expected result:** `pass`, `review-required`, or `blocked` with deterministic deltas.  
**Failure behavior:** `blocked` stops completion; `review-required` routes to reviewer/remediation.  
**Blocking:** yes for `blocked`; conditional for `review-required`.

## Pre-dangerous-remediation: approval boundary

**Trigger:** before applying index/schema/statistics/config changes in protected or production environments.  
**Action:** stop and obtain explicit human approval with exact change scope and rollback/recovery plan.  
**Failure behavior:** no mutation.  
**Blocking:** yes.

## Final verification

**Trigger:** before marking task complete/merge-ready/release-ready.  
**Command:**

```bash
python scripts/evaluate-query-plan-gate.py comparison.json --policy config/query-plan-policy.json --review review.json --output gate.json
```

If independent review is not required, omit `--review`.  
**Expected result:** `gate.json.status == "verified"` and process exit `0`.  
**Failure behavior:** task may have executed but must not be reported as verified.  
**Blocking:** yes.

## Retry behavior

Only transient plan-capture/tool errors may retry once. Validation, regression, stale-review, approval, and business-rule failures are not retryable without changed evidence or remediation.
