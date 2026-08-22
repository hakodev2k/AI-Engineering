# Lifecycle Hooks

## Pre-task scan
**Trigger:** before investigation. **Preconditions:** repository readable. **Action:** `python3 scripts/scan-rate-limit-risk.py <repo> --output scan.json`. **Expected result:** JSON report. Exit 0=no heuristic hits, 1=hits require review, 2=invalid invocation/input. **Failure behavior:** preserve stderr. **Blocking:** only exit 2 blocks context collection.

## Post-edit pressure test
**Trigger:** after retry/concurrency/admission edits. **Preconditions:** safe stub/test environment and focused test command are known. **Action:** run 429 Retry-After, sustained transient failure, burst, saturation, and recovery checks. **Expected result:** bounded in-flight requests, bounded pending work, bounded retries, no pressure growth during throttling. **Failure behavior:** preserve request timeline/metrics; diagnose before rerun; max two transient reruns. **Blocking:** yes.

## Final assessment validation
**Trigger:** before completion. **Preconditions:** assessment JSON exists. **Action:** `python3 scripts/validate-assessment.py assessment.json`. **Expected result:** `assessment valid`. **Failure behavior:** fix contract mismatch; never mark pass while invalid. **Blocking:** yes.
