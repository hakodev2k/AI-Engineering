# Hook: Pre-Resume Conformance Check

## Trigger
Before enabling a checkpoint backend/version for automatic resume, replay, routing from persisted metadata, or recovery.

## Preconditions
An observation JSON generated from the approved fixture corpus exists and identifies backend/version.

## Action
Run:

```bash
python scripts/conformance_check.py --profile config/invariants.json --observations <observations.json>
```

## Expected result
Exit `0` and `eligible: true`; every required invariant is present and true.

## Failure behavior
Exit `3` means semantic non-conformance and blocks resume. Exit `2` means invalid/missing evidence and also blocks resume. Do not retry by switching to another unverified backend.

## Blocking
Yes when persisted facts are used for correctness, routing, authorization, recovery, or audit decisions.
