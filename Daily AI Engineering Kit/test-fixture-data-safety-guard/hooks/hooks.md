# Hooks

## Pre-test safety gate
**Trigger:** before integration/API/E2E/Playwright execution.

**Preconditions:** safety manifest exists.

**Action:**
```bash
python scripts/validate-safety-manifest.py --manifest .ai/test-data-safety.json --policy config/test-data-safety-policy.json
```

**Expected result:** exit 0 only for `safe`; exit 3 for `human-approval-required`; exit 2 for `blocked`/invalid.

**Failure behavior:** block test execution. Do not bypass or downgrade the decision.

## Post-run evidence capture
**Trigger:** immediately after test command finishes, regardless of pass/fail.

**Action:** persist run ID, created resource IDs, external side effects, cleanup attempt/result, and pre/post boundary evidence into the review input.

**Expected result:** evidence is tied to one run ID.

**Failure behavior:** mark verification incomplete and block completion.

## Cleanup verification gate
**Trigger:** after scoped cleanup/reset.

**Action:**
```bash
python scripts/evaluate-isolation-gate.py --manifest .ai/test-data-safety.json --review .ai/test-isolation-review.json --policy config/test-data-safety-policy.json
```

**Expected result:** exit 0 only when independent review is `verified` and no blocking isolation condition remains.

**Failure behavior:** block completion; preserve resource IDs for manual recovery.

## CI preflight
**Trigger:** before a workflow job that targets a persistent shared environment.

**Action:** validate environment/fixture manifest before secrets are exposed to the test process.

**Failure behavior:** hard fail the job. This hook must run before the mutating test step.