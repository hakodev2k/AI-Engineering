# Hook: Pre-Resume Orphan Check

## Trigger
Before replaying or resuming a persisted agent session.

## Preconditions
Authoritative journal path is available and stable for the duration of the scan.

## Action
Run:

```bash
python scripts/tool_journal_guard.py --journal <journal.jsonl> --mode check
python -m unittest tests/test_tool_journal_guard.py
```

If the checker exits 1, generate a non-mutating recovery plan:

```bash
python scripts/tool_journal_guard.py --journal <journal.jsonl> --mode recovery-plan --out recovery-plan.json
```

## Expected result
Exit 0 from integrity check and tests before autonomous resume.

## Failure behavior
Block resume. For orphan calls, classify execution as indeterminate until external evidence resolves it. Do not synthesize success or blindly retry side-effecting actions.

## Blocking
Yes.
