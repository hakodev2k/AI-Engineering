# Lifecycle Hooks

## Pre-task scanner
**Trigger:** before temporal analysis. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-time-risks.py <repo> --output scan.json`. **Expected:** JSON report. Exit 0 = no heuristic hits, 1 = review hits, 2 = invocation/input error. **Blocking:** only exit 2 blocks context collection.

## Post-edit boundary verification
**Trigger:** after date/time logic changes. **Preconditions:** focused test command known. **Action:** run tests for configured zones and boundary cases, then build/static checks. **Expected:** explicit expected/actual timestamps and no regression. **Failure behavior:** preserve command, zone, timestamps, output; diagnose before retry; max two transient reruns. **Blocking:** yes.

## Final contract validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected:** `assessment valid`. **Failure behavior:** fix contract mismatch; never mark `pass` while validation fails. **Blocking:** yes.
