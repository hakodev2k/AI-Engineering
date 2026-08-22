# Assumption Evidence Hooks

## Pre-plan hook
**Trigger:** before planning or editing begins.  
**Preconditions:** task scope and policy available.  
**Action:** build/update the assumption register and run:
`python scripts/evaluate-assumptions.py assumptions.json config/assumption-policy.json --output assumption-gate.json`
**Expected result:** no unresolved high-risk consumed assumption.  
**Failure:** preserve report and block planning if exit code is 3; route exit code 2 to review/remediation.  
**Blocking:** yes for high-risk blockers.

## Pre-side-effect hook
**Trigger:** immediately before a high-risk or approval-required action.  
**Preconditions:** latest register, current evidence, actor identity, required human approval.  
**Action:** revalidate assumptions whose trigger matches current drift or whose TTL is near/at expiry; recompute fingerprints; run deterministic gate.  
**Expected result:** current evidence and no contradicted/expired consumed assumptions.  
**Failure:** stop action; never use previous successful report after drift.  
**Blocking:** always.

## Post-evidence hook
**Trigger:** after new repository/test/runtime/log/API/database evidence is collected.  
**Action:** update the affected record, append rather than erase historical evidence, then rerun `evaluate-assumptions.py`.  
**Failure:** invalid record or contradictory evidence blocks consumers until replan.  
**Blocking:** yes when material.

## Pre-final-verification hook
**Trigger:** before claiming task verified.  
**Action:** if high/critical assumptions are consumed, obtain independent review; then run:
`python scripts/evaluate-final-gate.py assumption-gate.json assumptions.json config/assumption-policy.json --actor "$AGENT_ID" --review assumption-review.json --output assumption-final.json`
For work without required review, omit `--review`.  
**Expected result:** final status `verified`.  
**Failure:** any stale fingerprint, rejected/missing independent review, or deterministic blocker prevents completion.  
**Blocking:** always.

## Retry policy
Only transient evidence-read/tool failures may retry, maximum once. Validation, permission, contradiction, approval, and business-rule failures do not retry automatically.