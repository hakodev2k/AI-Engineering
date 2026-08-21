# Test Environment Parity Hooks

## Hook 1 — Pre-test contract check
**Trigger:** before release-relevant integration/E2E/performance tests.  
**Action:** require a current target environment contract.  
**Failure:** missing contract blocks production-confidence claims.  
**Blocking:** yes.

## Hook 2 — Post-environment-start capture
**Trigger:** after test environment is ready, before relying on test results.  
**Command:** `python scripts/capture-environment.py --output artifacts/environment-snapshot.json --name test-environment --source local-or-ci`  
**Expected:** current value-free snapshot.  
**Failure:** retry once only for transient tool failure.  
**Blocking:** yes.

## Hook 3 — Post-test parity evaluation
**Trigger:** after required tests complete.  
**Command:** `python scripts/evaluate-parity.py --contract environment-contract.json --snapshot artifacts/environment-snapshot.json --policy config/parity-policy.json --output artifacts/parity-evaluation.json`  
**Expected:** `verified`, `review-required`, or `blocked`.  
**Failure:** semantic findings are not automatically retried.  
**Blocking:** `blocked` blocks; `review-required` blocks final completion until reviewed.

## Hook 4 — Pre-dangerous-remediation approval
**Trigger:** before remediation would mutate production/infrastructure/database/secrets/security/breaking contracts.  
**Action:** stop and request exact human approval for action/scope.  
**Blocking:** yes.

## Hook 5 — Final parity gate
**Trigger:** immediately before treating tests as verified release evidence.  
**Command:** `python scripts/evaluate-parity-gate.py --evaluation artifacts/parity-evaluation.json --review artifacts/parity-review.json --implementation-owner implementation-agent --tests-status passed --output artifacts/parity-gate.json`  
**Expected:** `verified`.  
**Failure:** preserve evidence and block completion.  
**Blocking:** yes.
