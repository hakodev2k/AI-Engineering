# Selector Resilience Hooks

## 1. Pre-task selector scope hook
**Trigger:** before editing Playwright tests or selector helpers.  
**Preconditions:** repository revision available.  
**Action:** identify affected test files/page objects and record intended target semantics.  
**Command:** repository-native diff/search plus `node scripts/scan-playwright-selectors.mjs --repo . --policy config/selector-policy.json --output artifacts/selector-inventory.before.json`.  
**Expected result:** baseline inventory is saved.  
**Failure behavior:** stop on unreadable repository/invalid policy; transient read may retry once.  
**Blocks:** yes when scope/revision cannot be established.

## 2. Post-edit static scan hook
**Trigger:** after selector/test/page-object edits.  
**Preconditions:** edits saved.  
**Action:** rescan and validate current selector inventory.  
**Commands:**
```bash
node scripts/scan-playwright-selectors.mjs --repo . --policy config/selector-policy.json --output artifacts/selector-inventory.json
node scripts/validate-selector-inventory.mjs --inventory artifacts/selector-inventory.json --output artifacts/selector-validation.json
node scripts/evaluate-selector-resilience.mjs --inventory artifacts/selector-inventory.json --policy config/selector-policy.json --output artifacts/selector-evaluation.json
```
**Expected result:** valid current inventory and deterministic evaluation.  
**Failure behavior:** validation/blocking finding goes to remediation; no blind retry.  
**Blocks:** yes for `blocked`.

## 3. Runtime uniqueness hook
**Trigger:** evaluator identifies selector risk tier that policy requires probing.  
**Preconditions:** approved non-destructive environment/page state and local Playwright package.  
**Action:** collect match count and visibility without clicks/fills/submits.  
**Command:**
```bash
node scripts/probe-selectors.mjs --inventory artifacts/selector-inventory.json --base-url "$SELECTOR_PROBE_URL" --output artifacts/selector-inventory.probed.json
```
Then re-run the evaluator against `.probed.json`.  
**Expected result:** required selectors have runtime evidence.  
**Failure behavior:** one retry only for transient browser/navigation failure; otherwise block.  
**Blocks:** yes when required evidence is missing/failed.

## 4. Affected Playwright test hook
**Trigger:** after remediation.  
**Preconditions:** selector evaluation has no deterministic blocker.  
**Action:** run repository-native affected Playwright tests.  
**Command:** project-specific, e.g. `npx playwright test path/to/affected.spec.ts`.  
**Expected result:** exit code 0 with retained test evidence.  
**Failure behavior:** hand off to normal test-fix-retest workflow; do not declare selector resilience verified.  
**Blocks:** yes.

## 5. Independent review hook
**Trigger:** evaluation status `review-required`.  
**Preconditions:** current evaluation and implementation owner identity.  
**Action:** obtain review matching `schemas/selector-review.schema.json`, bound to exact revision and inventory fingerprint.  
**Expected result:** approved current independent review.  
**Failure behavior:** stale/self/non-approved review blocks.  
**Blocks:** yes.

## 6. Final selector gate hook
**Trigger:** before PR/release completion claim that depends on Playwright evidence.  
**Preconditions:** current evaluation, required review, affected tests completed.  
**Command:**
```bash
node scripts/evaluate-selector-gate.mjs --evaluation artifacts/selector-evaluation.json --review artifacts/selector-review.json --implementation-owner "$IMPLEMENTATION_OWNER" --output artifacts/selector-gate.json
```
For verified evaluations that require no review, omit `--review`.  
**Expected result:** `status=verified`.  
**Failure behavior:** stop and preserve artifacts.  
**Blocks:** yes.

## 7. Pre-dangerous-action approval hook
**Trigger:** selector remediation requires production deployment, breaking public/accessibility contract, security weakening, force push, or production configuration change.  
**Action:** stop before side effect and request explicit human approval through the host workflow.  
**Expected result:** approval is scope-bound and separate from selector review.  
**Failure behavior:** no action is executed.  
**Blocks:** yes.
