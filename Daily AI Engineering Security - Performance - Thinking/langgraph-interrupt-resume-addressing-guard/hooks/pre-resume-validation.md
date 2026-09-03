# Hook: Pre-Resume Validation

## Trigger
Immediately before the application converts external input into `Command(resume=...)` or equivalent framework resume call.

## Preconditions
The current pending interrupt list has just been fetched from authoritative checkpoint/runtime state.

## Action
Serialize pending interrupts and the external response as the explicit envelope described by `schemas/resume-envelope.schema.json`, then run:

```bash
python scripts/resume_guard.py \
  --policy config/policy.json \
  --pending tests/pending-multiple.json \
  --resume tests/resume-by-id.json
python -m unittest tests/test_resume_guard.py
```

Production adapters SHOULD call the same validation function in-process or implement an equivalent contract.

## Expected result
Exit 0 and a JSON decision with `allowed=true`, explicit `addressed_ids`, and a normalized framework payload.

## Failure behavior
Do not invoke the graph. Return/record the block reason, refresh authoritative state once if stale state is plausible, and stop if ambiguity remains.

## Blocks completion
Yes. A workflow cannot be Verified when a resume bypasses this contract in a multi/nested interrupt path.
