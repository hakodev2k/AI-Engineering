# Hook: Pre-Resume Check

## Trigger
Immediately before automatic retry/resume of a checkpointed task.

## Preconditions
A JSON task record exists with dependency classifications, availability, original fingerprint when available, completion state, and side-effect metadata.

## Action
```bash
python scripts/resume_contract_check.py task-record.json
python -m unittest tests/test_resume_contract_check.py
```

## Expected result
The checker exits 0 only when required inputs are available/reconstructable, the logical-input fingerprint matches, and no unsafe completed side effect would be replayed.

## Failure behavior
Block automatic resume. Route to the bounded recovery path in `workflows/recover-verify.md`; do not synthesize missing inputs or silently restart the task.

## Blocking
Yes.
