# Lifecycle Hooks

## Pre-task scan
**Trigger:** before resilience review. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-circuit-breaker.py <repo> --output scan.json`. **Expected:** JSON report. Exit 0 = no heuristic findings; exit 1 = findings require review; exit 2 = invalid input/invocation. **Blocking:** only exit 2 blocks context collection.

## Post-edit resilience verification
**Trigger:** after timeout/retry/breaker/fallback edits. **Preconditions:** focused test command is known. **Action:** run open-state, half-open, recovery, and fallback tests, then build/static checks. **Expected:** all required transitions pass with bounded probes/retries. **Failure:** preserve output; diagnose before rerun; maximum two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure:** correct the contract or verdict; never mark pass while validation fails. **Blocking:** yes.
