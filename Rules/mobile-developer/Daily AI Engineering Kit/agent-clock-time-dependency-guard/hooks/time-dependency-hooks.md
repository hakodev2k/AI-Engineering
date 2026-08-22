# Time Dependency Hooks

## Pre-decision validation
**Trigger:** before any time-sensitive decision is evaluated.  
**Preconditions:** observation JSON exists.  
**Action:** validate observation.  
**Command:** `python scripts/validate-time-observation.py <observation.json> --max-skew-ms 2000`  
**Expected:** exit 0 and `status=valid`.  
**Failure:** preserve validation output and block evaluation.  
**Blocking:** yes.

## Pre-side-effect freshness
**Trigger:** immediately before protected side effect.  
**Preconditions:** TimeDecision and policy exist.  
**Action:** re-evaluate current time condition.  
**Command:** `python scripts/evaluate-time-decision.py <decision.json> --policy config/time-policy.json > evaluation.json`  
**Expected:** exit 0 and `status=evaluated`; caller must also require `condition_satisfied=true`.  
**Failure:** refresh trusted time once only for transient/stale evidence; otherwise block.  
**Blocking:** yes.

## Final verification
**Trigger:** after evaluation/review and before execution.  
**Preconditions:** current evaluation; review for high/critical risk.  
**Action:** bind decision, observation and review.  
**Command:** `python scripts/evaluate-final-gate.py <decision.json> <evaluation.json> --policy config/time-policy.json [--review <review.json>]`  
**Expected:** `status=verified`.  
**Failure:** no side effect; preserve evidence.  
**Blocking:** yes.

## Post-execution evidence
**Trigger:** after allowed side effect.  
**Action:** record actual execution timestamp, operation result, observation ID and decision fingerprint without overwriting pre-execution evidence.  
**Failure:** retry evidence write once if transient; if evidence cannot be preserved for high-risk execution, escalate as verification failure.  
**Blocking completion:** yes for high/critical risk.
