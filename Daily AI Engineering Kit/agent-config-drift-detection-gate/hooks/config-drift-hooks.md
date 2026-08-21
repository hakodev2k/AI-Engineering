# Configuration Drift Hooks

## Pre-task validation
**Trigger:** before investigation.  
**Preconditions:** expected and actual JSON snapshot paths are known.  
**Action:** confirm both files exist, are valid JSON, and represent the same declared environment/application scope.  
**Command:** `python3 -m json.tool <snapshot>` for each snapshot.  
**Expected result:** both commands exit `0`.  
**Failure:** collect parser/scope evidence and stop.  
**Blocking:** yes.

## Drift detection
**Trigger:** after snapshot validation and after each remediation attempt.  
**Preconditions:** validated snapshots and policy.  
**Action:** run deterministic comparison.  
**Command:** `python3 scripts/detect-config-drift.py --expected expected.json --actual actual.json --policy config/drift-policy.json --output artifacts/drift-report.json`  
**Expected result:** exit `0` for clean or `2` for detected drift.  
**Failure:** exit `3` is a tool/input failure and blocks classification.  
**Blocking:** yes for errors; drift itself routes to investigation.

## Report verification
**Trigger:** immediately after detection.  
**Preconditions:** report exists.  
**Action:** validate report structure and redaction invariant.  
**Command:** `python3 scripts/verify-drift-report.py artifacts/drift-report.json`  
**Expected result:** exit `0`.  
**Failure:** preserve report, do not publish it as verified, and stop.  
**Blocking:** yes.

## Final verification
**Trigger:** before completion.  
**Preconditions:** post-change snapshot, tests/build evidence, diff/change receipt, required approvals.  
**Action:** rerun detector/verifier and independently inspect unintended changes.  
**Expected result:** detector `0`, verifier `0`, tests/build pass, approval requirements satisfied.  
**Failure:** one remediation replan is allowed; subsequent failure escalates.  
**Blocking:** yes.
