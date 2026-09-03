# Hook: Pre-acceptance Handoff Check

## Trigger
Immediately before a parent/orchestrator marks a delegated task complete.

## Preconditions
A handoff envelope and `config/policy.json` exist; artifact base is readable when artifact handoff is used.

## Action
Run:

```bash
python scripts/validate_handoff.py --envelope <handoff.json> --policy config/policy.json --artifact-base <artifact-root> --output <validation.json>
python -m unittest tests/test_validate_handoff.py
```

Then run the task-specific verification named in the handoff evidence.

## Expected result
Validator exits 0 with `status: accept`; unit tests pass; the parent or independent verifier can retrieve the actual deliverable and confirm task acceptance criteria.

## Failure behavior
Block completion. Preserve checkpoints and route to `workflows/delegate-handoff-recover.md`. Do not convert a missing deliverable into success based only on worker status.

## Blocking
Yes.
