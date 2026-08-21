# Test Oracle Lifecycle Hooks

## Pre-test-generation
**Trigger:** before an agent creates or rewrites assertions.  
**Preconditions:** behavior and evidence sources identified.  
**Action:** run `skills/derive-independent-oracle.md`; save claims and fingerprint.  
**Expected result:** source-bound claims exist.  
**Failure:** block generation if no independent source exists for required behavior.  
**Blocking:** yes.

## Post-test-edit assertion inventory
**Trigger:** after assertion/test changes.  
**Command:** `python scripts/extract-test-assertions.py --repo <repo> --output <assertions.json>`  
**Expected result:** deterministic assertion inventory.  
**Failure:** preserve error; retry transient tool failure at most once.  
**Blocking:** yes.

## Post-inventory contamination gate
**Trigger:** after assertion inventory.  
**Command:** `python scripts/detect-oracle-contamination.py --claims <claims.json> --assertions <assertions.json> --policy config/oracle-policy.json --output <contamination.json>`  
**Expected result:** zero blockers.  
**Failure:** do not override; return to evidence/test design.  
**Blocking:** yes.

## High-risk mutation checkpoint
**Trigger:** any claim with policy-configured mutation-required risk.  
**Action:** execute host repository mutation/fault-injection tooling and save `{"mutants":N,"killed":K}`.  
**Expected result:** configured count and kill ratio satisfied.  
**Failure:** block final verification.  
**Blocking:** yes.

## Independent-review checkpoint
**Trigger:** high-risk claim or contamination warning.  
**Preconditions:** contamination blockers absent.  
**Action:** reviewer follows `skills/review-test-oracle.md`; review binds current oracle fingerprint.  
**Expected result:** approved review from a reviewer distinct from implementation owner.  
**Failure:** reject or stale review blocks final gate.  
**Blocking:** yes when required.

## Final verification
**Trigger:** before declaring task verified.  
**Command:** `python scripts/evaluate-oracle-gate.py --claims <claims.json> --contamination <contamination.json> --policy config/oracle-policy.json [--mutation <mutation.json>] [--review <review.json>] --implementation-owner <owner> --output <gate.json>`  
**Expected result:** `status=verified`, exit code 0.  
**Failure:** report executed-but-not-verified and preserve artifacts.  
**Blocking:** yes.
