# Lifecycle Hooks

## Pre-edit evidence hook
**Trigger:** before changing a failing Playwright locator.  
**Preconditions:** failure output or trace evidence exists.  
**Action:** preserve failing step, expected behavior, and current locator in `templates/locator-evidence.md` format.  
**Expected result:** root cause can be distinguished from product/environment failure.  
**Failure behavior:** block locator-only repair when expected behavior is unknown.  
**Blocking:** yes.

## Post-edit selector gate
**Trigger:** after test/page-object edits.  
**Action:** `python scripts/scan_selectors.py --root . --policy config/policy.yaml --output selector-gate.json`.  
**Expected result:** exit 0 or reviewed exit 1; exit 2 blocks.  
**Failure behavior:** do not hand off or merge.  
**Blocking:** yes for exit 2/tool failure.

## Post-gate behavior hook
**Trigger:** after static gate allows review.  
**Action:** run affected Playwright test twice; include dependent tests for shared locator helpers.  
**Expected result:** repeated passes without arbitrary sleeps/retry inflation.  
**Failure behavior:** return to diagnosis; maximum two revisions.  
**Blocking:** yes.

## Final verification hook
**Trigger:** before completion.  
**Action:** independent verifier checks diff, locator semantics, repeated test evidence; run `python scripts/verify_package.py` for package integrity.  
**Expected result:** `verified`.  
**Failure behavior:** report incomplete/inconclusive.  
**Blocking:** yes.
