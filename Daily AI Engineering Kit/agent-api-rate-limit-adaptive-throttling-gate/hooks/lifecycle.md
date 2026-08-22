# Lifecycle Hooks

## Pre-task: retry ownership validation
- **Trigger:** before investigation or implementation.
- **Preconditions:** repository is readable and the affected API client is identified.
- **Action:** locate client/SDK retry settings plus caller/job retry logic; record every retry layer.
- **Command/script:** repository search plus `python scripts/adaptive_throttle.py --statuses 200` as a smoke check.
- **Expected result:** retry owner and current budgets are known.
- **Failure behavior:** block implementation when retry ownership is unknown.
- **Blocking:** yes.

## Post-edit: deterministic throttle gate
- **Trigger:** after retry/backoff/concurrency changes.
- **Preconditions:** Python 3.9+.
- **Action:** exercise recovery and stop behavior.
- **Command/script:** `python scripts/adaptive_throttle.py --statuses 429,429,200 --retry-after 1` and `python scripts/adaptive_throttle.py --statuses 401,200`.
- **Expected result:** first command exits 0; second exits non-zero without a second attempt.
- **Failure behavior:** preserve output and return to implementer.
- **Blocking:** yes.

## Test hook
- **Trigger:** before verification handoff.
- **Action:** run `python -m pytest tests/test_adaptive_throttle.py -q` plus project-specific tests for the affected client.
- **Expected result:** all relevant tests pass.
- **Failure behavior:** maximum two implementation correction cycles.
- **Blocking:** yes.

## Final verification hook
- **Trigger:** before declaring completion.
- **Action:** run `python scripts/verify_package.py` and independent verification from `subagents/rate-limit-verifier.md`.
- **Expected result:** package verification exits 0 and verifier status is `verified`.
- **Failure behavior:** block completion and preserve missing-file/test evidence.
- **Blocking:** yes.
